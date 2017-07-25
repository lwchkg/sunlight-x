// @flow
import * as util from "../util.js";

import type { ParserContext, Token } from "../util.js";

export const name = "javascript";

export const keywords = [
  // keywords
  "break",
  "case",
  "catch",
  "continue",
  "default",
  "delete",
  "do",
  "else",
  "finally",
  "for",
  "function",
  "if",
  "in",
  "instanceof",
  "new",
  "return",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",

  // literals
  "true",
  "false",
  "null"
];

export const customTokens = {
  reservedWord: {
    values: [
      "abstract",
      "boolean",
      "byte",
      "char",
      "class",
      "const",
      "debugger",
      "double",
      "enum",
      "export const",
      "extends",
      "final",
      "float",
      "goto",
      "implements",
      "import",
      "int",
      "interface",
      "long",
      "native",
      "package",
      "private",
      "protected",
      "public",
      "short",
      "static",
      "super",
      "synchronized",
      "throws",
      "transient",
      "volatile"
    ],
    boundary: "\\b"
  },

  globalVariable: {
    values: ["NaN", "Infinity", "undefined"],
    boundary: "\\b"
  },

  globalFunction: {
    values: [
      "encodeURI",
      "encodeURIComponent",
      "decodeURI",
      "decodeURIComponent",
      "parseInt",
      "parseFloat",
      "isNaN",
      "isFinite",
      "eval"
    ],
    boundary: "\\b"
  },

  globalObject: {
    values: [
      "Math",
      "JSON",
      "XMLHttpRequest",
      "XDomainRequest",
      "ActiveXObject",
      "Boolean",
      "Date",
      "Array",
      "Image",
      "Function",
      "Object",
      "Number",
      "RegExp",
      "String"
    ],
    boundary: "\\b"
  }
};

export const scopes = {
  string: [
    ['"', '"', util.escapeSequences.concat(['\\"']), false],
    ["'", "'", util.escapeSequences.concat(["\\'", "\\\\"]), false]
  ],
  comment: [["//", "\n", [], true], ["/*", "*/", [], false]]
};

export const customParseRules = [
  // regex literal
  function(context: ParserContext): ?Token {
    // Not a regex if it doesn't start with a / or starts with // (comment) or /*
    // (multi line comment).
    const peek = context.reader.peek();
    if (context.reader.current() !== "/" || peek === "/" || peek === "*")
      return null;

    const previousNonWsToken = context.token(context.count() - 1);
    let previousToken = null;
    if (context.defaultData.text !== "")
      previousToken = context.createToken(
        "default",
        context.defaultData.text,
        context.defaultData.line,
        context.defaultData.column
      );

    if (!previousToken) previousToken = previousNonWsToken;

    if (
      // The first token of the string
      previousToken !== undefined &&
      // Since JavaScript doesn't require statement terminators, if the previous
      // token was whitespace and contained a newline, then we're good.
      (previousToken.name !== "default" ||
        previousToken.value.indexOf("\n") < 0)
    ) {
      // In these case the / stands for division.
      if (
        util.contains(["keyword", "ident", "number"], previousNonWsToken.name)
      )
        return null;
      if (
        previousNonWsToken.name === "punctuation" &&
        !util.contains(["(", "{", "[", ",", ";"], previousNonWsToken.value)
      )
        return null;
    }

    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    // read the regex literal
    let regexLiteral = "/";
    let charClass = false;
    while (!context.reader.isPeekEOF()) {
      const next = context.reader.read();
      regexLiteral += next;

      if (next === "\\") regexLiteral += context.reader.read();
      else if (next === "[") charClass = true;
      else if (next === "]") charClass = false;
      else if (next === "/" && !charClass) break;
    }

    // Read the regex modifiers. Only "g", "i" and "m", "u" and "y" are allowed,
    // but in the future extra letters may be allowed, so we allow any
    // alphabetical character here.
    while (context.reader.peek() !== context.reader.EOF) {
      if (!/[A-Za-z]/.test(context.reader.peek())) break;

      regexLiteral += context.reader.read();
    }

    return context.createToken("regexLiteral", regexLiteral, line, column);
  }
];

export const identFirstLetter = /[$A-Za-z_]/;
export const identAfterFirstLetter = /[\w$]/;

export const namedIdentRules = {
  follows: [[{ token: "keyword", values: ["function"] }, util.whitespace]]
};

export const operators = [
  // arithmetic
  "++",
  "+=",
  "+",
  "--",
  "-=",
  "-",
  "*=",
  "*",
  "/=",
  "/",
  "%=",
  "%",

  // boolean
  "&&",
  "||",

  // bitwise
  "|=",
  "|",
  "&=",
  "&",
  "^=",
  "^",
  ">>>=",
  ">>>",
  ">>=",
  ">>",
  "<<=",
  "<<",

  // inequality
  "<=",
  "<",
  ">=",
  ">",
  "===",
  "==",
  "!==",
  "!=",

  // unary
  "!",
  "~",

  // other
  "?",
  ":",
  ".",
  "="
];
