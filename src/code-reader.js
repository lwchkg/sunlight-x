// @flow
import * as util from "./util.js";

export class CodeReader {
  index: number;
  line: number;
  column: number;
  EOF: string;
  nextReadBeginsLine: boolean;
  text: string;
  length: number;
  currentChar: string;

  constructor(text: string) {
    this.index = 0;
    this.line = 1;
    this.column = 1;
    this.EOF = ""; // TODO: remove
    this.nextReadBeginsLine = false;

    // Normalize line endings to unix
    this.text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    this.length = text.length;
    this.currentChar = text.charAt(0);
  }

  toString(): string {
    return `length: ${this.length}, index: ${this.index}, line: ${this
      .line}, column: ${this.column}, current: [${this.currentChar}]`;
  }

  current(): string {
    return this.currentChar;
  }

  currentAndPeek(count: number = 1): string {
    return this.text.substr(this.index, count);
  }

  peek(count: number = 1): string {
    return this.text.substr(this.index + 1, count);
  }

  substring(): string {
    return this.text.substring(this.index);
  }

  peekSubstring(): string {
    return this.text.substring(this.index + 1);
  }

  read(count: number = 1): string {
    if (count === 0) return "";

    const value = this.peek(count);

    if (value !== this.EOF) {
      // advance index
      this.index += value.length;
      this.column += value.length;

      // update line count. TODO: algorithm incorrect.
      if (this.nextReadBeginsLine) {
        this.line++;
        this.column = 1;
        this.nextReadBeginsLine = false;
      }

      const newlineCount = value
        .substring(0, value.length - 1)
        .replace(/[^\n]/g, "").length;
      if (newlineCount > 0) {
        this.line += newlineCount;
        this.column = 1;
      }

      const lastChar = util.lastChar(value);
      if (lastChar === "\n") this.nextReadBeginsLine = true;

      this.currentChar = lastChar;
    } else {
      this.index = this.length;
      this.currentChar = this.EOF;
    }

    return value;
  }

  text(): string {
    return this.text;
  }

  getLine(): number {
    return this.line;
  }

  getColumn(): number {
    return this.column;
  }

  isEOF(): boolean {
    return this.index >= this.length;
  }

  isPeekEOF(): boolean {
    return this.index + 1 >= this.length;
  }

  isSol(): boolean {
    return this.column === 1;
  }

  isSolWs(): boolean {
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

  isEol(): boolean {
    return this.nextReadBeginsLine;
  }

  EOF(): string {
    return this.EOF;
  }

  match(str: string): boolean {
    return this.text.substr(this.index, str.length) === str;
  }
}
