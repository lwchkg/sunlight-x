// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

import type { AnalyzerContext, ParserContext, Token } from "../util.js";

export const name = "lua";

export const keywords = [
  "and",
  "break",
  "do",
  "elseif",
  "else",
  "end",
  "false",
  "for",
  "function",
  "if",
  "in",
  "local",
  "nil",
  "not",
  "or",
  "repeat",
  "return",
  "then",
  "true",
  "until",
  "while"
];

export const scopes = {
  string: [
    ['"', '"', ['\\"', "\\\\"], false],
    ["'", "'", ["\\'", "\\\\"], false]
  ],
  comment: [["--[[", "]]", [], false], ["--", "\n", [], true]]
};

export const customTokens = {
  globalVariable: {
    values: ["_G", "_VERSION"],
    boundary: "\\b"
  }
};

export const customParseRules = [
  // standard functions
  (function(): ParserContext => ?Token {
    const functions = util.createHashMap(
      [
        "assert",
        "collectgarbage",
        "dofile",
        "error",
        "getfenv",
        "getmetatable",
        "ipairs",
        "load",
        "loadfile",
        "loadstring",
        "next",
        "pairs",
        "pcall",
        "print",
        "rawequal",
        "rawget",
        "rawset",
        "select",
        "setfenv",
        "setmetatable",
        "tonumber",
        "tostring",
        "type",
        "unpack",
        "xpcall",

        // exported from package library
        "module",
        "require"
      ],
      "\\b"
    );

    return function(context: ParserContext): ?Token {
      const walker = context.getTokenWalker();
      if (walker.hasPrev()) {
        const prevToken = walker.prev();
        // Reject if the token is part of a package
        if (prevToken.name === "operator" && prevToken.value === ".")
          return null;
      }

      return util.matchWord(context, functions, "function");
    };
  })(),

  // file functions
  (function(): ParserContext => ?Token {
    const functions = util.createHashMap(
      ["close", "flush", "lines", "read", "seek", "setvbuf", "write"],
      "\\b"
    );

    return function(context: ParserContext): ?Token {
      const walker = context.getTokenWalker();
      if (!walker.hasPrev()) return null;

      const prevToken = walker.prev();
      // Reject if the token is not a function on file
      if (prevToken.name !== "operator" || prevToken.value !== ":") return null;

      return util.matchWord(context, functions, "function");
    };
  })(),

  // literal strings
  function(context: ParserContext): ?Token {
    // [=*[ string contents ]=*]
    if (context.reader.current() !== "[") return null;

    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    let numberOfEqualsSigns = 0;
    let count = 0;
    let peek;
    while ((peek = context.reader.peek(++count)) && peek.length === count)
      if (!/=$/.test(peek)) {
        if (!/\[$/.test(peek)) return null;

        numberOfEqualsSigns = peek.length - 1;
        break;
      }

    let value = "[" + peek;
    context.reader.read(peek.length);

    // read until "]" + numberOfEqualsSigns + "]"
    const closer = "]" + new Array(numberOfEqualsSigns + 1).join("=") + "]";
    while (!context.reader.isPeekEOF()) {
      const peek = context.reader.peek();
      if (peek === "]" && context.reader.matchPeek(closer)) {
        value += context.reader.read(closer.length);
        break;
      }

      value += context.reader.read();
    }

    return context.createToken("verbatimString", value, line, column);
  }
];

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;

export const namedIdentRules = {
  custom: [
    (function(): AnalyzerContext => boolean {
      const tables = [
        "coroutine",
        "package",
        "string",
        "table",
        "math",
        "io",
        "os",
        "debug"
      ];

      return function(context: AnalyzerContext): boolean {
        if (!util.contains(tables, context.tokens[context.index].value))
          return false;

        const nextToken = util.getNextNonWsToken(context.tokens, context.index);
        return (
          !!nextToken &&
          (nextToken.name !== "operator" || nextToken.value !== ":")
        );
      };
    })()
  ],

  follows: [[{ token: "keyword", values: ["function"] }, { token: "default" }]]
};

export const operators = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "^",
  "#",
  "==",
  "~=",
  "=",
  "<=",
  "<",
  ">=",
  ">",
  ":",
  "...",
  "..",
  "."
];
