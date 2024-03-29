// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import * as util from "../util";
import type { ScopeType } from "../languages";
export const name = "python";
export const keywords = [// http://docs.python.org/py3k/reference/lexical_analysis.html#keywords
"False", "class", "finally", "is", "return", "None", "continue", "for", "lambda", "try", "True", "def", "from", "nonlocal", "while", "and", "del", "global", "not", "with", "as", "elif", "if", "or", "yield", "assert", "else", "import", "pass", "break", "except", "in", "raise"];
export const customTokens = {
  ellipsis: {
    values: ["..."],
    boundary: ""
  },
  // http://docs.python.org/py3k/reference/lexical_analysis.html#delimiters
  delimiter: {
    values: ["(", ")", "[", "]", "{", "}", ",", ":", ".", ";", "@", "=", "+=", "-=", "*=", "/=", "//=", "%=", "&=", "|=", "^=", ">>=", "<<=", "**="],
    boundary: ""
  },
  // http://docs.python.org/py3k/library/constants.html
  constant: {
    values: ["NotImplemented", "Ellipsis", "False", "True", "None", "__debug__"],
    boundary: "\\b"
  },
  attribute: {
    values: ["__doc__", "__name__", "__module__", "__defaults__", "__code__", "__globals__", "__dict__", "__closure__", "__annotations__", "__kwedefaults__", "__self__", "__func__", "__bases__"],
    boundary: "\\b"
  },
  // http://docs.python.org/py3k/reference/datamodel.html#specialnames
  specialMethod: {
    values: ["__next__", "__new__", "__init__", "__del__", "__repr__", "__str__", "__format__", "__lt__", "__le__", "__eq__", "__ne__", "__gt__", "__ge__", "__hash__", "__bool__", "__call__", "__prepare__", "__getattr__", "__getattribute__", "__setattr__", "__setattribute__", "__delattr__", "__dir__", "__get__", "__set__", "__delete__", "__slots__", "__instancecheck__", "__subclasscheck__", "__getitem__", "__setitem__", "__delitem__", "__iter__", "__reversed__", "__contains__", "__add__", "__sub__", "__mul__", "__truediv__", "__floordiv__", "__mod__", "__divmod__", "__pow__", "__lshift__", "__rshift__", "__and__", "__xor__", "__or__", "__radd__", "__rsub__", "__rmul__", "__rtruediv__", "__rfloordiv__", "__rmod__", "__rdivmod__", "__rpow__", "__rlshift__", "__rrshift__", "__rand__", "__xror__", "__ror__", "__iadd__", "__isub__", "__imul__", "__itruediv__", "__ifloordiv__", "__imod__", "__idivmod__", "__ipow__", "__ilshift__", "__irshift__", "__iand__", "__xror__", "__ior__", "__neg__", "__pos__", "__abs__", "__invert__", "__complex__", "__int__", "__float__", "__round__", "__index__", "__enter__", "__exit__"],
    boundary: "\\b"
  },
  // http://docs.python.org/py3k/library/functions.html
  function: {
    values: ["abs", "dict", "help", "min", "setattr", "all", "dir", "hex", "next", "slice", "any", "divmod", "id", "object", "sorted", "ascii", "enumerate", "input", "oct", "staticmethod", "bin", "eval", "int", "open", "str", "bool", "exec", "isinstance", "ord", "sum", "bytearray", "filter", "issubclass", "pow", "super", "bytes", "float", "iter", "print", "tuple", "callable", "format", "len", "property", "type", "chr", "frozenset", "list", "range", "vars", "classmethod", "getattr", "locals", "repr", "zip", "compile", "globals", "map", "reversed", "__import__", "complex", "hasattr", "max", "round", "delattr", "hash", "memoryview", "set"],
    boundary: "\\b"
  }
};
export const scopes: Record<string, ScopeType[]> = {
  longString: [['"""', '"""', util.escapeSequences.concat(['\\"']), false], ["'''", "'''", util.escapeSequences.concat(["\\'"]), false]],
  rawLongString: [['r"""', '"""', [], false], ['R"""', '"""', [], false], ["r'''", "'''", [], false], ["R'''", "'''", [], false]],
  binaryLongString: [// raw binary
  ['br"""', '"""', [], false], ['bR"""', '"""', [], false], ['Br"""', '"""', [], false], ['BR"""', '"""', [], false], ["br'''", "'''", [], false], ["bR'''", "'''", [], false], ["Br'''", "'''", [], false], ["BR'''", "'''", [], false], // just binary
  ['b"""', '"""', util.escapeSequences.concat(['\\"']), false], ['B"""', '"""', util.escapeSequences.concat(['\\"']), false], ["b'''", "'''", util.escapeSequences.concat(["\\'"]), false], ["B'''", "'''", util.escapeSequences.concat(["\\'"]), false]],
  string: [['"', '"', util.escapeSequences.concat(['\\"']), false], ["'", "'", util.escapeSequences.concat(["\\'", "\\\\"]), false]],
  rawString: [['r"', '"', [], false], ['R"', '"', [], false], ["r'", "'", [], false], ["R'", "'", [], false]],
  binaryString: [// just binary
  ['b"', '"', util.escapeSequences.concat(['\\"']), false], ["b'", "'", util.escapeSequences.concat(["\\'"]), false], ['B"', '"', util.escapeSequences.concat(['\\"']), false], ["B'", "'", util.escapeSequences.concat(["\\'"]), false], // raw binary
  ['br"', '"', [], false], ['bR"', '"', [], false], ['Br"', '"', [], false], ['BR"', '"', [], false], ["br'", "'", [], false], ["bR'", "'", [], false], ["Br'", "'", [], false], ["BR'", "'", [], false]],
  comment: [["#", "\n", [], true]]
};
export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;
export const namedIdentRules = {
  follows: [// class names
  // function names
  // exception names
  [{
    token: "keyword",
    values: ["class", "def", "raise", "except"]
  }, util.whitespace]]
};
export const operators = [// http://docs.python.org/py3k/reference/lexical_analysis.html#operators
"+", "-", "**", "*", "//", "/", "%", "&", "|", "^", "~", "<<", "<=", "<", ">>", ">=", ">", "==", "!="];