// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

import type { AnalyzerContext, ParserContext, Token } from "../util.js";

export const name = "powershell";

export const scopes = {
  string: [
    ['"', '"', ['\\"', "\\\\"], false],
    ["'", "'", ["\\'", "\\\\"], false]
  ],
  comment: [["#", "\n", [], true]]
};

export const customParseRules = [
  // idents and special operators
  // we need a custom rule to differentiate between the "-" operator and idents that start with "-"
  (function(): ParserContext => ?Token {
    const specialOperators = [
      "-not",
      "-band",
      "-bor",
      "bnot",
      "-replace",
      "-ireplace",
      "-creplace",
      "-and",
      "-or",
      "-isnot",
      "-is",
      "-as",
      "-F",
      "-lt",
      "-le",
      "-gt",
      "-ge",
      "-eq",
      "-ne",
      "-contains",
      "-notcontains",
      "-like",
      "-notlike",
      "-match",
      "-notmatch"
    ];
    const keywords = [
      // [type]::gettype("System.Management.Automation.KeywordTokenReader")|%{$_.InvokeMember("_keywordTokens", "NonPublic,Static,GetField", $null, $_,@())}
      "elseif",
      "begin",
      "function",
      "for",
      "foreach",
      "return",
      "else",
      "trap",
      "while",
      "using",
      "do",
      "data",
      "dynamicparam",
      "class",
      "define",
      "until",
      "end",
      "break",
      "if",
      "throw",
      "param",
      "continue",
      "finally",
      "in",
      "switch",
      "exit",
      "filter",
      "from",
      "try",
      "process",
      "var",
      "catch"
    ];

    return function(context: ParserContext): ?Token {
      if (
        !/[A-Za-z_-]/.test(context.reader.peek()) ||
        !/[\w-]/.test(context.reader.peekWithOffset(1))
      )
        return null;

      let ident = context.reader.read();
      while (!context.reader.isEOF() && /[\w-]/.test(context.reader.peek()))
        ident += context.reader.read();

      const tokenType = util.contains(specialOperators, ident)
        ? "specialOperator"
        : util.contains(keywords, ident)
          ? "keyword"
          : ident.charAt(0) === "-" ? "switch" : "ident";

      return context.createToken(tokenType, ident);
    };
  })(),

  // variables
  (function(): ParserContext => ?Token {
    // Get-Help about_automatic_variables
    // all uppercase because they're not case sensitive
    const specialVariables = [
      "$$",
      "$?",
      "$^",
      "$_",
      "$ARGS",
      "$CONSOLEFILENAME",
      "$ERROR",
      "$EVENT",
      "$EVENTSUBSCRIBER",
      "$EXECUTIONCONTEXT",
      "$FALSE",
      "$FOREACH",
      "$HOME",
      "$HOST",
      "$INPUT",
      "$LASTEXITCODE",
      "$MATCHES",
      "$MYINVOCATION",
      "$NESTEDPROMPTLEVEL",
      "$NULL",
      "$PID",
      "$PROFILE",
      "$PSBOUNDPARAMETERS",
      "$PSCMDLET",
      "$PSCULTURE",
      "$PSDEBUGCONTEXT",
      "$PSHOME",
      "$PSSCRIPTROOT",
      "$PSUICULTURE",
      "$PSVERSIONTABLE",
      "$PWD",
      "$SENDER",
      "$SHELLID",
      "$SOURCEARGS",
      "$SOURCEEVENTARGS",
      "$THIS",
      "$TRUE"
    ];

    const invalidVariableCharRegex = /[!@#%&,.\s]/;

    return function(context: ParserContext): ?Token {
      // illegal characters in a variable: ! @ # % & , . whitespace
      if (
        context.reader.peek() !== "$" ||
        invalidVariableCharRegex.test(context.reader.peekWithOffset(1))
      )
        return null;

      let value = context.reader.read();
      while (
        !context.reader.isEOF() &&
        !invalidVariableCharRegex.test(context.reader.peek())
      )
        value += context.reader.read();

      return context.createToken(
        util.contains(specialVariables, value.toUpperCase())
          ? "specialVariable"
          : "variable",
        value
      );
    };
  })()
];

export const namedIdentRules = {
  custom: [
    function(context: AnalyzerContext): boolean {
      const walker = context.getTokenWalker();
      if (!walker.hasPrev()) return true;

      // must be first thing on the line that's not a continuation (preceded by "`"
      // operator)
      let prevToken = walker.prev();
      if (
        prevToken.name === "default" &&
        prevToken.value.indexOf(util.eol) >= 0
      ) {
        if (!walker.hasPrev()) return true;

        prevToken = walker.prev();
        return !(prevToken.name === "operator" && prevToken.value === "`");
      }

      // if it follows an equals sign, that's cool, too
      prevToken = util.getPreviousNonWsToken(context.tokens, context.index);
      return (
        !!prevToken &&
        ((prevToken.name === "operator" && prevToken.value === "=") ||
          (prevToken.name === "punctuation" && prevToken.value === "{"))
      );
    },

    // type coercion
    function(context: AnalyzerContext): boolean {
      const nextToken = util.getNextNonWsToken(context.tokens, context.index);
      if (nextToken && nextToken.name === "operator" && nextToken.value === ".")
        return false;

      return util.IsBetweenRuleSatisfied(
        context.getTokenWalker(),
        { token: "punctuation", values: ["["] },
        { token: "punctuation", values: ["]"] }
      );
    }
  ]
};

export const operators = [
  "@(",
  "::",
  "..",
  ".",
  "=",
  "!=",
  "!",
  "|",
  ">>",
  ">",
  "++",
  "+=",
  "+",
  "`",
  "*=",
  "*",
  "/=",
  "/",
  "--",
  "-=",
  "-",
  "%{",
  "%=",
  "%",
  "${",
  "&"
];
