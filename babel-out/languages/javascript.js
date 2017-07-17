'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.operators = exports.namedIdentRules = exports.identAfterFirstLetter = exports.identFirstLetter = exports.customParseRules = exports.scopes = exports.customTokens = exports.keywords = exports.name = undefined;

var _util = require('../util.js');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var name = exports.name = 'javascript';

var keywords = exports.keywords = [
// keywords
'break', 'case', 'catch', 'continue', 'default', 'delete', 'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 'new', 'return', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with',

// literals
'true', 'false', 'null'];

var customTokens = exports.customTokens = {
  reservedWord: {
    values: ['abstract', 'boolean', 'byte', 'char', 'class', 'const', 'debugger', 'double', 'enum', 'export const', 'extends', 'final', 'float', 'goto', 'implements', 'import', 'int', 'interface', 'long', 'native', 'package', 'private', 'protected', 'public', 'short', 'static', 'super', 'synchronized', 'throws', 'transient', 'volatile'],
    boundary: '\\b'
  },

  globalVariable: {
    values: ['NaN', 'Infinity', 'undefined'],
    boundary: '\\b'
  },

  globalFunction: {
    values: ['encodeURI', 'encodeURIComponent', 'decodeURI', 'decodeURIComponent', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'eval'],
    boundary: '\\b'
  },

  globalObject: {
    values: ['Math', 'JSON', 'XMLHttpRequest', 'XDomainRequest', 'ActiveXObject', 'Boolean', 'Date', 'Array', 'Image', 'Function', 'Object', 'Number', 'RegExp', 'String'],
    boundary: '\\b'
  }
};

var scopes = exports.scopes = {
  string: [['"', '"', util.escapeSequences.concat(['\\"'])], ['\'', '\'', util.escapeSequences.concat(['\\\'', '\\\\'])]],
  comment: [['//', '\n', null, true], ['/*', '*/']]
};

var customParseRules = exports.customParseRules = [
// regex literal
function (context) {
  var peek = context.reader.peek();
  var line = context.reader.getLine();
  var column = context.reader.getColumn();
  var regexLiteral = '/',
      charClass = false,
      peek2 = void 0,
      next = void 0;

  if (context.reader.current() !== '/' || peek === '/' || peek === '*') {
    // doesn't start with a / or starts with // (comment) or /* (multi line comment)
    return null;
  }

  var isValid = function () {
    var previousNonWsToken = context.token(context.count() - 1);
    var previousToken = null;
    if (context.defaultData.text !== '') {
      previousToken = context.createToken('default', context.defaultData.text);
    }

    if (!previousToken) previousToken = previousNonWsToken;

    // first token of the string
    if (previousToken === undefined) return true;

    // since JavaScript doesn't require statement terminators, if the previous token was whitespace and contained a newline, then we're good
    if (previousToken.name === 'default' && previousToken.value.indexOf('\n') >= 0) return true;

    if (util.contains(['keyword', 'ident', 'number'], previousNonWsToken.name)) return false;

    if (previousNonWsToken.name === 'punctuation' && !util.contains(['(', '{', '[', ',', ';'], previousNonWsToken.value)) return false;

    return true;
  }();

  if (!isValid) return null;

  // read the regex literal
  while (context.reader.peek() !== context.reader.EOF) {
    peek2 = context.reader.peek(2);
    if (peek2 === '\\/' || peek2 === '\\\\') {
      // escaped backslash or escaped forward slash
      regexLiteral += context.reader.read(2);
      continue;
    }
    if (peek2 === '\\[' || peek2 === '\\]') {
      regexLiteral += context.reader.read(2);
      continue;
    } else if (next === '[') {
      charClass = true;
    } else if (next === ']') {
      charClass = false;
    }

    regexLiteral += next = context.reader.read();
    if (next === '/' && !charClass) break;
  }

  // read the regex modifiers
  // only "g", "i" and "m" are allowed, but for the sake of simplicity we'll just say any alphabetical character is valid
  while (context.reader.peek() !== context.reader.EOF) {
    if (!/[A-Za-z]/.test(context.reader.peek())) break;

    regexLiteral += context.reader.read();
  }

  return context.createToken('regexLiteral', regexLiteral, line, column);
}];

var identFirstLetter = exports.identFirstLetter = /[$A-Za-z_]/;
var identAfterFirstLetter = exports.identAfterFirstLetter = /[\w$]/;

var namedIdentRules = exports.namedIdentRules = { follows: [[{ token: 'keyword', values: ['function'] }, util.whitespace]] };

var operators = exports.operators = [
// arithmetic
'++', '+=', '+', '--', '-=', '-', '*=', '*', '/=', '/', '%=', '%',

// boolean
'&&', '||',

// bitwise
'|=', '|', '&=', '&', '^=', '^', '>>>=', '>>>', '>>=', '>>', '<<=', '<<',

// inequality
'<=', '<', '>=', '>', '===', '==', '!==', '!=',

// unary
'!', '~',

// other
'?', ':', '.', '='];