import * as util from "../util.js";

/**
 * See if |context| is inside an open bracket.
 * @param {Object} context
 * @returns {boolean}
 */
function isInsideOpenBracket(context) {
  let token;
  let index = context.count();
  while ((token = context.token(--index))) {
    if (
      token.name === "operator" &&
      (token.value === ">" || token.value === "/>" || token.value === "</")
    )
      return false;

    if (token.name === "tagName" || token.name === "xmlOpenTag") return true;
  }

  return false;
}

export const name = "xml";

export const caseInsensitive = true;

export const scopes = {
  comment: [["<!--", "-->"], ["<%--", "--%>"]],
  cdata: [["<![CDATA[", "]]>"]],
  doctype: [["<!DOCTYPE", ">"]]
};

export const punctuation = /(?!x)x/;
export const numberParser = function() {};

export const customTokens = {
  xmlOpenTag: { values: ["<?xml"], boundary: "" },
  xmlCloseTag: { values: ["?>"], boundary: "" },
  aspOpenTag: { values: ["<%@", "<%$", "<%#", "<%=", "<%"], boundary: "" },
  aspCloseTag: { values: ["%>"], boundary: "" }
};

export const customParseRules = [
  // tag names
  function(context) {
    const current = context.reader.current();
    const line = context.reader.getLine();
    const column = context.reader.getColumn();
    if (!/[A-Za-z_]/.test(current)) return null;

    const prevToken = context.token(context.count() - 1);
    if (
      !prevToken ||
      prevToken.name !== "operator" ||
      !util.contains(["<", "</"], prevToken.value)
    )
      return null;

    // read the tag name
    let peek;
    let tagName = current;
    while ((peek = context.reader.peek())) {
      // allow periods in tag names so that ASP.NET web.config files
      // work correctly
      if (!/[.\w-]/.test(peek)) break;

      tagName += context.reader.read();
    }

    return context.createToken("tagName", tagName, line, column);
  },

  // strings (attribute values)
  function(context) {
    const delimiter = context.reader.current();
    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    if (delimiter !== '"' && delimiter !== "'") return null;

    if (!isInsideOpenBracket(context)) return null;

    // read until the delimiter
    let stringValue = delimiter;
    let peek;
    while ((peek = context.reader.peek())) {
      stringValue += context.reader.read();

      if (peek === delimiter) break;
    }

    return context.createToken("string", stringValue, line, column);
  },

  // attributes
  function(context) {
    const current = context.reader.current();
    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    if (!/[A-Za-z_]/.test(current)) return null;

    // must be between < and >

    if (!isInsideOpenBracket(context)) return null;

    // look forward for >
    let peek = context.reader.peek();
    let count = 1;
    let attribute;
    while (peek.length === count) {
      if (/<$/.test(peek)) return null;

      if (/>$/.test(peek)) {
        attribute = attribute || current + peek.substring(0, peek.length - 1);
        context.reader.read(attribute.length - 1);
        return context.createToken("attribute", attribute, line, column);
      }

      if (!attribute && /[=\s:]$/.test(peek))
        attribute = current + peek.substring(0, peek.length - 1);

      peek = context.reader.peek(++count);
    }

    return null;
  },

  // entities
  function(context) {
    const current = context.reader.current();
    const line = context.reader.getLine();
    const column = context.reader.getColumn();
    if (current !== "&") return null;

    // find semicolon, or whitespace, or < or >
    let count = 1;
    let peek = context.reader.peek(count);
    while (peek.length === count) {
      if (peek.charAt(peek.length - 1) === ";")
        return context.createToken(
          "entity",
          current + context.reader.read(count),
          line,
          column
        );

      if (!/[A-Za-z0-9]$/.test(peek)) break;

      peek = context.reader.peek(++count);
    }

    return null;
  },

  // asp.net server side comments: <%-- --%>
  function(context) {
    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    const startAspToken = "<%--";
    const endAspToken = "--%>";
    // have to do these manually or else they get swallowed by the open tag: <%
    if (
      context.reader.current() !== startAspToken.charAt(0) ||
      context.reader.peek(startAspToken.length - 1) !== startAspToken.slice(1)
    )
      return null;

    let value = startAspToken;
    context.reader.read(startAspToken.length - 1);
    while (context.reader.peek()) {
      if (context.reader.peek(endAspToken.length) === endAspToken) {
        value += context.reader.read(endAspToken.length);
        break;
      }

      value += context.reader.read();
    }

    return context.createToken("comment", value, line, column);
  }
];

export const embeddedLanguages = {
  css: {
    switchTo: function(context) {
      let prevToken = context.token(context.count() - 1),
        index;

      const endStyleToken = "</style";
      if (
        !prevToken ||
        context.reader.current() +
          context.reader.peek(endStyleToken.length - 1) ===
          endStyleToken
      )
        return false;

      if (prevToken.name !== "operator" || prevToken.value !== ">")
        return false;

      // look backward for a tag name, if it's "style", then we go to css mode
      index = context.count() - 1;
      while ((prevToken = context.token(--index)))
        if (prevToken.name === "tagName") {
          if (prevToken.value === "style") {
            // make sure it's not a closing tag
            prevToken = context.token(--index);
            if (
              prevToken &&
              prevToken.name === "operator" &&
              prevToken.value === "<"
            )
              return true;
          }

          break;
        }

      return false;
    },

    switchBack: function(context) {
      const endStyleToken = "</style";
      return context.reader.peek(endStyleToken.length) === endStyleToken;
    }
  },

  javascript: {
    switchTo: function(context) {
      let prevToken = context.token(context.count() - 1),
        index;

      const endScriptToken = "</script";
      if (
        !prevToken ||
        context.reader.current() +
          context.reader.peek(endScriptToken.length - 1) ===
          endScriptToken
      )
        return false;

      if (prevToken.name !== "operator" || prevToken.value !== ">")
        return false;

      // look backward for a tag name, if it's "script", then we go to javascript mode
      index = context.count() - 1;
      while ((prevToken = context.token(--index)))
        if (prevToken.name === "tagName") {
          if (prevToken.value === "script") {
            // make sure it's not a closing tag
            prevToken = context.token(--index);
            if (
              prevToken &&
              prevToken.name === "operator" &&
              prevToken.value === "<"
            )
              return true;
          }

          break;
        }

      return false;
    },

    switchBack: function(context) {
      const endScriptToken = "</script";
      return context.reader.peek(endScriptToken.length) === endScriptToken;
    }
  },

  php: {
    switchTo: function(context) {
      const phpToken = "?php";
      const peek = context.reader.peek(phpToken.length);
      return (
        context.reader.current() === "<" &&
        (peek === "?php" || /^\?(?!xml)/.test(peek))
      );
    },

    switchBack: function(context) {
      const prevToken = context.token(context.count() - 1);
      return prevToken && prevToken.name === "closeTag";
    }
  },

  csharp: {
    switchTo: function(context) {
      const prevToken = context.token(context.count() - 1);
      return prevToken && prevToken.name === "aspOpenTag";
    },

    switchBack: function(context) {
      const endCSToken = "%>";
      return context.reader.peek(endCSToken.length) === endCSToken;
    }
  },

  scala: {
    switchTo: function(context) {
      if (!context.options.enableScalaXmlInterpolation) return false;

      if (context.reader.current() === "{") return true;

      return false;
    },

    switchBack: function(context) {
      const prevToken = context.token(context.count() - 1);

      if (prevToken.name === "punctuation")
        if (prevToken.value === "{") {
          context.items.scalaBracketNestingLevel++;
        } else if (prevToken.value === "}") {
          context.items.scalaBracketNestingLevel--;
          if (context.items.scalaBracketNestingLevel === 0) return true;
        }

      return false;
    }
  }
};

export const contextItems = {
  scalaBracketNestingLevel: 0
};

export const operators = ["=", "/>", "</", "<", ">", ":"];
