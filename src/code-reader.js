import * as util from "./util.js";

export class CodeReader {
  constructor(text) {
    this.index = 0;
    this.line = 1;
    this.column = 1;
    this.EOF = undefined;
    this.nextReadBeginsLine = undefined;

    // Normalize line endings to unix
    this.text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    this.length = text.length;
    this.currentChar = this.length > 0 ? text.charAt(0) : this.EOF;
  }

  getCharacters(count) {
    if (count === 0) return "";

    count = count || 1;

    const value = this.text.substring(this.index + 1, this.index + count + 1);
    return value === "" ? this.EOF : value;
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

    if (value === "")
      // this is a result of reading/peeking/doing nothing
      return value;

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

      newlineCount = value.substring(0, value.length - 1).replace(/[^\n]/g, "")
        .length;
      if (newlineCount > 0) {
        this.line += newlineCount;
        this.column = 1;
      }

      lastChar = util.last(value);
      if (lastChar === "\n") this.nextReadBeginsLine = true;

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
    let temp = this.index;
    if (this.column === 1) return true;

    // look backward until we find a newline or a non-whitespace character
    let c;
    while ((c = this.text.charAt(--temp)) !== "") {
      if (c === "\n") return true;
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
