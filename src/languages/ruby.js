// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow

/* eslint no-magic-numbers: 1 */
import * as logger from "../logger.js";
import * as util from "../util.js";

import type { ParserContext, Token } from "../util.js";

export const name = "ruby";

// http://www.ruby-doc.org/docs/keywords/1.9/
export const keywords = [
  "BEGIN",
  "END",
  "__ENCODING__",
  "__END__",
  "__FILE__",
  "__LINE__",
  "alias",
  "and",
  "begin",
  "break",
  "case",
  "class",
  "def",
  "defined?",
  "do",
  "else",
  "elsif",
  "end",
  "ensure",
  "false",
  "for",
  "if",
  "in",
  "module",
  "next",
  "nil",
  "not",
  "or",
  "redo",
  "rescue",
  "retry",
  "return",
  "self",
  "super",
  "then",
  "true",
  "undef",
  "unless",
  "until",
  "when",
  "while",
  "yield"
];

export const customTokens = {
  // http://www.ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/function.html
  function: {
    values: [
      "Array",
      "Float",
      "Integer",
      "String",
      "at_exit",
      "autoload",
      "binding",
      "caller",
      "catch",
      "chop!",
      "chop",
      "chomp!",
      "chomp",
      "eval",
      "exec",
      "exit!",
      "exit",
      "fail",
      "fork",
      "format",
      "gets",
      "global_variables",
      "gsub!",
      "gsub",
      "iterator?",
      "lambda",
      "load",
      "local_variables",
      "loop",
      "open",
      "p",
      "print",
      "printf",
      "proc",
      "putc",
      "puts",
      "raise",
      "rand",
      "readline",
      "readlines",
      "require",
      "select",
      "sleep",
      "split",
      "sprintf",
      "srand",
      "sub!",
      "sub",
      "syscall",
      "system",
      "test",
      "trace_var",
      "trap",
      "untrace_var"
    ],
    boundary: "\\W"
  },

  specialOperator: {
    values: ["defined?", "eql?", "equal?"],
    boundary: "\\W"
  }
};

export const customParseRules = [
  // regex literal, mostly the same as javascript
  function(context: ParserContext): ?Token {
    if (context.reader.current() !== "/") return null;

    const previousNonWsToken = context.token(context.count() - 1);
    let previousToken = null;
    if (context.defaultData.text !== "")
      previousToken = context.createToken(
        "default",
        context.defaultData.text,
        context.defaultData.line,
        context.defaultData.column
      );

    if (!previousToken) previousToken = previousNonWsToken;

    if (
      // The first token of the string
      previousToken !== undefined &&
      // Since Ruby doesn't require statement terminators, if the previous token
      // was whitespace and contained a newline, then we're good.
      (previousToken.name !== "default" ||
        previousToken.value.indexOf("\n") < 0)
    ) {
      // In these case the / stands for division.
      if (
        util.contains(["keyword", "ident", "number"], previousNonWsToken.name)
      )
        return null;
      if (
        previousNonWsToken.name === "punctuation" &&
        !util.contains(["(", "{", "[", ","], previousNonWsToken.value)
      )
        return null;
    }

    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    // read the regex literal
    let regexLiteral = "/";
    let charClass = false;
    while (!context.reader.isPeekEOF()) {
      const next = context.reader.read();
      regexLiteral += next;

      if (next === "\\") regexLiteral += context.reader.read();
      else if (next === "[") charClass = true;
      else if (next === "]") charClass = false;
      else if (next === "/" && !charClass) break;
    }

    // Read the regex modifiers. For the sake of simplicity we accept all
    // characters, but currently only "ioxmusen" are supported.
    while (
      !context.reader.isPeekEOF() &&
      /[A-Za-z]/.test(context.reader.peek())
    )
      regexLiteral += context.reader.read();

    return context.createToken("regexLiteral", regexLiteral, line, column);
  },

  // symbols
  function(context: ParserContext): ?Token {
    // this is goofy, because it needs to recognize things like "foo = true ? :true :not_true"
    // and detect that :not_true is not a symbol
    if (
      context.reader.current() !== ":" ||
      !/[a-zA-Z_]/.test(context.reader.peek())
    )
      return null;

    // basically look backward until a line break not preceded by an operator or
    // a comma
    const walker = context.getTokenWalker();
    let parenCount = 0;
    const count = walker.index - 1;
    while (walker.hasPrev()) {
      const token = walker.prev();
      if (token.name === "operator") {
        if (parenCount === 0)
          if (token.value === "?" && walker.index < count) {
            // this is a ternary operator, not a symbol
            return null;
          } else if (token.value === ":") {
            break;
          }
      } else if (token.name === "punctuation") {
        switch (token.value) {
          case "(":
            parenCount--;
            break;
          case ")":
            parenCount++;
            break;
        }
      } else if (token.name === "default" && /\n/.test(token.value)) {
        if (walker.hasPrev()) {
          const prevToken = walker.peek(-1);
          if (
            prevToken.name === "operator" ||
            (prevToken.name === "punctuation" && prevToken.value === ",")
          )
            // line continuation
            continue;
        }
        break;
      }
    }

    // read the symbol
    const symbol: string = /^:\w+/.exec(context.reader.substring())[0];
    const token = context.createToken(
      "symbol",
      symbol,
      context.reader.getLine(),
      context.reader.getColumn()
    );
    context.reader.read(symbol.length - 1); // already read the ":"
    return token;
  },

  // heredoc declaration
  // heredocs can be stacked and delimited, so this is a bit complicated
  // we keep track of the heredoc declarations in context.items.heredocQueue,
  // and then use them later in the heredoc custom parse rule below
  function(context: ParserContext): ?Token {
    if (
      context.reader.current() !== "<" ||
      !/<[\w'"`-]/.test(context.reader.peek(2))
    )
      return null;

    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    // cannot be preceded by an a number or a string
    const walker = context.getTokenWalker();
    if (walker.hasPrev()) {
      const prevToken = walker.prev();
      if (util.contains(["number", "string"], prevToken.name)) return null;
    }

    // there are still cases where heredocs are falsely detected, because it would require performing
    // static analysis

    // e.g. foo <<a
    // if foo is an object that has the "<<" method defined, then it will perform a left shift
    // if foo is a function that takes a string argument, it will interpret it as a heredoc

    // so, we just force you to have whitespace between << and the rhs operand in these ambiguous cases

    // can be between quotes (double, single or back) or not, or preceded by a hyphen
    context.reader.read(2);

    let value = "<<";
    let ident = "";
    let current = context.reader.current();
    if (current === "-") {
      value += current;
      ident += current;
      current = context.reader.read();
    }

    let delimiter = "";
    if (util.contains(['"', "'", "`"], current)) delimiter = current;
    else ident += current;

    value += current;

    while (!context.reader.isPeekEOF()) {
      const peek = context.reader.peek();
      if (peek === "\n" || (delimiter === "" && /\W/.test(peek))) break;

      if (peek === "\\") {
        const peek2 = context.reader.peek(2);
        if (
          delimiter !== "" &&
          util.contains(["\\" + delimiter, "\\\\"], peek2)
        ) {
          value += peek2;
          ident += context.reader.read(2);
          continue;
        }
      }

      value += context.reader.read();

      if (delimiter !== "" && peek === delimiter) break;

      ident += peek;
    }

    if (Array.isArray(context.items.heredocQueue))
      context.items.heredocQueue.push(ident);
    else
      logger.errorInvalidValue(
        `context.items.heredocQueue is not an array.`,
        context.items.heredocQueue
      );

    return context.createToken("heredocDeclaration", value, line, column);
  },

  // heredoc
  function(context: ParserContext): ?(Token[]) {
    if (!Array.isArray(context.items.heredocQueue)) {
      logger.errorInvalidValue(
        `context.items.heredocQueue is not an array.`,
        context.items.heredocQueue
      );
      return null;
    }

    if (context.items.heredocQueue.length === 0) return null;

    // there must have been at least one line break since the heredoc
    // declaration(s)
    if (context.defaultData.text.replace(/[^\n]/g, "").length === 0)
      return null;

    // we're confirmed to be in the heredoc body, so read until all of the
    // heredoc declarations have been satisfied
    const tokens: Token[] = [];
    let value = context.reader.current();
    let ignoreWhitespace = false;
    while (
      Array.isArray(context.items.heredocQueue) &&
      context.items.heredocQueue.length > 0 &&
      !context.reader.isPeekEOF()
    ) {
      let declaration = context.items.heredocQueue.shift();
      if (!(typeof declaration === "string")) {
        logger.errorInvalidValue(
          `Content of context.items.heredocQueue is not a string.`,
          declaration
        );
        return null;
      }

      if (declaration.charAt(0) === "-") {
        declaration = declaration.substring(1);
        ignoreWhitespace = true;
      }

      const line = context.reader.getLine();
      const column = context.reader.getColumn();

      // read until "\n{declaration}\n"
      // unless the declaration is prefixed with "-", then we don't care about
      // preceding whitespace, but it must be on its own line e.g. \n[
      // \t]*{declaration}\n
      const regex = new RegExp(
        "\\n" +
          (ignoreWhitespace ? "[ \\t]*" : "") +
          util.regexEscape(declaration) +
          "\\n"
      );
      const substring = context.reader.peekSubstring();
      const match = regex.exec(substring);
      // If no match, the whole file should be consumed.
      const lengthOfMatch = match
        ? match.index + match[0].length
        : substring.length;
      value += context.reader.read(lengthOfMatch);

      tokens.push(context.createToken("heredoc", value, line, column));
      value = "";
    }

    // Reset queue. This is needed if the reader reach EOF.
    context.items.heredocQueue = [];

    return tokens.length > 0 ? tokens : null;
  },

  // raw string/regex
  // http://www.ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/syntax.html#string
  // http://www.ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/syntax.html#regexp
  function(context: ParserContext): ?Token {
    // begin with % or %q or %Q with a non-alphanumeric delimiter (opening bracket/paren are closed by corresponding closing bracket/paren)
    if (context.reader.current() !== "%") return null;

    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    let readCount = 1;
    let isRegex = false;
    const peek = context.reader.peek();
    if (peek === "q" || peek === "Q" || peek === "r") {
      readCount++;
      if (peek === "r") isRegex = true;
    } else if (/[A-Za-z0-9=]$/.test(peek)) {
      // % or %= operator (how does ruby differentiate between "%=" and
      // "%=string="?)
      return null;
    }

    let value = "%";

    value += context.reader.read(readCount);
    let delimiter = value.charAt(value.length - 1);
    switch (delimiter) {
      case "(":
        delimiter = ")";
        break;
      case "[":
        delimiter = "]";
        break;
      case "{":
        delimiter = "}";
        break;
    }

    // read until the delimiter
    while (!context.reader.isPeekEOF()) {
      const next = context.reader.read();
      // Escapes.
      if (next === "\\") {
        value += next + context.reader.read();
        continue;
      }
      value += next;
      if (next === delimiter) break;
    }

    if (isRegex)
      // read potential regex modifiers
      while (!context.reader.isPeekEOF()) {
        if (!/[A-Za-z]/.test(context.reader.peek())) break;

        value += context.reader.read();
      }

    return context.createToken(
      isRegex ? "regexLiteral" : "rawString",
      value,
      line,
      column
    );
  },

  // doc comments
  // http://www.ruby-doc.org/docs/ruby-doc-bundle/Manual/man-1.4/syntax.html#embed_doc
  function(context: ParserContext): ?Token {
    const line = context.reader.getLine();
    const column = context.reader.getColumn();

    let value = "=begin";

    // these begin on with a line that starts with "=begin" and end with a line that starts with "=end"
    // apparently stuff on the same line as "=end" is also part of the comment
    if (!context.reader.isStartOfLine() || !context.reader.match(value))
      return null;

    context.reader.read(value.length - 1);

    const endOfDoc = "\n=end";
    while (!context.reader.isPeekEOF() && !context.reader.matchPeek(endOfDoc))
      value += context.reader.read();

    value += context.reader.read(endOfDoc.length);

    while (!context.reader.isPeekEOF() && context.reader.peek() !== "\n")
      value += context.reader.read();

    return context.createToken("docComment", value, line, column);
  }
];

export const scopes = {
  string: [
    ['"', '"', util.escapeSequences.concat(['\\"']), false],
    ["'", "'", ["\\'", "\\\\"], false]
  ],
  comment: [["#", "\n", [], true]],
  subshellCommand: [["`", "`", ["\\`"], false]],
  globalVariable: [["$", { length: 1, regex: /[\W]/ }, [], true]],
  instanceVariable: [["@", { length: 1, regex: /[\W]/ }, [], true]]
};

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;

export const namedIdentRules = {
  follows: [
    // class names
    // function names
    [{ token: "keyword", values: ["class", "def"] }, util.whitespace],

    // extended classes
    [
      { token: "keyword", values: ["class"] },
      util.whitespace,
      { token: "ident" },
      util.whitespace,
      { token: "operator", values: ["<", "<<"] },
      util.whitespace
    ]
  ],

  precedes: [
    // static variable access
    [util.whitespace, { token: "operator", values: ["::"] }],

    // new-ing a class
    [
      util.whitespace,
      { token: "operator", values: ["."] },
      util.whitespace,
      { token: "ident", values: ["new"] },
      util.whitespace,
      { token: "punctuation", values: ["("] }
    ]
  ]
};

export const operators = [
  "?",
  "...",
  "..",
  ".",
  "::",
  ":",
  "[]",
  "+=",
  "+",
  "-=",
  "-",
  "**=",
  "*=",
  "**",
  "*",
  "/=",
  "/",
  "%=",
  "%",
  "&&=",
  "&=",
  "&&",
  "&",
  "||=",
  "|=",
  "||",
  "|",
  "^=",
  "^",
  "~",
  "\\", // line continuation
  "<=>",
  "<<=",
  "<<",
  "<=",
  "<",
  ">>=",
  ">>",
  ">=",
  ">",
  "!~",
  "!=",
  "!",
  "=>",
  "===",
  "==",
  "=~",
  "="
];

export const contextItems = {
  heredocQueue: []
};
