// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { Token } from "../util.js";
import * as util from "../util.js";
import { ParseRegExpLiteral } from "./common/regexp.js";

import type { AnalyzerContext, ParserContext } from "../util.js";

/* eslint no-magic-numbers: 1 */
export const name = "actionscript";
export const keywords = [
  "default xml namespace",
  "use namespace",

  "break",
  "case",
  "catch",
  "continue",
  "default",
  "do",
  "else",
  "finally",
  "for",
  "if",
  "in",
  "label",
  "return",
  "super",
  "switch",
  "throw",
  "try",
  "while",
  "with",

  "dynamic",
  "final",
  "internal",
  "native",
  "override",
  "private",
  "protected",
  "public",
  "static",

  "class",
  "const",
  "extends",
  "function",
  "get",
  "implements",
  "interface",
  "namespace",
  "package",
  "set",
  "var",

  "import",
  "include",

  "false",
  "null",
  "this",
  "true",

  "typeof",
  "void",
  "as",
  "instanceof",
  "is",
  "new"
];

export const customTokens = {
  varArgs: {
    values: ["...rest"],
    boundary: "[\\W]"
  },

  constant: {
    values: ["Infinity", "NaN", "undefined"],
    boundary: "\\b"
  },

  globalObject: {
    values: [
      "ArgumentError",
      "arguments",
      "Array",
      "Boolean",
      "Class",
      "Date",
      "DefinitionError",
      "Error",
      "EvalError",
      "Function",
      "int",
      "Math",
      "Namespace",
      "Number",
      "Object",
      "QName",
      "RangeError",
      "ReferenceError",
      "RegExp",
      "SecurityError",
      "String",
      "SyntaxError",
      "TypeError",
      "uint",
      "URIError",
      "Vector",
      "VerifyError",
      "XMLList",
      "XML"
    ],
    boundary: "\\b"
  }
};

export const scopes = {
  string: [
    ['"', '"', util.escapeSequences.concat(['\\"']), false],
    ["'", "'", util.escapeSequences.concat(["\\'", "\\\\"]), false]
  ],
  comment: [["//", "\n", [], true], ["/*", "*/", [], false]],
  xmlAttribute: [["@", "\\b", [], false]]
};

export const customParseRules = [
  // global functions: //http://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/package-detail.html
  (function(): ParserContext => ?Token {
    const functions = util.createHashMap(
      [
        "Array",
        "Boolean",
        "decodeURIComponent",
        "decodeURI",
        "encodeURIComponent",
        "encodeURI",
        "escape",
        "int",
        "isFinite",
        "isNaN",
        "isXMLName",
        "Number",
        "Object",
        "parseFloat",
        "parseInt",
        "String",
        "trace",
        "uint",
        "unescape",
        "Vector",
        "XML",
        "XMLList"
      ],
      "\\b",
      false
    );

    return function(context: ParserContext): ?Token {
      // short circuit
      if (!/[A-Za-z]/.test(context.reader.peek())) return null;

      // if it follows "new" or ":", then it's not a function
      const walker = context.getTokenWalker();
      if (walker.hasPrev()) {
        const prevToken = walker.prev();
        if (
          (prevToken.name === "keyword" && prevToken.value === "new") ||
          (prevToken.name === "operator" && prevToken.value === ":")
        )
          return null;
      }

      const token = util.matchWord(context, functions, "globalFunction", true);
      if (!token) return null;

      // Grab the next non-whitespace character, and make sure it is a "(".
      for (let offset = token.value.length; ; offset++) {
        const peek = context.reader.peekWithOffset(offset);
        if (peek === "(") break;
        if (peek === "" || !/^\s$/.test(peek)) return null;
      }

      context.reader.read(token.value.length);
      return new Token(token.name, token.value, token.language);
    };
  })(),

  // regex literal, stolen from javascript
  ParseRegExpLiteral
];

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;

export const namedIdentRules = {
  custom: [
    function(context: AnalyzerContext): boolean {
      // next token is not "."
      const nextToken = util.getNextNonWsToken(context.tokens, context.index);
      if (nextToken && nextToken.name === "operator" && nextToken.value === ".")
        return false;

      // go backward and make sure that there are only idents and dots before the new keyword
      let previous: ?Token = null;
      const walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        const token = walker.prev();

        if (
          token.name === "keyword" &&
          util.contains(["new", "is", "instanceof", "import"], token.value)
        )
          return true;

        if (token.name === "default") continue;

        if (token.name === "ident") {
          if (previous && previous.name === "ident") return false;

          previous = token;
          continue;
        }

        if (token.name === "operator" && token.value === ".") {
          if (previous && previous.name !== "ident") return false;

          previous = token;
          continue;
        }

        break;
      }

      return false;
    }
  ],

  follows: [
    [{ token: "keyword", values: ["class", "extends"] }, { token: "default" }],
    [{ token: "operator", values: [":"] }, util.whitespace]
  ],

  between: [
    {
      opener: { token: "keyword", values: ["implements"] },
      closer: { token: "punctuation", values: ["{"] }
    }
  ]
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
  "&&=",
  "&&",
  "||=",
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
  "::",
  "?",
  ":",
  ".",
  "="
];
