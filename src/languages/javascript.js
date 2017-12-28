// @flow
import * as util from "../util.js";
import { ParseRegExpLiteral } from "./common/regexp.js";

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

export const customParseRules = [ParseRegExpLiteral];

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
