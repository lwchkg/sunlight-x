// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

import type { ScopeType } from "../languages.js";
import type {
  AnalyzerContext,
  BetweenIdentRule,
  FollowsOrPrecedesIdentRule
} from "../util.js";

/**
 * Prepend regex to named-ident functions.
 * @param {function} func
 * @returns {function}
 */
function createNamedIdentFunction(
  func: AnalyzerContext => boolean
): AnalyzerContext => boolean {
  const typeDefinitionRegex = /^T([A-Z0-9]\w*)?$/;
  return function(context: AnalyzerContext): boolean {
    return (
      !typeDefinitionRegex.test(context.tokens[context.index].value) &&
      func(context)
    );
  };
}

const primitives = [
  "boolean",
  "byte",
  "char",
  "double",
  "float",
  "int",
  "long",
  "short"
];
const acceptableKeywords = primitives.concat(["extends"]);

export const name = "java";

export const keywords = [
  // http://download.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
  "abstract",
  "assert",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "final",
  "finally",
  "float",
  "for",
  "goto",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "native",
  "new",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "strictfp" /* wtf? */,
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "try",
  "void",
  "volatile",
  "while",

  // literals
  "null",
  "false",
  "true"
];

export const scopes: { [string]: ScopeType[] } = {
  string: [
    ['"', '"', util.escapeSequences.concat(['\\"']), false],
    ["'", "'", ["'", "\\\\"], false]
  ],
  comment: [["//", "\n", [], true], ["/*", "*/", [], false]],
  annotation: [["@", { length: 1, regex: /[\s(]/ }, [], true]]
};

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;

// these are mostly stolen from the C# lang file
export const namedIdentRules = {
  custom: [
    // generic definitions/params between "<" and ">"
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      // between < and > and preceded by an ident and not preceded by "class"

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
            case "?":
            case "&":
              // allows generic method invocations, like "Foo" in "foo.Resolve<Foo>()"
              // and <? extends Bar & Baz>
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

      // fail if not inside a generic definition
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
    }),

    // generic declarations and return values (ident preceding a generic definition)
    // this finds "Foo" in "Foo<Bar> foo"
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      // if it's preceded by an ident or a primitive/alias keyword then it's no good (i.e. a generic method definition like "public void Foo<T>")
      // also a big fail if it is preceded by a ., i.e. a generic method invocation like container.Resolve()
      {
        const token = util.getPreviousNonWsToken(context.tokens, context.index);
        if (
          token &&
          (token.name === "ident" ||
            (token.name === "keyword" &&
              util.contains(primitives.concat(["void"]), token.value)) ||
            (token.name === "operator" && token.value === "."))
        )
          return false;
      }

      // needs to be immediately followed by <, then by idents or ?, acceptable keywords and ",", and then closed by >, then immediately followed by an ident
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
            case "?":
            case "&":
              // e.g. Foo<? extends Bar & Baz>
              break;
            default:
              return false;
          }

          // if bracket counts match, get the f out
          if (bracketCount[0] > 0 && bracketCount[0] === bracketCount[1]) break;

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
      if (!walker.hasNext()) return false;

      let token = walker.next();
      if (token.name === "default") {
        if (!walker.hasNext()) return false;
        token = walker.next();
      }
      return token.name === "ident";
    }),

    // fully qualified type names
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      // next token is not "."
      const nextToken = util.getNextNonWsToken(context.tokens, context.index);
      if (nextToken && nextToken.name === "operator" && nextToken.value === ".")
        return false;

      // go backward and make sure that there are only idents and dots before
      // the new keyword
      const walker = context.getTokenWalker();
      let previousToken = walker.current();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (
          token.name === "keyword" &&
          (token.value === "new" ||
            token.value === "import" ||
            token.value === "instanceof")
        )
          return true;

        if (token.name === "default") continue;

        if (token.name === "ident") {
          if (previousToken && previousToken.name === "ident") return false;

          previousToken = token;
          continue;
        }

        if (token.name === "operator" && token.value === ".") {
          if (previousToken && previousToken.name !== "ident") return false;

          previousToken = token;
          continue;
        }

        break;
      }

      return false;
    }),

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
          { token: "keyword", values: ["this"] }
        ]
      ];

      return createNamedIdentFunction((context: AnalyzerContext): boolean => {
        if (
          !precedes.some((precede: FollowsOrPrecedesIdentRule): boolean =>
            util.IsPrecedesRuleSatisfied(
              context.getTokenWalker(),
              precede,
              false
            )
          )
        )
          return false;

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
      });
    })(),

    // can't use the follows/precedes/between utilities since we need to verify that it doesn't match the type definition naming convention
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      const follows = [
        [
          { token: "ident" },
          util.whitespace,
          { token: "keyword", values: ["extends", "implements"] },
          util.whitespace
        ],

        // method/property return values
        // class/interface names
        [
          {
            token: "keyword",
            values: [
              "class",
              "interface",
              "enum",
              "public",
              "private",
              "protected",
              "static",
              "final"
            ]
          },
          util.whitespace
        ],

        // bounded generic interface constraints
        // this matches "MyInterface" in "public <T extends Object & MyInterface>..."
        [
          { token: "keyword", values: ["extends"] },
          { token: "default" },
          { token: "ident" },
          { token: "default" },
          { token: "operator", values: ["&"] },
          { token: "default" }
        ]
      ];
      const precedes = [
        // arrays
        [
          util.whitespace,
          { token: "punctuation", values: ["["] },
          util.whitespace,
          { token: "punctuation", values: ["]"] }
        ], // in method parameters

        // assignment: Object o = new object();
        // method parameters: public int Foo(Foo foo, Bar b, Object o) { }
        [{ token: "default" }, { token: "ident" }]
      ];
      const between = [
        {
          opener: { token: "keyword", values: ["implements", "throws"] },
          closer: { token: "punctuation", values: ["{"] }
        }
      ];

      return (
        precedes.some((rule: FollowsOrPrecedesIdentRule): boolean =>
          util.IsPrecedesRuleSatisfied(context.getTokenWalker(), rule, false)
        ) ||
        follows.some((rule: FollowsOrPrecedesIdentRule): boolean =>
          util.IsFollowsRuleSatisfied(context.getTokenWalker(), rule, false)
        ) ||
        between.some((rule: BetweenIdentRule): boolean =>
          util.IsBetweenRuleSatisfied(
            context.getTokenWalker(),
            rule.opener,
            rule.closer,
            false
          )
        )
      );
    })
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
  "==",
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
