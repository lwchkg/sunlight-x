import * as logger from "../logger";
import * as util from "../util";
import type { ParserContext, Token } from "../util";

/**
 * See if |context| is inside an open bracket.
 * @param {ParserContext} context
 * @returns {boolean}
 */
function isInsideOpenBracket(context: ParserContext): boolean {
  const walker = context.getTokenWalker();

  while (walker.hasPrev()) {
    const token = walker.prev();
    if (token.name === "operator" && (token.value === ">" || token.value === "/>" || token.value === "</")) return false;
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
export const numberParser = function () {};
export const customTokens = {
  xmlOpenTag: {
    values: ["<?xml"],
    boundary: ""
  },
  xmlCloseTag: {
    values: ["?>"],
    boundary: ""
  },
  aspOpenTag: {
    values: ["<%@", "<%$", "<%#", "<%=", "<%"],
    boundary: ""
  },
  aspCloseTag: {
    values: ["%>"],
    boundary: ""
  }
};
export const customParseRules = [// tag names
function (context: ParserContext): Token | null | undefined {
  if (!/[A-Za-z_]/.test(context.reader.peek())) return null;
  const prevToken = context.token(context.count() - 1);
  if (!prevToken || prevToken.name !== "operator" || !util.contains(["<", "</"], prevToken.value)) return null;
  // read the tag name
  let tagName = context.reader.read();

  // allow periods in tag names so that ASP.NET web.config files
  // work correctly
  while (!context.reader.isEOF() && /[.\w-]/.test(context.reader.peek())) tagName += context.reader.read();

  return context.createToken("tagName", tagName);
}, // strings (attribute values)
function (context: ParserContext): Token | null | undefined {
  const delimiter = context.reader.peek();
  if (delimiter !== '"' && delimiter !== "'") return null;
  if (!isInsideOpenBracket(context)) return null;
  // read until the delimiter
  let stringValue = context.reader.read();

  while (!context.reader.isEOF()) {
    const next = context.reader.read();
    stringValue += next;
    if (next === delimiter) break;
  }

  return context.createToken("string", stringValue);
}, // attributes
function (context: ParserContext): Token | null | undefined {
  if (!/[A-Za-z_]/.test(context.reader.peek())) return null;
  // must be between < and >
  if (!isInsideOpenBracket(context)) return null;
  // look forward for >
  let offset: number;
  let tokenLength: number = 0;

  for (offset = 1;; offset++) {
    const peek = context.reader.peekWithOffset(offset);
    if (peek === "" || peek === "<") return null;

    if (peek === ">") {
      if (!tokenLength) tokenLength = offset;
      break;
    }

    if (!tokenLength && /[=\s:]/.test(peek)) tokenLength = offset;
  }

  return context.createToken("attribute", context.reader.read(tokenLength));
}, // entities
function (context: ParserContext): Token | null | undefined {
  if (!context.reader.match("&")) return null;

  for (let offset = 1;; offset++) {
    const peek = context.reader.peekWithOffset(offset);
    if (peek === "") return null;
    if (peek === ";") return context.createToken("entity", context.reader.read(offset + 1));
    if (!/[A-Za-z0-9]/.test(peek)) return null;
  }
}, // asp.net server side comments: <%-- --%>
function (context: ParserContext): Token | null | undefined {
  const startAspToken = "<%--";
  const endAspToken = "--%>";
  // have to do these manually or else they get swallowed by the open tag: <%
  if (!context.reader.match(startAspToken)) return null;
  let value = context.reader.read(startAspToken.length);

  while (!context.reader.isEOF() && !context.reader.match(endAspToken)) value += context.reader.read();

  value += context.reader.read(endAspToken.length);
  return context.createToken("comment", value);
}];
export const embeddedLanguages = {
  css: {
    switchTo: function (context: ParserContext): boolean {
      if (context.options.enableScalaXmlInterpolation === true) return false;
      if (context.reader.match("</style")) return false;
      const walker = context.getTokenWalker();
      if (!walker.hasPrev()) return false;
      const prevToken = walker.prev();
      if (prevToken.name !== "operator" || prevToken.value !== ">") return false;

      // look backward for a tag name, if it's "style", then we go to css mode
      while (walker.hasPrev()) {
        const prevToken = walker.prev();

        if (prevToken.name === "tagName") {
          if (prevToken.value === "style") {
            // make sure it's not a closing tag
            if (!walker.hasPrev()) break;
            const prevToken = walker.prev();
            if (prevToken.name === "operator" && prevToken.value === "<") return true;
          }

          break;
        }
      }

      return false;
    },
    switchBack: function (context: ParserContext): boolean {
      return context.reader.match("</style");
    }
  },
  javascript: {
    switchTo: function (context: ParserContext): boolean {
      if (context.reader.match("</script")) return false;
      const walker = context.getTokenWalker();
      if (!walker.hasPrev()) return false;
      const prevToken = walker.prev();
      if (prevToken.name !== "operator" || prevToken.value !== ">") return false;

      // look backward for a tag name, if it's "script", then we go to javascript mode
      while (walker.hasPrev()) {
        const prevToken = walker.prev();

        if (prevToken.name === "tagName") {
          if (prevToken.value === "script") {
            // make sure it's not a closing tag
            if (!walker.hasPrev()) break;
            const prevToken = walker.prev();
            if (prevToken && prevToken.name === "operator" && prevToken.value === "<") return true;
          }

          break;
        }
      }

      return false;
    },
    switchBack: function (context: ParserContext): boolean {
      return context.reader.match("</script");
    }
  },
  php: {
    switchTo: function (context: ParserContext): boolean {
      return context.reader.match("<?") && !context.reader.match("<?xml");
    },
    switchBack: function (context: ParserContext): boolean {
      const prevToken = context.token(context.count() - 1);
      return prevToken && prevToken.name === "closeTag";
    }
  },
  csharp: {
    switchTo: function (context: ParserContext): boolean {
      const prevToken = context.token(context.count() - 1);
      return prevToken && prevToken.name === "aspOpenTag";
    },
    switchBack: function (context: ParserContext): boolean {
      return context.reader.match("%>");
    }
  },
  scala: {
    switchTo: function (context: ParserContext): boolean {
      context.items.scalaBracketNestingLevel = 0;
      return context.options.enableScalaXmlInterpolation === true && context.reader.match("{");
    },
    switchBack: function (context: ParserContext): boolean {
      const prevToken = context.token(context.count() - 1);

      if (typeof context.items.scalaBracketNestingLevel !== "number") {
        logger.errorInvalidValue(`scalaBracketNestingLevel is not a number.`, context.items.scalaBracketNestingLevel);
        return true;
      }

      if (prevToken.name === "punctuation") if (prevToken.value === "{") {
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