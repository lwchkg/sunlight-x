// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as events from "../events.js";
import * as logger from "../logger.js";
import * as util from "../util.js";

import type { Highlighter } from "../highlighter.js";

import type {
  AnalyzerContext,
  BetweenIdentRule,
  FollowsOrPrecedesIdentRule,
  ParserContext,
  Token
} from "../util.js";

export const name = "scala";
export const keywords = [
  "abstract",
  "case",
  "catch",
  "class",
  "def",
  "do",
  "else",
  "extends",
  "false",
  "final",
  "finally",
  "forSome",
  "for",
  "if",
  "implicit",
  "import",
  "lazy",
  "match",
  "new",
  "null",
  "object",
  "override",
  "package",
  "private",
  "protected",
  "return",
  "sealed",
  "super",
  "this",
  "throw",
  "trait",
  "try",
  "true",
  "type",
  "val",
  "var",
  "while",
  "with",
  "yield"
];

export const embeddedLanguages = {
  xml: {
    switchTo: function(context: ParserContext): boolean {
      context.items.literalXmlNestingLevel = 0;

      if (
        context.reader.peek() !== "<" ||
        !/[\w!?]/.test(context.reader.peekWithOffset(1))
      )
        return false;

      if (context.defaultData.text !== "")
        // preceded by whitespace
        return true;

      const prevToken = context.token(context.count() - 1);
      return (
        prevToken &&
        prevToken.name === "punctuation" &&
        util.contains(["(", "{"], prevToken.value)
      );
    },

    switchBack: function(context: ParserContext): boolean {
      const prevToken = context.token(context.count() - 1);
      if (!prevToken) return false;

      if (typeof context.items.literalXmlNestingLevel !== "number") {
        logger.errorInvalidValue(
          `literalXmlNestingLevel is not a number.`,
          context.items.literalXmlNestingLevel
        );
        return true;
      }

      if (prevToken.name === "tagName") {
        if (!context.items.literalXmlOpenTag)
          context.items.literalXmlOpenTag = prevToken.value;
      } else if (prevToken.name === "operator") {
        switch (prevToken.value) {
          case "<":
            context.items.literalXmlNestingLevel++;
            break;
          case "</":
          case "/>":
            context.items.literalXmlNestingLevel--;
            break;
        }
      }

      if (
        context.items.literalXmlOpenTag &&
        context.items.literalXmlNestingLevel === 0 &&
        (prevToken.value === ">" || prevToken.value === "/>")
      )
        return true;

      return false;
    }
  }
};

export const scopes = {
  string: [['"""', '"""', [], false], ['"', '"', ["\\\\", '\\"'], false]],
  char: [["'", "'", ["\\\\", "\\'"], false]],
  quotedIdent: [["`", "`", ["\\`", "\\\\"], false]],
  comment: [["//", "\n", [], true], ["/*", "*/", [], false]],
  annotation: [["@", { length: 1, regex: /\W/ }, [], true]]
};

export const identFirstLetter = /[A-Za-z]/;
export const identAfterFirstLetter = /\w/;

export const customParseRules = [
  // symbol literals
  function(context: ParserContext): ?Token {
    if (!context.reader.match("'")) return null;

    // TODO: don't use regular expression.
    const match: [string, string] = /^('\w+)(?!')/i.exec(
      context.reader.peekToEOF()
    );
    if (!match) return null;
    context.reader.read(match[1].length);

    return context.createToken("symbolLiteral", match[1]);
  },

  // case classes: can't distinguish between a case class and a function call so
  // we need to keep track of them
  function(context: ParserContext): ?Token {
    if (context.defaultData.text === "") return null;

    if (!/[A-Za-z]/.test(context.reader.peek())) return null;

    const prevToken = context.token(context.count() - 1);
    if (
      !prevToken ||
      prevToken.name !== "keyword" ||
      !util.contains(["class", "type", "trait", "object"], prevToken.value)
    )
      return null;

    // read the ident
    let ident = context.reader.read();
    while (!context.reader.isEOF() && /\w/.test(context.reader.peek()))
      ident += context.reader.read();

    context.userDefinedNameStore.addName(ident, name);
    return context.createToken("ident", ident);
  }
];

export const namedIdentRules = {
  custom: [
    // some built in types
    (function(): AnalyzerContext => boolean {
      const builtInTypes = [
        "Nil",
        "Nothing",
        "Unit",
        "Pair",
        "Map",
        "String",
        "List",
        "Int",

        "Seq",
        "Option",
        "Double",
        "AnyRef",
        "AnyVal",
        "Any",
        "ScalaObject",
        "Float",
        "Long",
        "Short",
        "Byte",
        "Char",
        "Boolean"
      ];

      return function(context: AnalyzerContext): boolean {
        // next token is not "."
        const nextToken = util.getNextNonWsToken(context.tokens, context.index);
        if (
          nextToken &&
          nextToken.name === "operator" &&
          nextToken.value === "."
        )
          return false;

        return util.contains(builtInTypes, context.tokens[context.index].value);
      };
    })(),

    // user-defined types
    function(context: AnalyzerContext): boolean {
      return context.userDefinedNameStore.hasName(
        context.tokens[context.index].value,
        name
      );
    },

    // fully qualified type names after "new"
    function(context: AnalyzerContext): boolean {
      // TODO: add test. The while loop is untested.

      // The next token must not be "."
      const nextToken = util.getNextNonWsToken(context.tokens, context.index);
      if (nextToken && nextToken.name === "operator" && nextToken.value === ".")
        return false;

      // Go backward and check that if there are only idents and dots after the
      // new keyword.
      const walker = context.getTokenWalker();
      let previousIsIdent = true; // the current token is an ident
      while (walker.hasPrev()) {
        const token = walker.prev();

        if (token.name === "keyword" && token.value === "new") return true;

        if (token.name === "default") continue;

        if (token.name === "ident") {
          if (previousIsIdent) return false;

          previousIsIdent = true;
          continue;
        }

        if (token.name === "operator" && token.value === ".") {
          if (!previousIsIdent) return false;

          previousIsIdent = false;
          continue;
        }

        break;
      }

      return false;
    },

    (function(): AnalyzerContext => boolean {
      const follows = [
        [
          {
            token: "keyword",
            values: ["class", "object", "extends", "new", "type", "trait"]
          },
          { token: "default" }
        ],
        [{ token: "operator", values: [":"] }, util.whitespace],
        [{ token: "operator", values: ["#"] }],
        [
          { token: "keyword", values: ["type"] },
          { token: "default" },
          { token: "ident" },
          util.whitespace,
          { token: "operator", values: ["="] },
          util.whitespace
        ]
      ];
      const between = [
        // generics
        {
          opener: { token: "punctuation", values: ["["] },
          closer: { token: "punctuation", values: ["]"] }
        }
      ];

      return function(context: AnalyzerContext): boolean {
        // generic type names are assumed to start with a capital letter
        // optionally followed by a number or another capital letter e.g. A, T1,
        // TFrom, etc.
        if (/^[A-Z]([A-Z0-9]\w*)?$/.test(context.tokens[context.index].value))
          return false;

        return (
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
      };
    })()
  ]
};

export const contextItems = {
  literalXmlOpenTag: null,
  literalXmlNestingLevel: 0
};

export const operators = [
  "++",
  "+=",
  "+",
  "--",
  "-=",
  "->",
  "-",
  "*=",
  "*",
  "^=",
  "^^",
  "^",
  "~>",
  "~",
  "!=",
  "!",
  "&&",
  "&=",
  "&",
  "||",
  "|=",
  "|",

  ">>>",
  ">>=",
  ">>",
  ">",
  "<<=",
  "<<",
  "<~",
  "<=",
  "<%",
  "<",

  "%>",
  "%=",
  "%",

  "::",
  ":<",
  ":>",
  ":",

  "==",
  "=",

  "@",
  "#",
  "_",
  "."
];

events.BeforeHighlightEvent.addListener(
  (highlighter: Highlighter, context: events.BeforeHighlightEventArgs) => {
    if (context.language.name === "scala")
      highlighter.options.enableScalaXmlInterpolation = true;
  }
);

events.AfterHighlightEvent.addListener((highlighter: Highlighter) => {
  highlighter.options.enableScalaXmlInterpolation = false;
});
