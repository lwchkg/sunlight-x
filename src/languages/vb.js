// @flow
import * as util from "../util.js";

import type { AnalyzerContext, ParserContext, Token } from "../util.js";

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
  // xml doc comments (copypasted from c# file)
  function(context: ParserContext): ?(Token[]) {
    let metaName = "xmlDocCommentMeta",
      contentName = "xmlDocCommentContent",
      tokens,
      peek,
      current;

    if (context.reader.current() !== "'" || context.reader.peek(2) !== "''")
      return null;

    tokens = [
      context.createToken(
        metaName,
        "'''",
        context.reader.getLine(),
        context.reader.getColumn()
      )
    ];
    current = { line: 0, column: 0, value: "", name: null };
    context.reader.read(2);

    while ((peek = context.reader.peek()) !== context.reader.EOF) {
      if (peek === "<" && current.name !== metaName) {
        // push the current token
        if (current.value !== "")
          tokens.push(
            context.createToken(
              current.name,
              current.value,
              current.line,
              current.column
            )
          );

        // amd create a token for the tag
        current.line = context.reader.getLine();
        current.column = context.reader.getColumn();
        current.name = metaName;
        current.value = context.reader.read();
        continue;
      }

      if (peek === ">" && current.name === metaName) {
        // close the tag
        current.value += context.reader.read();
        tokens.push(
          context.createToken(
            current.name,
            current.value,
            current.line,
            current.column
          )
        );
        current.name = null;
        current.value = "";
        continue;
      }

      if (peek === "\n") break;

      if (current.name === null) {
        current.name = contentName;
        current.line = context.reader.getLine();
        current.column = context.reader.getColumn();
      }

      current.value += context.reader.read();
    }

    if (current.name === contentName)
      tokens.push(
        context.createToken(
          current.name,
          current.value,
          current.line,
          current.column
        )
      );

    return tokens.length > 0 ? tokens : null;
  },

  // keyword escaping: e.g. "[In]"
  function(context: ParserContext): ?Token {
    let line = context.reader.getLine(),
      column = context.reader.getColumn(),
      next,
      value = "[";

    if (context.reader.current() !== "[") return null;

    // read until "]"
    next = context.reader.read();
    while (next !== context.reader.EOF) {
      value += next;

      if (next === "]") break;

      next = context.reader.read();
    }

    return context.createToken("escapedKeyword", value, line, column);
  },

  // handles New/GetType contextual keywords
  // e.g. prevents "New" in "SomeClass.New()" from being a keyword
  (function(): * {
    const hashmap = util.createHashMap(["New", "GetType"], "\\b");
    return function(context: ParserContext): ?Token {
      let token = util.matchWord(context, hashmap, "keyword"),
        prevToken;

      if (!token) return null;

      // if the previous non-ws token is the "." operator then it's an ident, not a keyword
      // or if it's a subprocedure name
      prevToken = util.getPreviousNonWsToken(
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

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;

export const namedIdentRules = {
  custom: [
    // attributes (copypasted (mostly) from c# file)
    function(context: AnalyzerContext): boolean {
      // if the next token is an equals sign, this is a named parameter (or something else not inside of an attribute)
      let token,
        nextToken = util.getNextNonWsToken(context.tokens, context.index),
        index = context.index,
        bracketCount = [0, 0],
        indexOfLastBracket = -1;

      if (
        nextToken &&
        nextToken.name === "operator" &&
        (nextToken.value === "=" || nextToken.value === ".")
      )
        return false;

      // we need to verify that we're between <>

      // first, verify that we're inside an opening bracket
      while ((token = context.tokens[--index]) !== undefined)
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
          // early exits
          break;
        }

      if (bracketCount[0] === 0 || bracketCount[0] === bracketCount[1])
        // if no brackets were found OR...
        // all the found brackets are closed, so this ident is actually outside of the brackets
        // duh.
        return false;

      // next, verify we're inside a closing bracket
      index = context.index;
      while ((token = context.tokens[++index]) !== undefined)
        if (token.name === "operator") {
          if (token.value === "<") {
            bracketCount[0]++;
          } else if (token.value === ">") {
            indexOfLastBracket = index;
            bracketCount[1]++;
          }
        } else if (
          token.name === "keyword" &&
          util.contains(
            ["Public", "Class", "Protected", "Private", "Friend", "ByVal"],
            token.value
          )
        ) {
          // early exits
          break;
        }

      if (indexOfLastBracket < 0 || bracketCount[0] !== bracketCount[1])
        return false;

      // next token after the last closing bracket should be either a keyword or an ident
      token = util.getNextNonWsToken(context.tokens, indexOfLastBracket);
      if (token && (token.name === "keyword" || token.name === "ident"))
        return true;

      return false;
    },

    // casts
    function(context: AnalyzerContext): boolean {
      let token,
        index = context.index,
        parenCount = 1;
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

      while ((token = context.tokens[--index]))
        if (token.name === "punctuation" && token.value === "(") {
          parenCount--;
          if (parenCount === 0) {
            // we found the opening paren, so if the previous token is one of the cast functions, this is a cast
            token = context.tokens[--index];
            if (
              token &&
              token.name === "keyword" &&
              util.contains(["CType", "DirectCast", "TryCast"], token.value)
            )
              return true;

            return false;
          }
        } else if (token.name === "punctuation" && token.value === ")") {
          parenCount++;
        }

      return false;
    },

    // implemented interfaces
    function(context: AnalyzerContext): boolean {
      let prevToken = util.getPreviousNonWsToken(context.tokens, context.index),
        token,
        index = context.index;

      // if previous non-ws token was a "." then it's an implemented method
      if (prevToken && prevToken.name === "operator" && prevToken.value === ".")
        return false;

      // look backward for "Implements"
      while ((token = context.tokens[--index]))
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

      return false;
    },

    // type constraints: "As {ident, ident, ...}"
    function(context: AnalyzerContext): boolean {
      // look backward for "As {"
      let token,
        index = context.index,
        isValid = (function(): boolean {
          while ((token = context.tokens[--index]))
            if (token.name === "punctuation")
              switch (token.value) {
                case "(":
                case ")":
                  return false;
                case "{":
                  // previous non-ws token should be keyword "As"
                  token = util.getPreviousNonWsToken(context.tokens, index);
                  if (
                    !token ||
                    token.name !== "keyword" ||
                    token.value !== "As"
                  )
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
      index = context.index;
      while ((token = context.tokens[++index]))
        if (token.name === "punctuation")
          switch (token.value) {
            case "}":
              return true;
            case "(":
            case ")":
            case ";":
              return false;
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

const int = "[0-9](?:[0-9_]*[0-9])?";
const hex = "&H[0-9A-F](?:[0-9A-F_]*[0-9A-F])?";
const oct = "&O[0-7](?:[0-7_]*[0-7])?";
const bin = "&B[01](?:[01_]*[01])?";

const intTypeChars = "(?:U?[SIL]|[%&])?";

const integerLiteral = `(?:${int}|${hex}|${oct}|${bin})${intTypeChars}`;

const exponent = "E[+-]" + int;
const fpValue = `(?:${int})?\\.${int}(?:${exponent})?|${int}${exponent}`;
const fpTypeChars = "[DFR@!#]";

const fpLiteral = fpValue + fpTypeChars;

const numberLiteral = `${integerLiteral}|${fpLiteral}`;

export const numberParser = util.getRegexpParser(
  "number",
  new RegExp(numberLiteral, "i")
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
