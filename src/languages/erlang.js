// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as logger from "../logger.js";
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
    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    if (!/[A-Za-z_]/.test(context.reader.current())) return null;

    let peek;
    let count = 0;
    // read the ident (they can have letters, numbers, underscores and @-signs in them)
    while ((peek = context.reader.peek(++count)) && peek.length === count)
      if (!/[\w@]$/.test(peek)) break;

    const ident = context.reader.currentAndPeek(peek.length);

    // if the next non-whitespace character is "(", then it's a function
    count--;
    let isFunction = false;
    while ((peek = context.reader.peek(++count)) && peek.length === count)
      if (!/\s$/.test(peek)) {
        if (/\($/.test(peek)) isFunction = true;

        break;
      }

    // a little inefficient because reading the ident will have to happen again,
    // but it might be a keyword or something
    if (!isFunction && !/^[A-Z_]/.test(ident)) return null;

    context.reader.read(ident.length - 1);
    count = 1;

    if (!isFunction) return context.createToken("ident", ident, line, column);

    let parenCount = 1; // Already read a "(" before.
    // is it a function declaration? (preceded by -> operator)
    while ((peek = context.reader.peek(++count)) && peek.length === count) {
      const letter = peek.charAt(peek.length - 1);

      if (parenCount === 0) {
        // the next thing is a bunch of whitespace followed by ->, or fail
        while ((peek = context.reader.peek(++count)) && peek.length === count)
          if (!/\s$/.test(peek)) {
            if (/->$/.test(context.reader.peek(count + 1)))
              if (!Array.isArray(context.items.userDefinedFunctions)) {
                logger.errorInvalidValue(
                  `userDefinedFunctions is not an array.`,
                  context.items.scalaBracketNestingLevel
                );
              } else {
                // function declaration
                context.items.userDefinedFunctions.push(ident);
                return context.createToken(
                  "userDefinedFunction",
                  ident,
                  line,
                  column
                );
              }

            break;
          }

        break;
      }

      if (letter === "(") parenCount++;
      else if (letter === ")") parenCount--;
    }

    // just a regular function call
    return context.createToken("function", ident, line, column);
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
      if (!Array.isArray(context.items.userDefinedFunctions)) {
        logger.errorInvalidValue(
          `userDefinedFunctions is not an array.`,
          context.items.scalaBracketNestingLevel
        );
        return false;
      }
      return util.contains(
        context.items.userDefinedFunctions,
        context.tokens[context.index].value
      );
    }
  ],

  precedes: [[{ token: "operator", values: [":"] }]]
};

export const contextItems = {
  userDefinedFunctions: []
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
