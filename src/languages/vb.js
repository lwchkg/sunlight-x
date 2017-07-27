// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";
import * as DotNetCommon from "./common/dotnet.js";

import type { AnalyzerContext, ParserContext, Token } from "../util.js";

/* eslint no-magic-numbers: 1 */
export const name = "vb";

export const keywords = [
  "AddHandler",
  "AddressOf",
  "Alias",
  "AndAlso",
  "And",
  "As",
  "Boolean",
  "ByRef",
  "Byte",
  "ByVal",
  "Call",
  "Case",
  "Catch",
  "CBool",
  "CByte",
  "CChar",
  "CDate",
  "CDbl",
  "CDec",
  "Char",
  "CInt",
  "Class",
  "CLng",
  "CObj",
  "Const",
  "Continue",
  "CSByte",
  "CShort",
  "CSng",
  "CStr",
  "CType",
  "CUInt",
  "CULng",
  "CUShort",
  "Date",
  "Decimal",
  "Declare",
  "Default",
  "Delegate",
  "Dim",
  "DirectCast",
  "Double",
  "Do",
  "Each",
  "ElseIf",
  "Else",
  "EndStatement",
  "EndIf",
  "End",
  "Enum",
  "Erase",
  "Error",
  "Event",
  "Exit",
  "False",
  "Finally",
  "ForEach",
  "For",
  "Friend",
  "Function",
  "GetType",
  "GetXMLNamespace",
  "Get",
  "Global",
  "GoSub",
  "GoTo",
  "Handles",
  "If",
  "Implements",
  "Imports",
  "Inherits",
  "Integer",
  "Interface",
  "In",
  "IsNot",
  "Is",
  "Let",
  "Lib",
  "Like",
  "Long",
  "Loop",
  "Me",
  "Module",
  "Mod",
  "MustInherit",
  "MustOverride",
  "MyBase",
  "MyClass",
  "Namespace",
  "Narrowing",
  "New",
  "Next",
  "Nothing",
  "NotInheritable",
  "NotOverridable",
  "Not",
  "Object",
  "Of",
  "On",
  "Operator",
  "Option",
  "Optional",
  "OrElse",
  "Or",
  "Out",
  "Overloads",
  "Overridable",
  "Overrides",
  "ParamArray",
  "Partial",
  "Private",
  "Property",
  "Protected",
  "Public",
  "RaiseEvent",
  "ReadOnly",
  "ReDim",
  "RemoveHandler",
  "Resume",
  "Return",
  "SByte",
  "Select",
  "Set",
  "Shadows",
  "Shared",
  "Short",
  "Single",
  "Static",
  "Step",
  "Stop",
  "String",
  "Structure",
  "Sub",
  "SyncLock",
  "Then",
  "Throw",
  "To",
  "True",
  "TryCast",
  "Try",
  "TypeOf",
  "UInteger",
  "ULong",
  "UShort",
  "Using",
  "Variant",
  "Wend",
  "When",
  "While",
  "Widening",
  "WithEvents",
  "With",
  "WriteOnly",
  "Xor"
];

export const customTokens = {
  reservedWord: {
    values: [
      "Aggregate",
      "Ansi",
      "Assembly",
      "Auto",
      "Binary",
      "Compare",
      "Custom",
      "Distinct",
      "Equals",
      "Explicit",
      "From",
      "Group By",
      "Group Join",
      "Into",
      "IsFalse",
      "IsTrue",
      "Join",
      "Key",
      "Mid",
      "Off",
      "Order By",
      "Preserve",
      "Skip",
      "Skip While",
      "Strict",
      "Take While",
      "Take",
      "Text",
      "Unicode",
      "Until",
      "Where"
    ],
    boundary: "\\b"
  }
};

export const scopes = {
  string: [['"', '"', util.escapeSequences.concat(['\\"']), false]],
  comment: [["'", "\n", [], true], ["REM", "\n", [], true]],
  compilerDirective: [["#", "\n", [], true]]
};

export const customParseRules = [
  DotNetCommon.XMLDocComment("'''"),

  // keyword escaping: e.g. "[In]"
  util.getRegexpParser("escapedKeyword", new RegExp(/^\[[A-Za-z_]\w*\]/)),

  // handles New/GetType contextual keywords
  // e.g. prevents "New" in "SomeClass.New()" from being a keyword
  (function(): * {
    const hashmap = util.createHashMap(["New", "GetType"], "\\b");
    return function(context: ParserContext): ?Token {
      const token = util.matchWord(context, hashmap, "keyword");
      if (!token) return null;

      // if the previous non-ws token is the "." operator then it's an ident, not a keyword
      // or if it's a subprocedure name
      const prevToken = util.getPreviousNonWsToken(
        context.getAllTokens(),
        context.count()
      );
      if (
        prevToken &&
        ((prevToken.name === "operator" && prevToken.value === ".") ||
          (prevToken.name === "keyword" && prevToken.value === "Sub"))
      )
        token.name = "ident";

      return token;
    };
  })()
];

// TODO: accept all .NET identifier characters, not just ASCII
export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;

export const namedIdentRules = {
  custom: [
    // attributes (copypasted (mostly) from c# file)
    function(context: AnalyzerContext): boolean {
      {
        // If the next token is an equals sign, this is a named parameter, or
        // something else not inside of an attribute)
        const token = util.getNextNonWsToken(context.tokens, context.index);
        if (
          token &&
          token.name === "operator" &&
          (token.value === "=" || token.value === ".")
        )
          return false;
      }

      const bracketCount: [number, number] = [0, 0];
      // we need to verify that we're between <>
      // first, verify that we're inside an opening bracket
      let walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (token.name === "operator") {
          if (token.value === "<") bracketCount[0]++;
          else if (token.value === ">") bracketCount[1]++;
        } else if (
          token.name === "keyword" &&
          util.contains(
            ["Public", "Class", "Protected", "Private", "Friend"],
            token.value
          )
        ) {
          break;
        }
      }

      // if no brackets were found OR...
      // all the found brackets are closed, so this ident is actually outside
      // of the brackets duh.
      if (bracketCount[0] === 0 || bracketCount[0] === bracketCount[1])
        return false;

      let indexOfLastBracket = -1;
      walker = context.getTokenWalker();
      while (walker.hasNext()) {
        const token = walker.next();
        if (token.name === "operator") {
          if (token.value === "<") {
            bracketCount[0]++;
          } else if (token.value === ">") {
            indexOfLastBracket = walker.index;
            bracketCount[1]++;
          }
        } else if (
          // End of named ident token
          token.name === "keyword" &&
          util.contains(
            ["Public", "Class", "Protected", "Private", "Friend", "ByVal"],
            token.value
          )
        ) {
          break;
        }
      }
      if (indexOfLastBracket < 0 || bracketCount[0] !== bracketCount[1])
        return false;

      // next token after the last closing bracket should be either a keyword or an ident
      const token = util.getNextNonWsToken(context.tokens, indexOfLastBracket);
      if (token && (token.name === "keyword" || token.name === "ident"))
        return true;

      return false;
    },

    // casts
    function(context: AnalyzerContext): boolean {
      // look backward for CType, DirectCast or TryCast
      // could be goofy because of nesting, so we need to count parens

      // verify that this ident is the second argument to the function call
      if (
        !util.createProceduralRule(context.index - 1, -1, [
          { token: "punctuation", values: [","] },
          util.whitespace
        ])(context.tokens)
      )
        return false;

      let parenCount = 1;
      const walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (token.name === "punctuation" && token.value === "(") {
          parenCount--;
          if (parenCount === 0) {
            // we found the opening paren, so if the previous token is one of
            // the cast functions, this is a cast
            if (!walker.hasPrev()) return false;
            const token2 = walker.prev();
            return (
              token2.name === "keyword" &&
              util.contains(["CType", "DirectCast", "TryCast"], token2.value)
            );
          }
        } else if (token.name === "punctuation" && token.value === ")") {
          parenCount++;
        }
      }

      return false;
    },

    // implemented interfaces
    function(context: AnalyzerContext): boolean {
      // if previous non-ws token was a "." then it's an implemented method
      const prevToken = util.getPreviousNonWsToken(
        context.tokens,
        context.index
      );
      if (prevToken && prevToken.name === "operator" && prevToken.value === ".")
        return false;

      // look backward for "Implements"
      const walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (token.name === "keyword")
          switch (token.value) {
            case "Class":
            case "New":
              break;
            case "Implements":
              return true;
            default:
              return false;
          }
        else if (token.name === "default" && token.value.indexOf(util.eol) >= 0)
          // apparently they must be on the same line...?
          return false;
      }

      return false;
    },

    // type constraints: "As {ident, ident, ...}"
    function(context: AnalyzerContext): boolean {
      // look backward for "As {"
      const isValid = (function(): boolean {
        for (
          let index = context.index - 1, token;
          (token = context.tokens[index]);
          --index
        )
          if (token.name === "punctuation")
            switch (token.value) {
              case "(":
              case ")":
                return false;
              case "{":
                // previous non-ws token should be keyword "As"
                token = util.getPreviousNonWsToken(context.tokens, index);
                if (!token || token.name !== "keyword" || token.value !== "As")
                  return false;

                return true;
            }
          else if (
            token.name === "keyword" &&
            util.contains(
              ["Public", "Protected", "Friend", "Private", "End"],
              token.value
            )
          )
            return false;

        return false;
      })();

      if (!isValid) return false;

      // "}" before )
      const walker = context.getTokenWalker();
      while (walker.hasNext()) {
        const token = walker.next();
        if (token.name === "punctuation")
          switch (token.value) {
            case "}":
              return true;
            case "(":
            case ")":
            case ";":
              return false;
          }
      }

      return false;
    }
  ],

  follows: [
    [
      {
        token: "keyword",
        values: [
          "Of",
          "As",
          "Class",
          "Implements",
          "Inherits",
          "New",
          "AddressOf",
          "Interface",
          "Structure",
          "Event",
          "Module",
          "Enum"
        ]
      },
      { token: "default" }
    ],
    [
      { token: "keyword", values: ["GetType"] },
      util.whitespace,
      { token: "punctuation", values: ["("] },
      util.whitespace
    ]
  ]
};

const numberLiteral: string = ((): string => {
  const int = "[0-9](?:[0-9_]*[0-9])?";
  const hex = "&H[0-9A-F](?:[0-9A-F_]*[0-9A-F])?";
  const oct = "&O[0-7](?:[0-7_]*[0-7])?";
  const bin = "&B[01](?:[01_]*[01])?";

  const intTypeChars = util.nonCapturingGroup(["U?[SIL]", "[%&]"]);

  const nonDecIntegerLiteral =
    util.nonCapturingGroup([hex, oct, bin]) + intTypeChars + "?";
  const exponent = "E[+-]?" + int;
  const fpValue1 = util.nonCapturingGroup([
    util.nonCapturingGroup(int, "?") +
      "\\." +
      int +
      util.nonCapturingGroup(exponent, "?"),
    int + exponent
  ]);
  const fpTypeChars = "[DFR@!#]";

  const fpLiteral1 = fpValue1 + fpTypeChars + "?";
  // Denary numbers must be matched with all integer and floating point suffixes
  // at the same time. Otherwise a match may be made without the suffix.
  const decIntegerLiteral =
    int + util.nonCapturingGroup([intTypeChars, fpTypeChars], "?");

  return util.nonCapturingGroup([
    fpLiteral1, // must come first, otherwise may match without exponent
    decIntegerLiteral,
    nonDecIntegerLiteral
  ]);
})();

export const numberParser = util.getRegexpParser(
  "number",
  new RegExp("^" + numberLiteral, "i")
);

export const operators = [
  ".",
  "<>",
  "=",
  "&=",
  "&",
  "*=",
  "*",
  "/=",
  "/",
  "\\=",
  "\\",
  "^=",
  "^",
  "+=",
  "+",
  "-=",
  "-",
  ">>=",
  ">>",
  "<<=",
  "<<",
  "<=",
  ">=",
  "<",
  ">"
];
