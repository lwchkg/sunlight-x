// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

import type { AnalyzerContext, Token } from "../util.js";

export const primitives = [
  "int",
  "char",
  "void",
  "long",
  "signed",
  "unsigned",
  "double",
  "bool",
  "typename",
  "class",
  "short",
  "wchar_t",
  "struct"
];

export const acceptableKeywords = [
  "int",
  "char",
  "void",
  "long",
  "signed",
  "unsigned",
  "double",
  "bool",
  "typename",
  "class",
  "short",
  "wchar_t"
];

export const name = "cpp";

// http://www.cppreference.com/wiki/keywords/start
export const keywords = [
  "and",
  "default",
  "noexcept",
  "template",
  "and_eq",
  "delete",
  "not",
  "this",
  "alignof",
  "double",
  "not_eq",
  "thread_local",
  "asm",
  "dynamic_cast",
  "nullptr",
  "throw",
  "auto",
  "else",
  "operator",
  "true",
  "bitand",
  "enum",
  "or",
  "try",
  "bitor",
  "explicittodo",
  "or_eq",
  "typedef",
  "bool",
  "export",
  "private",
  "typeid",
  "break",
  "externtodo",
  "protected",
  "typename",
  "case",
  "false",
  "public",
  "union",
  "catch",
  "float",
  "register",
  "using",
  "char",
  "for",
  "reinterpret_cast",
  "unsigned",
  "char16_t",
  "friend",
  "return",
  "void",
  "char32_t",
  "goto",
  "short",
  "wchar_t",
  "class",
  "if",
  "signed",
  "virtual",
  "compl",
  "inline",
  "sizeof",
  "volatile",
  "const",
  "int",
  "static",
  "while",
  "constexpr",
  "long",
  "static_assert",
  "xor",
  "const_cast",
  "mutable",
  "static_cast",
  "xor_eq",
  "continue",
  "namespace",
  "struct",
  "decltype",
  "new",
  "switch"
];

export const customTokens = {
  constant: {
    values: [
      "EXIT_SUCCESS",
      "EXIT_FAILURE",
      "SIG_DFL",
      "SIG_IGN",
      "SIG_ERR",
      "SIGABRT",
      "SIGFPE",
      "SIGILL",
      "SIGINT",
      "SIGSEGV",
      "SIGTERM"
    ],
    boundary: "\\b"
  },

  // http://www.cppreference.com/wiki/utility/types/start
  basicType: {
    values: ["ptrdiff_t", "size_t", "nullptr_t", "max_align_t"],
    boundary: "\\b"
  },

  ellipsis: {
    values: ["..."],
    boundary: ""
  }
};

export const scopes = {
  string: [['"', '"', util.escapeSequences.concat(['\\"']), false]],
  char: [["'", "'", ["\\'", "\\\\"], false]],
  comment: [["//", "\n", [], true], ["/*", "*/", [], false]],
  preprocessorDirective: [["#", "\n", [], true]]
};

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;

export const namedIdentRules = {
  custom: [
    // pointer default declarations, e.g. pointer* myPointer;
    (function(): AnalyzerContext => boolean {
      const precedes = [
        [
          util.whitespace,
          { token: "operator", values: ["*", "**"] },
          { token: "default" },
          { token: "ident" },
          util.whitespace,
          { token: "punctuation", values: [";"] }
        ],
        [
          // function parameters
          { token: "default" },
          { token: "operator", values: ["&"] },
          util.whitespace,
          { token: "ident" }
        ]
      ];

      return function(context: AnalyzerContext): boolean {
        // basically, can't be on the right hand side of an equals sign
        // so we traverse the tokens backward, and if we run into a "=" before a ";" or a "{", it's no good
        const precedesIsSatisfied = (function(tokens: Token[]): boolean {
          for (const precede of precedes)
            if (
              util.createProceduralRule(context.index + 1, 1, precede, false)(
                tokens
              )
            )
              return true;

          return false;
        })(context.tokens);

        if (!precedesIsSatisfied) return false;

        // make sure we're not on the left side of the equals sign
        const walker = context.getTokenWalker();
        while (walker.hasPrev()) {
          const token = walker.prev();
          if (
            token.name === "punctuation" &&
            (token.value === ";" || token.value === "{")
          )
            return true;

          if (token.name === "operator" && token.value === "=") return false;
        }

        return false;
      };
    })(),

    // casting
    (function(): AnalyzerContext => boolean {
      const precedes = [
        [
          util.whitespace,
          { token: "punctuation", values: [")"] },
          util.whitespace,
          { token: "ident" }
        ],
        [
          { token: "operator", values: ["*", "**"] },
          util.whitespace,
          { token: "punctuation", values: [")"] },
          util.whitespace,
          { token: "operator", values: ["&"], optional: true },
          { token: "ident" }
        ]
      ];

      return function(context: AnalyzerContext): boolean {
        const precedesIsSatisfied = (function(tokens: Token[]): boolean {
          for (const precede of precedes)
            if (
              util.createProceduralRule(context.index + 1, 1, precede, false)(
                tokens
              )
            )
              return true;

          return false;
        })(context.tokens);

        if (!precedesIsSatisfied) return false;

        // make sure the previous tokens are "(" and then not a keyword
        // this'll make sure that things like "if (foo) doSomething();" won't color "foo"
        const walker = context.getTokenWalker();
        while (walker.hasPrev()) {
          const token = walker.prev();
          if (token.name === "punctuation" && token.value === "(") {
            const prevToken = util.getPreviousNonWsToken(
              context.tokens,
              walker.index
            );
            if (prevToken && prevToken.name === "keyword") return false;

            return true;
          }
        }

        return false;
      };
    })(),

    // generic definitions/params between "<" and ">"
    function(context: AnalyzerContext): boolean {
      // between < and > and preceded by an ident and not preceded by "class"

      // if the previous token is a keyword, then we don't care about it
      const prevToken = util.getPreviousNonWsToken(
        context.tokens,
        context.index
      );
      if (!prevToken || prevToken.name === "keyword") return false;

      // look for "<" preceded by an ident but not "class"
      // if we run into ">" before "," or "<" then it's a big fail
      let foundIdent = false;
      const bracketCountLeft = [0, 0];
      const walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (token.name === "keyword" && token.value === "class")
          // this must be a generic class type definition, e.g. Foo<T>, and we don't want to color the "T"
          return false;

        if (token.name === "operator") {
          switch (token.value) {
            case "<":
            case "<<":
              bracketCountLeft[0] += token.value.length;
              break;
            case ">":
            case ">>":
              if (bracketCountLeft[0] === 0) return false;

              bracketCountLeft[1] += token.value.length;
              break;
            case ".":
              // allows generic method invocations, like "Foo" in "foo.Resolve<Foo>()"
              break;
            default:
              return false;
          }

          continue;
        }

        if (
          (token.name === "keyword" &&
            util.contains(acceptableKeywords, token.value)) ||
          token.name === "default" ||
          (token.name === "punctuation" && token.value === ",")
        )
          continue;

        if (token.name === "ident") {
          foundIdent = true;
          continue;
        }

        // anything else means we're no longer in a generic definition
        break;
      }

      if (!foundIdent || bracketCountLeft[0] === 0)
        // not inside a generic definition
        return false;

      // now look forward to make sure the generic definition is closed
      // this avoids false positives like "foo < bar"
      const walker2 = context.getTokenWalker();
      while (walker2.hasNext()) {
        const token = walker.next();
        if (
          token.name === "operator" &&
          (token.value === ">" || token.value === ">>")
        )
          return true;

        if (
          (token.name === "keyword" &&
            util.contains(acceptableKeywords, token.value)) ||
          (token.name === "operator" &&
            util.contains(["<", "<<", ">", ">>"], token.value)) ||
          (token.name === "punctuation" && token.value === ",") ||
          token.name === "ident" ||
          token.name === "default"
        )
          continue;

        return false;
      }

      return false;
    },

    // ident before generic definitions, e.g. "foo" in "foo<bar>"
    function(context: AnalyzerContext): boolean {
      // if it's preceded by an ident or a primitive/alias keyword then it's no good (i.e. a generic method definition like "public void Foo<T>")
      // also a big fail if it is preceded by a ., i.e. a generic method invocation like container.Resolve()
      let token = util.getPreviousNonWsToken(context.tokens, context.index);
      if (token)
        if (
          token.name === "ident" ||
          (token.name === "keyword" &&
            util.contains(
              primitives.concat(["string", "object", "void"]),
              token.value
            )) ||
          (token.name === "operator" && token.value === ".")
        ) {
          return false;
        }

      // needs to be immediately followed by <, then by idents, acceptable keywords and ",", and then closed by >, then immediately followed by an ident
      token = util.getNextNonWsToken(context.tokens, context.index);
      if (!token || token.name !== "operator" || token.value !== "<")
        return false;

      const bracketCount = [0, 0]; // open (<), close (>)
      const walker = context.getTokenWalker();
      while (walker.hasNext()) {
        const token = walker.next();
        if (token.name === "operator") {
          switch (token.value) {
            case "<":
              bracketCount[0]++;
              break;
            case "<<":
              bracketCount[0] += 2;
              break;
            case ">":
              bracketCount[1]++;
              break;
            case ">>":
              bracketCount[1] += 2;
              break;
            default:
              return false;
          }
          // if bracket counts match, get the f out
          if (bracketCount[0] === bracketCount[1]) break;

          continue;
        }

        if (
          token.name === "default" ||
          token.name === "ident" ||
          (token.name === "keyword" &&
            util.contains(acceptableKeywords, token.value)) ||
          (token.name === "punctuation" && token.value === ",")
        )
          continue;

        return false;
      }

      // verify bracket count
      if (bracketCount[0] !== bracketCount[1])
        // mismatched generics, could be something scary
        return false;

      // next token should be optional whitespace followed by an ident
      if (walker.hasNext()) {
        token = walker.next();
        if (!token || (token.name !== "default" && token.name !== "ident"))
          return false;
      }

      if (token.name === "default") {
        if (!walker.hasNext()) return false;
        token = walker.next();
        if (token.name !== "ident") return false;
      }

      return true;
    },

    // after class keyword but inside <>
    function(context: AnalyzerContext): boolean {
      const prevToken = util.getPreviousNonWsToken(
        context.tokens,
        context.index
      );

      if (
        !prevToken ||
        prevToken.name !== "keyword" ||
        prevToken.value !== "class"
      )
        return false;

      // make sure we're not inside <>
      // easiest way is to go forward and verify that we hit a "{" before a ">"
      const walker = context.getTokenWalker();
      while (walker.hasNext()) {
        const token = walker.next();
        if (token.name === "punctuation" && token.value === "{") return true;

        if (
          token.name === "operator" &&
          util.contains([">", ">>"], token.value)
        )
          return false;
      }

      return false;
    }
  ],

  follows: [
    [{ token: "keyword", values: ["enum", "struct", "union"] }, util.whitespace]
  ],

  precedes: [
    // normal parameters/declarations
    [{ token: "default" }, { token: "ident" }],

    [
      util.whitespace,
      { token: "operator", values: ["*", "**"] },
      { token: "default" },
      { token: "ident" },
      util.whitespace,
      { token: "operator", values: ["=", ","] }
    ],
    [
      util.whitespace,
      { token: "operator", values: ["*", "**"] },
      { token: "default" },
      { token: "operator", values: ["&"] },
      util.whitespace,
      { token: "ident" },
      util.whitespace,
      { token: "operator", values: ["=", ","] }
    ],

    // e.g. "std" in "std::char_traits<CharT>"
    [util.whitespace, { token: "operator", values: ["::"] }]
  ]
};

// http://www.cppreference.com/wiki/language/operator_precedence
export const operators = [
  "==",
  "=",
  "+=",
  "++",
  "+",
  "->*",
  "->",
  "-=",
  "--",
  "-",
  "**",
  "*=",
  "*", // added ** for double pointer convenience
  "/=",
  "/",
  "%=",
  "%",
  "!=",
  "!",
  ">>=",
  ">>",
  ">=",
  ">",
  "<<=",
  "<<",
  "<=",
  "<",
  "&=",
  "&&",
  "&",
  "|=",
  "||",
  "|",
  "~",
  "^=",
  "^",
  ".*",
  ".",
  "?",
  "::",
  ":",
  ","
];
