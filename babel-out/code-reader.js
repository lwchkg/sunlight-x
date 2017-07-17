'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeReader = exports.createCodeReader = undefined;

var _util = require('./util.js');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/

// -----------
// FUNCTIONS
// -----------

function createCodeReader(_text) {
  var index = 0;
  var line = 1;
  var column = 1;
  var EOF = undefined;
  var currentChar = void 0;
  var nextReadBeginsLine = void 0;

  _text = _text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); // normalize line endings to unix

  var length = _text.length;
  currentChar = length > 0 ? _text.charAt(0) : EOF;

  function getCharacters(count) {
    if (count === 0) return '';

    count = count || 1;

    var value = _text.substring(index + 1, index + count + 1);
    return value === '' ? EOF : value;
  }

  return {
    toString: function toString() {
      return `length: ${length}, index: ${index}, line: ${line}, column: ${column}, current: [${currentChar}]`;
    },

    peek: function peek(count) {
      return getCharacters(count);
    },

    substring: function substring() {
      return _text.substring(index);
    },

    peekSubstring: function peekSubstring() {
      return _text.substring(index + 1);
    },

    read: function read(count) {
      var value = getCharacters(count);
      var newlineCount = void 0,
          lastChar = void 0;

      if (value === '') {
        // this is a result of reading/peeking/doing nothing
        return value;
      }

      if (value !== EOF) {
        // advance index
        index += value.length;
        column += value.length;

        // update line count
        if (nextReadBeginsLine) {
          line++;
          column = 1;
          nextReadBeginsLine = false;
        }

        newlineCount = value.substring(0, value.length - 1).replace(/[^\n]/g, '').length;
        if (newlineCount > 0) {
          line += newlineCount;
          column = 1;
        }

        lastChar = util.last(value);
        if (lastChar === '\n') nextReadBeginsLine = true;

        currentChar = lastChar;
      } else {
        index = length;
        currentChar = EOF;
      }

      return value;
    },

    text: function text() {
      return _text;
    },

    getLine: function getLine() {
      return line;
    },
    getColumn: function getColumn() {
      return column;
    },
    isEof: function isEof() {
      return index >= length;
    },
    isSol: function isSol() {
      return column === 1;
    },
    isSolWs: function isSolWs() {
      var temp = index;
      if (column === 1) return true;

      // look backward until we find a newline or a non-whitespace character
      var c = void 0;
      while ((c = _text.charAt(--temp)) !== '') {
        if (c === '\n') return true;

        if (!/\s/.test(c)) return false;
      }

      return true;
    },
    isEol: function isEol() {
      return nextReadBeginsLine;
    },
    EOF: EOF,
    current: function current() {
      return currentChar;
    }
  };
}

exports.createCodeReader = createCodeReader;
class CodeReader {
  constructor(text) {
    this.index = 0;
    this.line = 1;
    this.column = 1;
    this.EOF = undefined;
    this.nextReadBeginsLine = undefined;

    this.text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); // normalize line endings to unix

    this.length = text.length;
    this.currentChar = this.length > 0 ? text.charAt(0) : this.EOF;
  }

  getCharacters(count) {
    if (count === 0) return '';

    count = count || 1;

    var value = this.text.substring(this.index + 1, this.index + count + 1);
    return value === '' ? this.EOF : value;
  }

  toString() {
    return `length: ${this.length}, index: ${this.index}, line: ${this.line}, column: ${this.column}, current: [${this.currentChar}]`;
  }

  peek(count) {
    return this.getCharacters(count);
  }

  substring() {
    return this.text.substring(this.index);
  }

  peekSubstring() {
    return this.text.substring(this.index + 1);
  }

  read(count) {
    var value = this.getCharacters(count);
    var newlineCount = void 0,
        lastChar = void 0;

    if (value === '') {
      // this is a result of reading/peeking/doing nothing
      return value;
    }

    if (value !== this.EOF) {
      // advance index
      this.index += value.length;
      this.column += value.length;

      // update line count
      if (this.nextReadBeginsLine) {
        this.line++;
        this.column = 1;
        this.nextReadBeginsLine = false;
      }

      newlineCount = value.substring(0, value.length - 1).replace(/[^\n]/g, '').length;
      if (newlineCount > 0) {
        this.line += newlineCount;
        this.column = 1;
      }

      lastChar = util.last(value);
      if (lastChar === '\n') this.nextReadBeginsLine = true;

      this.currentChar = lastChar;
    } else {
      this.index = this.length;
      this.currentChar = this.EOF;
    }

    return value;
  }

  text() {
    return this.text;
  }
  getLine() {
    return this.line;
  }
  getColumn() {
    return this.column;
  }
  isEof() {
    return this.index >= this.length;
  }
  isSol() {
    return this.column === 1;
  }
  isSolWs() {
    var temp = this.index,
        c = void 0;
    if (this.column === 1) return true;

    // look backward until we find a newline or a non-whitespace character
    while ((c = this.text.charAt(--temp)) !== '') {
      if (c === '\n') return true;

      if (!/\s/.test(c)) return false;
    }

    return true;
  }
  isEol() {
    return this.nextReadBeginsLine;
  }

  EOF() {
    return this.EOF;
  }

  current() {
    return this.currentChar;
  }
}
exports.CodeReader = CodeReader;