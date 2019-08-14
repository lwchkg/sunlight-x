// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

import type { ScopeType } from "../languages.js";
import type {
  AnalyzerContext,
  FollowsOrPrecedesIdentRule,
  ParserContext,
  Token
} from "../util.js";

export const name = "objective-c";

export const keywords = [
  // c++ keywords
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
  "switch",

  // objective c keywords
  "id",
  "self",
  "nil",
  "super",
  "in",
  "out",
  "inout",
  "bycopy",
  "byval",
  "oneway",

  "SEL",
  "BOOL",
  "YES",
  "NO",

  "@interface",
  "@implementation",
  "@end",
  "@class",
  "@private",
  "@public",
  "@package",
  "@protected",
  "@protocol",
  "@optional",
  "@required",
  "@property",
  "@synthesize",
  "@dynamic",
  "@selector",
  "@try",
  "@catch",
  "@finally",
  "@throw",
  "@synchronized",
  "@encode",

  "__attribute__",

  // these seem to be conditional, somehow...
  "__weak",
  "__strong"
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
  }
};

export const scopes: { [string]: ScopeType[] } = {
  string: [
    ['"', '"', util.escapeSequences.concat(['\\"']), false],
    ['@"', '"', ["\\\\", '\\"'], false]
  ],
  char: [["'", "'", ["\\'", "\\\\"], false]],
  comment: [["//", "\n", [], true], ["/*", "*/", [], false]],
  preprocessorDirective: [["#", "\n", [], true]]
};

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;

export const customParseRules = [
  // message destination (e.g. method calls)
  function(context: ParserContext): ?Token {
    // read the ident first
    if (!identFirstLetter.test(context.reader.peek())) return null;

    let offset: number;
    for (offset = 1; ; offset++) {
      const peek = context.reader.peekWithOffset(offset);
      if (peek === "") break;
      if (!context.language.identAfterFirstLetter.test(peek)) break;
    }

    const identLength = offset;

    for (; ; offset++) {
      const peek = context.reader.peekWithOffset(offset);
      if (peek === "") return null;
      if (!/\s/.test(peek)) break;
    }

    let possibleMessageArgument = false;
    const peek = context.reader.peekWithOffset(offset);
    if (peek === ":")
      possibleMessageArgument =
        context.reader.peekWithOffset(offset + 1) !== ":";
    else if (peek !== "]" && peek !== ")") return null;

    // must be the second expression after "["
    let parenCount = 0;
    let bracketCount = 0;
    let exprCount = 1;
    const walker = context.getTokenWalker();
    while (walker.hasPrev()) {
      const token = walker.prev();
      if (exprCount > 1 && !possibleMessageArgument) return null;

      if (token.name === "punctuation")
        switch (token.value) {
          case ";":
          case "{":
          case "}":
            // short circuit rules
            return null;
          case "(":
            parenCount--;
            break;
          case ")":
            parenCount++;
            break;
          case "[":
            if (bracketCount === 0 && parenCount === 0) {
              if (exprCount >= 1)
                return context.createToken(
                  possibleMessageArgument && exprCount > 1
                    ? "messageArgumentName"
                    : "messageDestination",
                  context.reader.read(identLength)
                );

              return null;
            }

            bracketCount--;
            break;
          case "]":
            bracketCount++;
            break;
        }

      if (bracketCount === 0 && parenCount === 0 && token.name === "default")
        exprCount++;
    }

    return null;
  },

  // @property attributes
  (function(): ParserContext => ?Token {
    const attributes = util.createHashMap(
      [
        "getter",
        "setter",
        "readonly",
        "readwrite",
        "assign",
        "retain",
        "copy",
        "nonatomic"
      ],
      "\\b"
    );

    return function(context: ParserContext): ?Token {
      const token = util.matchWord(context, attributes, "keyword", true);
      if (!token) return null;
      // must be inside () after @property

      // look backward for "("
      // if we find a ";" before a "(" then that's no good
      const walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        let prevToken = walker.prev();
        if (prevToken.name !== "punctuation") continue;
        if (prevToken.value === "(") {
          // previous token must be @property
          prevToken = util.getPreviousNonWsToken(
            context.getAllTokens(),
            walker.index
          );
          if (
            !prevToken ||
            prevToken.name !== "keyword" ||
            prevToken.value !== "@property"
          )
            return null;

          context.reader.read(token.value.length);
          return token;
        } else if (prevToken.value === ";") {
          return null;
        }
      }

      return null;
    };
  })()
];

// after classname in () (categories)
export const namedIdentRules = {
  custom: [
    // naming convention: NS.+, CG.+ are assumed to be built in objects
    function(context: AnalyzerContext): boolean {
      const regex = /^(NS|CG).+$/;
      const nextToken = util.getNextNonWsToken(context.tokens, context.index);
      return (
        regex.test(context.tokens[context.index].value) &&
        (!nextToken ||
          nextToken.name !== "punctuation" ||
          nextToken.value !== "(")
      );
    },

    // call to class or alloc
    function(context: AnalyzerContext): boolean {
      const nextToken = util.getNextNonWsToken(context.tokens, context.index);
      return (
        !!nextToken &&
        nextToken.name === "messageDestination" &&
        (nextToken.value === "class" || nextToken.value === "alloc")
      );
    },

    // ident followed by an ident, but not inside [] and not followed by ":"
    function(context: AnalyzerContext): boolean {
      if (
        !util.IsPrecedesRuleSatisfied(context.getTokenWalker(), [
          { token: "default" },
          { token: "ident" }
        ])
      )
        return false;

      // should not be followed by a colon, as that indicates this is an
      // argument definition
      if (
        util.IsPrecedesRuleSatisfied(context.getTokenWalker(), [
          { token: "default" },
          { token: "ident" },
          util.whitespace,
          { token: "operator", values: [":"] }
        ])
      )
        return false;

      // must be between []
      let parenCount = 0;
      const walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (token.name !== "punctuation") continue;
        switch (token.value) {
          case "[":
            return false;
          case "{":
          case ",":
            return true;
          case "(":
            if (parenCount === 0) return true;

            parenCount++;
            break;
          case ")":
            parenCount--;
            break;
        }
      }
      return true;
    },

    // pointer default declarations, e.g. pointer* myPointer;
    (function(): AnalyzerContext => boolean {
      const precedes = [
        [
          util.whitespace,
          { token: "operator", values: ["*", "**"] },
          util.whitespace,
          { token: "ident" },
          util.whitespace,
          { token: "punctuation", values: [";"] }
        ],
        [
          // function parameters
          util.whitespace,
          { token: "operator", values: ["&", "*", "**"] },
          util.whitespace,
          { token: "ident" }
        ]
      ];

      return function(context: AnalyzerContext): boolean {
        // basically, can't be on the right hand side of an equals sign
        // so we traverse the tokens backward, and if we run into a "=" before a ";" or a "{", it's no good
        if (
          !precedes.some((rule: FollowsOrPrecedesIdentRule): boolean =>
            util.IsPrecedesRuleSatisfied(context.getTokenWalker(), rule, false)
          )
        )
          return false;

        // make sure we're not on the left side of the equals sign
        // objc addition: okay if part of a @property statement
        let isPartOfProperty = false;
        let foundEquals = false;
        const walker = context.getTokenWalker();
        while (walker.hasPrev()) {
          const token = walker.prev();
          if (
            token.name === "punctuation" &&
            (token.value === ";" || token.value === "{")
          )
            return isPartOfProperty || !foundEquals;

          if (token.name === "operator" && token.value === "=")
            foundEquals = true;
          else if (token.name === "keyword" && token.value === "@property")
            isPartOfProperty = true;
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
          util.whitespace,
          { token: "punctuation", values: [")"] },
          util.whitespace,
          { token: "punctuation", values: ["["] }
        ],
        [
          util.whitespace,
          { token: "operator", values: ["*", "**"] },
          util.whitespace,
          { token: "punctuation", values: [")"] },
          util.whitespace,
          { token: "operator", values: ["&"], optional: true },
          { token: "ident" }
        ],

        [
          util.whitespace,
          { token: "operator", values: ["*", "**"] },
          util.whitespace,
          { token: "punctuation", values: [")"] },
          util.whitespace,
          { token: "operator", values: ["&"], optional: true },
          { token: "punctuation", values: ["["] }
        ]
      ];

      return function(context: AnalyzerContext): boolean {
        if (
          !precedes.some((rule: FollowsOrPrecedesIdentRule): boolean =>
            util.IsPrecedesRuleSatisfied(context.getTokenWalker(), rule, false)
          )
        )
          return false;

        // make sure the previous tokens are "(" and then not a keyword or an ident
        // this'll make sure that things like "if (foo) doSomething();" and "bar(foo)" won't color "foo"
        const walker = context.getTokenWalker();
        while (walker.hasPrev()) {
          const token = walker.prev();
          if (token.name === "punctuation" && token.value === "(") {
            const prevToken = util.getPreviousNonWsToken(
              context.tokens,
              walker.index
            );
            if (prevToken) {
              if (prevToken.name === "ident") return false;

              if (
                prevToken.name === "keyword" &&
                util.contains(["if", "while"], prevToken.value)
              )
                return false;
            }

            return true;
          }
        }
        return false;
      };
    })(),

    // FIXME: check why this code is different from that in C++ highlighter.
    // Most likely a bug since this is untested.
    // generic definitions/params between "<" and ">"
    // stolen and slightly modified from cpp, this is actually for protocols, since objective-c doesn't have generics
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
        if (token.name === "operator")
          switch (token.value) {
            case "<":
            case "<<":
              bracketCountLeft[0] += token.value.length;
              continue;
            case ">":
            case ">>":
              if (bracketCountLeft[0] === 0) return false;

              bracketCountLeft[1] += token.value.length;
              continue;
            case ".":
            case "::":
            // allows generic method invocations, like "Foo" in "foo.Resolve<Foo>()"
            // fall through
            case "*":
              // allows pointers
              continue;
          }

        if (
          // (token.name === "keyword" && util.contains(acceptableKeywords, token.value))
          token.name === "default" ||
          (token.name === "punctuation" && token.value === ",")
        )
          continue;

        if (
          token.name === "ident" ||
          (token.name === "keyword" &&
            util.contains(["id", "static_cast"], token.value))
        ) {
          foundIdent = true;
          continue;
        }

        // anything else means we're no longer in a generic definition
        break;
      }

      // Returns false if not inside a generic definition
      if (!foundIdent || bracketCountLeft[0] === 0) return false;

      // now look forward to make sure the generic definition is closed
      // this avoids false positives like "foo < bar"
      const walker2 = context.getTokenWalker();
      while (walker2.hasNext()) {
        const token = walker2.next();
        if (
          token.name === "operator" &&
          (token.value === ">" || token.value === ">>")
        )
          return true;

        if (
          // TODO: check commented code.
          // (token.name === "keyword" && util.contains(acceptableKeywords, token.value))
          (token.name === "operator" &&
            util.contains(["<", "<<", "::", "*"], token.value)) ||
          (token.name === "punctuation" && token.value === ",") ||
          token.name === "ident" ||
          token.name === "default"
        )
          continue;

        return false;
      }

      return false;
    },

    // ident before <>
    // stolen from c++/java/c#
    function(context: AnalyzerContext): boolean {
      // if it's preceded by an ident or a primitive/alias keyword then it's no
      // good (i.e. a generic method definition like "public void Foo<T>") also
      // a big fail if it is preceded by a ., i.e. a generic method invocation
      // like container.Resolve()
      {
        const token = util.getPreviousNonWsToken(context.tokens, context.index);
        if (
          token &&
          (token.name === "ident" ||
            (token.name === "operator" && token.value === "."))
        )
          return false;
      }

      // needs to be immediately followed by <, then by idents, acceptable
      // keywords and ",", and then closed by >, then immediately followed by an
      // ident
      {
        const token = util.getNextNonWsToken(context.tokens, context.index);
        if (!token || token.name !== "operator" || token.value !== "<")
          return false;
      }

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
          (token.name === "punctuation" && token.value === ",")
        )
          continue;

        return false;
      }

      // verify bracket count, if mismatched, could be something scary
      if (bracketCount[0] !== bracketCount[1]) return false;

      // next token should be optional whitespace followed by an ident
      if (!walker.hasNext()) return false;
      let token = walker.next();
      if (token.name === "default") {
        if (!walker.hasNext()) return false;
        token = walker.next();
      }
      return token.name === "ident";
    }
  ],

  follows: [
    [
      {
        token: "keyword",
        values: ["@interface", "@protocol", "@implementation"]
      },
      { token: "default" }
    ]
  ],

  precedes: [
    [{ token: "operator", values: ["::"] }],

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
      util.whitespace,
      { token: "operator", values: ["&"] },
      util.whitespace,
      { token: "ident" },
      util.whitespace,
      { token: "operator", values: ["=", ","] }
    ]
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
