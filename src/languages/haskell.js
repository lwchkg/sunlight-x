// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

import type { AnalyzerContext, ParserContext, Token } from "../util.js";

export const name = "haskell";

// http://www.haskell.org/haskellwiki/Keywords
export const keywords = [
  "as",
  "case",
  "of",
  "class",
  "datafamily",
  "datainstance",
  "data",
  "default",
  "derivinginstance",
  "deriving",
  "do",
  "forall",
  "foreign",
  "hiding",
  "if",
  "then",
  "else",
  "import",
  "infix",
  "infixl",
  "infixr",
  "instance",
  "let",
  "in",
  "mdo",
  "module",
  "newtype",
  "proc",
  "qualified",
  "rec",
  "typefamily",
  "typeinstance",
  "type",
  "where"
];

export const customParseRules = [
  // character literals, e.g. 'a'
  function(context: ParserContext): ?Token {
    const peek = context.reader.peek();
    if (context.reader.current() !== "'" && peek !== "'") return null;

    // to differentiate from template haskell, we'll just assume that character literals
    // are exactly one character long (or two for \' and \\) and delimited by '

    let expectedEnd = 2;
    if (peek && peek === "\\") expectedEnd++;

    if (!/'$/.test(context.reader.peek(expectedEnd)))
      // doesn't end with an apostrophe, so it's a template operator
      return null;

    return context.createToken("char", "'" + context.reader.read(expectedEnd));
  },

  // look for user defined functions
  function(context: ParserContext): ?Token {
    // read the ident, if a :: operator follows it, then it's a function definition (i guess, like i know anything about haskell)
    // or if follows newtype, class or data, we keep track of it as well
    if (!/[A-Za-z_]/.test(context.reader.current())) return null;

    let peek;
    let count = 0;
    while ((peek = context.reader.peek(++count)) && peek.length === count)
      if (!/[\w']$/.test(peek)) break;

    const ident = context.reader.current() + peek.substring(0, peek.length - 1);

    // if it follows class, newtype, type or data
    const prevToken = context.token(context.count() - 1);
    if (
      prevToken &&
      prevToken.name === "keyword" &&
      util.contains(["class", "newtype", "data", "type"], prevToken.value)
    ) {
      context.userDefinedNameStore.addName(ident, name);

      context.reader.read(ident.length - 1); // already read the first character
      return context.createToken("ident", ident);
    }

    // function definitions: start of line followed by ::
    if (context.reader.isPrecededByWhitespaceOnly())
      // should be some whitespace, and then ::
      while ((peek = context.reader.peek(++count)) && peek.length === count)
        if (!/\s$/.test(peek)) {
          if (!/::$/.test(context.reader.peek(++count))) return null;

          // yay it's a function!
          context.userDefinedNameStore.addName(ident, name);

          context.reader.read(ident.length - 1); // already read the first character
          return context.createToken("ident", ident);
        }

    return null;
  }
];

export const customTokens = {
  function: {
    values: [
      "abs",
      "acosh",
      "acos",
      "all",
      "and",
      "any",
      "appendFile",
      "asinh",
      "asin",
      "asTypeOf",
      "atan2",
      "atanh",
      "atan",
      "break",
      "catch",
      "ceiling",
      "compare",
      "concatMap",
      "concat",
      "const",
      "cosh",
      "cos",
      "curry",
      "cycle",
      "decodeFloat",
      "divMod",
      "div",
      "dropWhile",
      "drop",
      "either",
      "elem",
      "encodeFloat",
      "enumFromThenTo",
      "enumFromThen",
      "enumFromTo",
      "enumFrom",
      "error",
      "even",
      "exponent",
      "exp",
      "fail",
      "filter",
      "flip",
      "floatDigits",
      "floatRadix",
      "floatRange",
      "floor",
      "fmap",
      "foldl1",
      "foldl",
      "foldr1",
      "foldr",
      "fromEnum",
      "fromInteger",
      "fromIntegral",
      "fromRational",
      "fst",
      "gcd",
      "getChar",
      "getContents",
      "getLine",
      "head",
      "id",
      "init",
      "interact",
      "ioError",
      "isDenormalized",
      "isIEEE",
      "isInfinite",
      "isNaN",
      "isNegativeZero",
      "iterate",
      "last",
      "lcm",
      "length",
      "lex",
      "lines",
      "logBase",
      "log",
      "lookup",
      "mapM_",
      "mapM",
      "map",
      "maxBound",
      "maximum",
      "max",
      "maybe",
      "minBound",
      "minimum",
      "min",
      "mod",
      "negate",
      "notElem",
      "not",
      "null",
      "odd",
      "or",
      "otherwise",
      "pi",
      "pred",
      "print",
      "product",
      "properFraction",
      "putChar",
      "putStrLn",
      "putStr",
      "quotRem",
      "quot",
      "readFile",
      "readIO",
      "readList",
      "readLn",
      "readParen",
      "readsPrec",
      "reads",
      "realToFrac",
      "read",
      "recip",
      "rem",
      "repeat",
      "replicate",
      "return",
      "reverse",
      "round",
      "scaleFloat",
      "scanl1",
      "scanl",
      "scanr1",
      "scanr",
      "sequence_",
      "sequence",
      "seq",
      "showChar",
      "showList",
      "showParen",
      "showsPrec",
      "showString",
      "shows",
      "show",
      "significand",
      "signum",
      "sinh",
      "sin",
      "snd",
      "splitAt",
      "sqrt",
      "subtract",
      "succ",
      "sum",
      "tail",
      "takeWhile",
      "take",
      "tanh",
      "tan",
      "toEnum",
      "toInteger",
      "toRational",
      "truncate",
      "uncurry",
      "undefined",
      "unlines",
      "until",
      "unwords",
      "unzip3",
      "unzip",
      "userError",
      "words",
      "writeFile",
      "zip3",
      "zipWith3",
      "zipWith",
      "zip"
    ],
    boundary: "\\b"
  },

  class: {
    values: [
      "Bounded",
      "Enum",
      "Eq",
      "Floating",
      "Fractional",
      "Functor",
      "Integral",
      "Monad",
      "Num",
      "Ord",
      "Read",
      "RealFloat",
      "RealFrac",
      "Real",
      "Show"
    ],
    boundary: "\\b"
  },

  type: {
    values: [
      "Bool",
      "Char",
      "Double",
      "Either",
      "FilePath",
      "Float",
      "Integer",
      "Int",
      "IOError",
      "IO",
      "Maybe",
      "Ordering",
      "ReadS",
      "ShowS",
      "String",

      "False",
      "True",
      "LT",
      "GT",
      "EQ",
      "Nothing",
      "Just",
      "Left",
      "Right"
    ],
    boundary: "\\b"
  }
};

export const scopes = {
  string: [['"', '"', util.escapeSequences.concat(['\\"']), false]],
  comment: [["--", "\n", [], true], ["{-", "-}", [], false]],
  infixOperator: [["`", "`", ["\\`"], false]]
};

export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /[\w']/;

export const namedIdentRules = {
  custom: [
    function(context: AnalyzerContext): boolean {
      return context.userDefinedNameStore.hasName(
        context.tokens[context.index].value,
        name
      );
    }
  ]
};

export const operators = [
  "::",
  ":",

  "=>",
  "==",
  "=",
  "@",
  "[|",
  "|]",
  "\\\\",
  "\\",
  "/=",
  "/",
  "++",
  "+",
  "-<<",
  "-<",
  "->",
  "-",
  "&&",

  "!!",
  "!",
  "''",
  "'",
  "??",
  "?",
  "#",
  "<-",
  "<=",
  "<",
  ">@>",
  ">>=",
  ">>",
  ">=",
  ">",
  "^^",
  "^",
  "**",
  "*",
  "||",
  "|",
  "~",
  "_",
  "..",
  "."
];
