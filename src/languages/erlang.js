// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

import type { AnalyzerContext, ParserContext, Token } from "../util.js";

export const name = "erlang";

// http://www.haskell.org/haskellwiki/Keywords
export const keywords = [
  "after",
  "andalso",
  "and",
  "band",
  "begin",
  "bnot",
  "bor",
  "bsl",
  "bsr",
  "bxor",
  "case",
  "catch",
  "cond",
  "div",
  "end",
  "fun",
  "if",
  "let",
  "not",
  "of",
  "orelse",
  "or",
  "query",
  "receive",
  "rem",
  "try",
  "when",
  "xor",

  "true",
  "false"
];

export const customParseRules = [
  // atom/function/userDefinedFunction detection
  function(context: ParserContext): ?Token {
    if (!/[A-Za-z_]/.test(context.reader.newPeek())) return null;

    let peek: string;
    // read the ident (they can have letters, numbers, underscores and @-signs in them)
    let offset: number;
    for (offset = 1; ; offset++) {
      const peek = context.reader.peekWithOffset(offset);
      if (peek === "" || !/[\w@]/.test(peek)) break;
    }

    const ident = context.reader.newPeek(offset);

    // if the next non-whitespace character is "(", then it's a function
    let isFunction = false;
    for (; ; offset++) {
      const peek = context.reader.peekWithOffset(offset);
      if (peek === "") break;

      if (!/^\s$/.test(peek)) {
        if (peek === "(") isFunction = true;
        break;
      }
    }

    // a little inefficient because reading the ident will have to happen again,
    // but it might be a keyword or something
    if (!isFunction && !/^[A-Z_]/.test(ident)) return null;

    context.reader.newRead(ident.length);

    if (!isFunction) return context.createToken("ident", ident);

    let parenCount = 1; // Already read a "(" before.
    // is it a function declaration? (preceded by -> operator)
    for (offset = offset - ident.length + 1; parenCount > 0; offset++) {
      const peek = context.reader.peekWithOffset(offset);
      if (peek === "") break;

      if (peek === "(") parenCount++;
      else if (peek === ")") parenCount--;
    }

    // the next thing is a bunch of whitespace followed by ->, or fail
    for (; ; offset++) {
      peek = context.reader.peekWithOffset(offset);
      if (peek === "" || !/^\s$/.test(peek)) break;
    }

    if (context.reader.peekWithOffset(offset, 2) === "->") {
      // function declaration
      context.userDefinedNameStore.addName(ident, name);
      return context.createToken("userDefinedFunction", ident);
    }

    // just a regular function call
    return context.createToken("function", ident);
  }
];

export const customTokens = {
  moduleAttribute: {
    values: [
      "-module",
      "-export",
      "-import",
      "-compile",
      "-vsn",
      "-behaviour",
      "-record",
      "-include",
      "-define",
      "-file",
      "-type",
      "-spec",
      "on_load"
    ],
    boundary: "\\b"
  },

  macroDirective: {
    values: ["-undef", "-ifdef", "-ifndef", "-else", "-endif"],
    boundary: "\\b"
  }
};

export const scopes = {
  string: [['"', '"', util.escapeSequences.concat(['\\"']), false]],
  quotedAtom: [["'", "'", ["\\'", "\\\\"], false]],
  comment: [["%", "\n", [], true]],
  char: [["$", { regex: /[^\w\\]/, length: 1 }, [], true]],
  macro: [["?", { regex: /[^\w?]/, length: 1 }, [], true]]
};

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /[\w@]/;

export const namedIdentRules = {
  custom: [
    function(context: AnalyzerContext): boolean {
      return context.userDefinedNameStore.hasName(
        context.tokens[context.index].value,
        name
      );
    }
  ],

  precedes: [[{ token: "operator", values: [":"] }]]
};

export const operators = [
  "<-",
  "<",
  "||",
  "=:=",
  "=/=",
  "==",
  "=<",
  "=",
  "*",
  "<<",
  ",",
  ">=",
  ">>",
  ">",
  ":",
  "#",
  "!",
  "++",
  "+",
  "->",
  "--",
  "-",
  "/=",
  "/"
];
