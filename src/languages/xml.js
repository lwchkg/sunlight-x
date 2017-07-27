// @flow
import * as logger from "../logger.js";
import * as util from "../util.js";

import type { ParserContext, Token } from "../util.js";

/**
 * See if |context| is inside an open bracket.
 * @param {ParserContext} context
 * @returns {boolean}
 */
function isInsideOpenBracket(context: ParserContext): boolean {
  const walker = context.getTokenWalker();
  while (walker.hasPrev()) {
    const token = walker.prev();
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
  comment: [["<!--", "-->", [], false], ["<%--", "--%>", [], false]],
  cdata: [["<![CDATA[", "]]>", [], false]],
  doctype: [["<!DOCTYPE", ">", [], false]]
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
  function(context: ParserContext): ?Token {
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
    let tagName = current;
    // allow periods in tag names so that ASP.NET web.config files
    // work correctly
    while (!context.reader.isPeekEOF() && /[.\w-]/.test(context.reader.peek()))
      tagName += context.reader.read();

    return context.createToken("tagName", tagName, line, column);
  },

  // strings (attribute values)
  function(context: ParserContext): ?Token {
    const delimiter = context.reader.current();
    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    if (delimiter !== '"' && delimiter !== "'") return null;

    if (!isInsideOpenBracket(context)) return null;

    // read until the delimiter
    let stringValue = delimiter;
    while (!context.reader.isPeekEOF()) {
      const next = context.reader.read();
      stringValue += next;

      if (next === delimiter) break;
    }

    return context.createToken("string", stringValue, line, column);
  },

  // attributes
  function(context: ParserContext): ?Token {
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
  function(context: ParserContext): ?Token {
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
  function(context: ParserContext): ?Token {
    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    const startAspToken = "<%--";
    const endAspToken = "--%>";
    // have to do these manually or else they get swallowed by the open tag: <%
    if (!context.reader.match(startAspToken)) return null;

    let value = context.reader.current();
    value += context.reader.read(startAspToken.length);

    while (!context.reader.isPeekEOF() && !context.reader.match(endAspToken))
      value += context.reader.read();

    value += context.reader.read(endAspToken.length - 1);

    return context.createToken("comment", value, line, column);
  }
];

export const embeddedLanguages = {
  css: {
    switchTo: function(context: ParserContext): boolean {
      if (context.reader.match("</style")) return false;

      const walker = context.getTokenWalker();
      if (!walker.hasPrev()) return false;
      const prevToken = walker.prev();

      if (prevToken.name !== "operator" || prevToken.value !== ">")
        return false;

      // look backward for a tag name, if it's "style", then we go to css mode
      while (walker.hasPrev()) {
        const prevToken = walker.prev();
        if (prevToken.name === "tagName") {
          if (prevToken.value === "style") {
            // make sure it's not a closing tag
            if (!walker.hasPrev()) break;
            const prevToken = walker.prev();
            if (prevToken.name === "operator" && prevToken.value === "<")
              return true;
          }
          break;
        }
      }
      return false;
    },

    switchBack: function(context: ParserContext): boolean {
      return context.reader.matchPeek("</style");
    }
  },

  javascript: {
    switchTo: function(context: ParserContext): boolean {
      if (context.reader.match("</script")) return false;

      const walker = context.getTokenWalker();
      if (!walker.hasPrev()) return false;
      const prevToken = walker.prev();

      if (prevToken.name !== "operator" || prevToken.value !== ">")
        return false;

      // look backward for a tag name, if it's "script", then we go to javascript mode
      while (walker.hasPrev()) {
        const prevToken = walker.prev();
        if (prevToken.name === "tagName") {
          if (prevToken.value === "script") {
            // make sure it's not a closing tag
            if (!walker.hasPrev()) break;
            const prevToken = walker.prev();
            if (
              prevToken &&
              prevToken.name === "operator" &&
              prevToken.value === "<"
            )
              return true;
          }
          break;
        }
      }
      return false;
    },

    switchBack: function(context: ParserContext): boolean {
      return context.reader.matchPeek("</script");
    }
  },

  php: {
    switchTo: function(context: ParserContext): boolean {
      return context.reader.match("<?") && !context.reader.match("<?xml");
    },

    switchBack: function(context: ParserContext): boolean {
      const prevToken = context.token(context.count() - 1);
      return prevToken && prevToken.name === "closeTag";
    }
  },

  csharp: {
    switchTo: function(context: ParserContext): boolean {
      const prevToken = context.token(context.count() - 1);
      return prevToken && prevToken.name === "aspOpenTag";
    },

    switchBack: function(context: ParserContext): boolean {
      return context.reader.matchPeek("%>");
    }
  },

  scala: {
    switchTo: function(context: ParserContext): boolean {
      return (
        context.options.enableScalaXmlInterpolation === true &&
        context.reader.current() === "{"
      );
    },

    switchBack: function(context: ParserContext): boolean {
      const prevToken = context.token(context.count() - 1);

      if (typeof context.items.scalaBracketNestingLevel !== "number") {
        logger.errorInvalidValue(
          `scalaBracketNestingLevel is not a number.`,
          context.items.scalaBracketNestingLevel
        );
        return true;
      }

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
