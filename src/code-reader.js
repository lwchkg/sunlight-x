import * as util from './util.js';

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/

// -----------
// FUNCTIONS
// -----------

export function createCodeReader(text) {
  let index = 0;
  let line = 1;
  let column = 1;
  const EOF = undefined;
  let currentChar;
  let nextReadBeginsLine;

  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); // normalize line endings to unix

  const length = text.length;
  currentChar = length > 0 ? text.charAt(0) : EOF;

  function getCharacters(count) {
    if (count === 0) return '';

    count = count || 1;

    const value = text.substring(index + 1, index + count + 1);
    return value === '' ? EOF : value;
  }

  return {
    toString: function() {
      return `length: ${length}, index: ${index}, line: ${line}, column: ${column}, current: [${currentChar}]`;
    },

    peek: function(count) {
      return getCharacters(count);
    },

    substring: function() {
      return text.substring(index);
    },

    peekSubstring: function() {
      return text.substring(index + 1);
    },

    read: function(count) {
      const value = getCharacters(count);
      let newlineCount, lastChar;

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

        newlineCount = value
          .substring(0, value.length - 1)
          .replace(/[^\n]/g, '').length;
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

    text: function() {
      return text;
    },

    getLine: function() {
      return line;
    },
    getColumn: function() {
      return column;
    },
    isEof: function() {
      return index >= length;
    },
    isSol: function() {
      return column === 1;
    },
    isSolWs: function() {
      let temp = index;
      if (column === 1) return true;

      // look backward until we find a newline or a non-whitespace character
      let c;
      while ((c = text.charAt(--temp)) !== '') {
        if (c === '\n') return true;

        if (!/\s/.test(c)) return false;
      }

      return true;
    },
    isEol: function() {
      return nextReadBeginsLine;
    },
    EOF: EOF,
    current: function() {
      return currentChar;
    },
  };
}

export class CodeReader {
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

    const value = this.text.substring(this.index + 1, this.index + count + 1);
    return value === '' ? this.EOF : value;
  }

  toString() {
    return `length: ${this.length}, index: ${this.index}, line: ${this
      .line}, column: ${this.column}, current: [${this.currentChar}]`;
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
    const value = this.getCharacters(count);
    let newlineCount, lastChar;

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

      newlineCount = value.substring(0, value.length - 1).replace(/[^\n]/g, '')
        .length;
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
    let temp = this.index,
      c;
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
