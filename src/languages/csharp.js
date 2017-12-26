// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";
import * as DotNetCommon from "./common/dotnet.js";

import type {
  AnalyzerContext,
  FollowsOrPrecedesIdentRule,
  ParserContext,
  Token
} from "../util.js";

/* eslint no-magic-numbers: 1 */
const primitives = [
  "int",
  "bool",
  "double",
  "float",
  "char",
  "byte",
  "sbyte",
  "uint",
  "long",
  "ulong",
  "char",
  "decimal",
  "short",
  "ushort"
];
// things that are allowed inside a generic type definition
const acceptableKeywords = primitives.concat(["in", "out", "string", "object"]);

const typeDefinitionRegex = /^T([A-Z0-9]\w*)?$/;
/**
 * TODO: description
 * @param {function} func
 * @return {function}
 */
function createNamedIdentFunction(
  func: AnalyzerContext => boolean
): AnalyzerContext => boolean {
  return function(context: AnalyzerContext): boolean {
    return (
      !typeDefinitionRegex.test(context.tokens[context.index].value) &&
      func(context)
    );
  };
}

export const name = "csharp";

export const keywords = primitives.concat([
  // this is also contextual (must be first thing in the file or something), but
  // it's never used so i don't really care
  "extern alias",

  // class qualifiers
  "public",
  "private",
  "protected",
  "internal",
  "static",
  "sealed",
  "abstract",
  "partial",

  // method qualifiers
  "virtual",
  "override",
  "new",
  "implicit",
  "explicit",
  "extern",
  "override",
  "operator",

  // member qualifiers
  "const",
  "readonly",
  "volatile",

  // types
  "class",
  "interface",
  "enum",
  "struct",
  "event",
  "delegate",

  // literals
  "null",
  "true",
  "false",

  // aliases
  "string",
  "object",
  "void",

  // looping
  "for",
  "foreach",
  "do",
  "while",

  // scoping
  "fixed",
  "unchecked",
  "using",
  "lock",
  "namespace",
  "checked",
  "unsafe",

  // flow control
  "if",
  "else",
  "try",
  "catch",
  "finally",
  "break",
  "continue",
  "goto",
  "case",
  "throw",
  "return",
  "switch",
  "yield return",
  "yield break",

  // parameter qualifiers
  "in",
  "out",
  "ref",
  "params",

  // type comparison
  "as",
  "is",
  "typeof",

  // other
  "this",
  "sizeof",
  "stackalloc",
  "var",
  "default",

  // contextual keywords
  // property stuff
  // get, set and value are handled by customParseRules below

  // linq
  "from",
  "select",
  "where",
  "groupby",
  "orderby"
]);

export const customParseRules = [
  DotNetCommon.XMLDocComment("///"),

  // get/set contextual keyword
  function(context: ParserContext): ?Token {
    if (!/^(get|set)\b/.test(context.reader.currentAndPeek(4))) return null;

    if (
      !util.IsFollowsRuleSatisfied(context.getTokenWalker(), [
        { token: "punctuation", values: ["}", "{", ";"] },
        util.whitespace,
        {
          token: "keyword",
          values: ["public", "private", "protected", "internal"],
          optional: true
        }
      ])
    )
      return null;

    // now we need to look ahead and verify that the next non-sunlight.util.whitespace token is "{" or ";"
    let count = "get".length;
    let peek = context.reader.peek(count);
    let allGoodYo = false;
    while (peek.length === count) {
      if (!/\s$/.test(peek)) {
        if (!/[{;]$/.test(peek)) return null;

        allGoodYo = true;
        break;
      }

      peek = context.reader.peek(++count);
    }

    if (!allGoodYo) return null;

    const value = context.reader.current() + context.reader.read(2); // we already read the first letter
    return context.createToken("keyword", value);
  },

  // value contextual keyword
  function(context: ParserContext): ?Token {
    if (!/^value\b/.test(context.reader.currentAndPeek(6))) return null;

    // comes after "set" but not after the closing "}" (we'll have to count them to make sure scoping is correct)
    // can't be on the left side of an assignment

    // first check equals because that's easy
    let count = "value".length;
    let peek = context.reader.peek(count);
    let allGoodYo = false;
    while (peek.length === count) {
      if (!/\s$/.test(peek)) {
        const peekPlus1 = context.reader.peek(count + 1);
        if (
          peek.charAt(peek.length - 1) === "=" &&
          peekPlus1.charAt(peekPlus1.length - 1) !== "="
        )
          // "value" is on the left side of an assignment, so this is not the droid we're looking for
          return null;

        allGoodYo = true;
        break;
      }

      peek = context.reader.peek(++count);
    }

    if (!allGoodYo)
      // EOF FTL
      return null;

    // now go backward until we run into a "set" keyword, keeping track of all brackets along the way
    const bracketCount = [0, 0]; // open, close
    const walker = context.getTokenWalker();
    let token;
    tokenLoop: for (;;) {
      if (!walker.hasPrev()) return null;
      token = walker.prev();
      if (token.name === "punctuation") {
        if (token.value === "{") bracketCount[0]++;
        else if (token.value === "}") bracketCount[1]++;
      } else if (token.name === "keyword") {
        switch (token.value) {
          case "set":
            // yay!
            break tokenLoop;
          case "class":
          case "public":
          case "private":
          case "protected":
          case "internal":
            // easiest way to detect we're out of scope so we can stop looking
            return null;
        }
      }
    }

    // examine the bracket count and make sure we're in the correct scope
    if (bracketCount[1] >= bracketCount[0])
      // nope
      return null;

    context.reader.read(4); // already read the "v" in "value"
    return context.createToken("keyword", "value");
  }
];

export const scopes = {
  string: [
    ['"', '"', util.escapeSequences.concat(['\\"']), false],
    ['@"', '"', ['""'], false]
  ],
  char: [["'", "'", ["\\'", "\\\\"], false]],
  comment: [["//", "\n", [], true], ["/*", "*/", [], false]],
  pragma: [["#", "\n", [], true]]
};

// TODO: accept all .NET identifier characters, not just ASCII
export const identFirstLetter = /[A-Za-z_@]/;
export const identAfterFirstLetter = /\w/;

export const namedIdentRules = {
  custom: [
    // extends/implements/type constraints
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      // between ":" and "{" but not case statements

      // look backward for a ":" not preceded by a "case"
      const walker = context.getTokenWalker();
      let foundColon = false;
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (token.name === "punctuation" && token.value === "{") return false;

        if (token.name === "keyword" && token.value === "case") return false;

        if (
          token.name === "keyword" &&
          (token.value === "class" || token.value === "where")
        ) {
          // the "class" keyword for classes
          // or the "where" keyword for generic methods/classes with type constraints

          // if "class" is used as a type constraint, then ignore it
          const nextToken =
            walker.peek(1).name === "default"
              ? walker.peekUnsafe(2)
              : walker.peek(1);
          if (
            nextToken &&
            nextToken.name === "punctuation" &&
            nextToken.value === ","
          )
            continue;

          break;
        }

        if (token.name === "operator" && token.value === ":")
          // make sure there isn't a case preceding it
          foundColon = true;
      }

      if (!foundColon) return false;

      return true;
    }),

    // generic definitions/params between "<" and ">"
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      // between < and > and preceded by an ident and not preceded by "class"

      // look for "<" preceded by an ident but not "class"
      // if we run into ">" before "," or "<" then it's a big fail
      let foundIdent = false;
      const bracketCountLeft = [0, 0];
      let walker = context.getTokenWalker();
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
              continue;
            case ">":
            case ">>":
              if (bracketCountLeft[0] === 0) return false;

              bracketCountLeft[1] += token.value.length;
              continue;
          }

          break;
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
      walker = context.getTokenWalker();
      while (walker.hasNext()) {
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
    }),

    // generic declarations and return values (ident preceding a generic definition)
    // this finds "Foo" in "Foo<Bar> foo"
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      // if it's preceded by an ident or a primitive/alias keyword then it's no good (i.e. a generic method definition like "public void Foo<T>")
      // also a big fail if it is preceded by a ., i.e. a generic method invocation like container.Resolve()
      {
        const token = util.getPreviousNonWsToken(context.tokens, context.index);
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
      }

      // needs to be immediately followed by <, then by idents, acceptable keywords and ",", and then closed by >, then immediately followed by an ident
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

    // using aliases, e.g. "Foo" in "using Foo = System.Linq.Enumerable;"
    function(context: AnalyzerContext): boolean {
      // previous non-ws token must be "using" and next non-ws token must be "="
      const prevToken = util.getPreviousNonWsToken(
        context.tokens,
        context.index
      );

      if (
        !prevToken ||
        prevToken.name !== "keyword" ||
        prevToken.value !== "using"
      )
        return false;

      const nextToken = util.getNextNonWsToken(context.tokens, context.index);
      if (
        !nextToken ||
        nextToken.name !== "operator" ||
        nextToken.value !== "="
      )
        return false;

      return true;
    },

    // attributes (friggin' attributes...)
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
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

      // This is annoyingly complicated...
      // We need to verify that we're between [], but not in something like "new
      // string[foo]" for instance

      // first, verify that we're inside an opening bracket
      const bracketCount: [number, number] = [0, 0];
      let walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (token.name !== "punctuation") continue;

        if (token.value === "[") {
          bracketCount[0]++;
          continue;
        }

        if (token.value === "]") {
          bracketCount[1]++;
          continue;
        }

        // Start of named ident token
        if (token.value === "{" || token.value === "}" || token.value === ";")
          break;
      }

      // if no brackets were found OR...
      // all the found brackets are closed, so this ident is actually outside of
      // the brackets duh.
      if (bracketCount[0] === 0 || bracketCount[0] === bracketCount[1])
        return false;

      // next, verify we're inside a closing bracket
      walker = context.getTokenWalker();
      let indexOfLastBracket = -1;
      while (walker.hasNext()) {
        const token = walker.next();
        if (token.name === "punctuation") {
          if (token.value === "[") {
            bracketCount[0]++;
            continue;
          }
          if (token.value === "]") {
            indexOfLastBracket = walker.index;
            bracketCount[1]++;
            continue;
          }

          // End of named ident token
          if (token.value === "{" || token.value === "}" || token.value === ";")
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
    }),

    // fully qualified type names
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      // next token is not "."
      const nextToken = util.getNextNonWsToken(context.tokens, context.index);

      if (nextToken && nextToken.name === "operator" && nextToken.value === ".")
        return false;

      // go backward and make sure that there are only idents and dots before the new keyword
      // "previous" is used to make sure that method declarations like "public new Object Value()..." are treated correctly
      const walker = context.getTokenWalker();
      let previous = walker.current();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (
          token.name === "keyword" &&
          (token.value === "new" || token.value === "is")
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
            return !prevToken || prevToken.name !== "keyword";
          }
        }

        return false;
      });
    })(),

    // using alias type names, e.g. "Foo" in "using Bar = My.Namespace.Foo;"
    function(context: AnalyzerContext): boolean {
      const nextToken = util.getNextNonWsToken(context.tokens, context.index);
      if (
        !nextToken ||
        nextToken.name !== "punctuation" ||
        nextToken.value !== ";"
      )
        return false;

      // should be preceded by idents and dots, and then "using ="
      const walker = context.getTokenWalker();
      while (walker.hasPrev()) {
        const token = walker.prev();
        if (
          token.name === "ident" ||
          token.name === "default" ||
          (token.name === "operator" && token.value === ".")
        )
          continue;

        // should be an equals sign, and then an ident and then "using"
        if (token.name !== "operator" || token.value !== "=") return false;

        return util.IsFollowsRuleSatisfied(walker, [
          { token: "keyword", values: ["using"] },
          { token: "default" },
          { token: "ident" },
          util.whitespace
        ]);
      }

      return false;
    },

    // can't use the follows/precedes utilities since we need to verify that it
    // doesn't match the type definition naming convention
    createNamedIdentFunction((context: AnalyzerContext): boolean => {
      const follows = [
        // method/property return values
        // special method parameters
        // new: public new Foo Method() { } and new Foo();
        // class/interface/event/struct/delegate names
        [
          {
            token: "keyword",
            values: [
              "class",
              "interface",
              "event",
              "struct",
              "enum",
              "delegate",
              "public",
              "private",
              "protected",
              "internal",
              "static",
              "virtual",
              "sealed",
              "params"
            ]
          },
          util.whitespace
        ],

        // typeof/default
        [
          { token: "keyword", values: ["typeof", "default"] },
          util.whitespace,
          { token: "punctuation", values: ["("] },
          util.whitespace
        ],

        // casting using "as"
        [{ token: "keyword", values: ["as"] }, util.whitespace]
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

      return (
        precedes.some((rule: FollowsOrPrecedesIdentRule): boolean =>
          util.IsPrecedesRuleSatisfied(context.getTokenWalker(), rule, false)
        ) ||
        follows.some((rule: FollowsOrPrecedesIdentRule): boolean =>
          util.IsFollowsRuleSatisfied(context.getTokenWalker(), rule, false)
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
  "??",
  "?",
  "::",
  ":",
  ".",
  "=>",
  "="
];
