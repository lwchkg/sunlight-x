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

  // Mechanism for the new API. TODO: remove after migration.
  readAlready: boolean;

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

    this.readAlready = false;
  }

  toString(): string {
    return `length: ${this.length}, index: ${this.index}, line: ${
      this.line
    }, column: ${this.column}, current: [${this.currentChar}]`;
  }

  // Deprecated. Do not use in new code.
  current(): string {
    return this.currentChar;
  }

  // Deprecated. Do not use in new code.
  currentAndPeek(count: number = 1): string {
    return this.text.substr(this.index, count);
  }

  // Deprecated. TODO: determine to rename or delete.
  peek(count: number = 1): string {
    return this.text.substr(this.index + 1, count);
  }

  // TODO: rename to "peek" after migration.
  newPeek(count: number = 1): string {
    return this.readAlready
      ? this.text.substr(this.index + 1, count)
      : this.text.substr(this.index, count);
  }

  peekWithOffset(relativeIndex: number, count: number = 1): string {
    return this.readAlready
      ? this.text.substr(this.index + relativeIndex + 1, count)
      : this.text.substr(this.index + relativeIndex, count);
  }

  // TODO: rename. New name TBD.
  substring(): string {
    return this.text.substring(this.index);
  }

  // Deprecated. Do not use in new code.
  peekSubstring(): string {
    return this.text.substring(this.index + 1);
  }

  // Deprecated. Do not use in new code.
  currentAndPeekTillEOL(): string {
    const startIndex = this.index;
    const endIndex: number = this.text.indexOf("\n", startIndex);
    if (endIndex >= 0) return this.text.substring(startIndex, endIndex);
    return this.text.substring(startIndex);
  }

  // TODO: rename to "peekTillEOL".
  newPeekTillEOL(): string {
    const startIndex = this.readAlready ? this.index + 1 : this.index;
    const endIndex: number = this.text.indexOf("\n", startIndex);
    if (endIndex >= 0) return this.text.substring(startIndex, endIndex);
    return this.text.substring(startIndex);
  }

  // Deprecated. Don't use in new code.
  read(count: number = 1): string {
    this.readAlready = true;
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

  // TODO: rename to "read" after migration.
  newRead(count: number = 1): string {
    return this.readAlready
      ? this.read(count)
      : this.current() + this.read(count - 1);
  }

  // Migration mechanism. TODO: delete after migration is finished.
  resetAlreadyRead() {
    this.read();
    this.readAlready = false; // THis must be put after `this.read()`.
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

  // Deprecated. Don't use.
  isEOF(): boolean {
    return this.index >= this.length;
  }

  // TODO: rename to "isEOF" after migration.
  newIsEOF(): boolean {
    return (this.readAlready ? this.index + 1 : this.index) >= this.length;
  }

  // TODO: decide fate of this function. Will probably delete.
  isPeekEOF(): boolean {
    return this.index + 1 >= this.length;
  }

  // TODO: determine whether this should be refactored. Use only at the start of
  // a series of reads.
  isStartOfLine(): boolean {
    return this.column === 1;
  }

  // Check if the current character is preceded by whitespace or nothing.
  isPrecededByWhitespaceOnly(): boolean {
    const lineBeforeCurrent = this.text.substring(
      this.index - this.column + 1,
      this.index
    );
    return /^\s*$/.test(lineBeforeCurrent);
  }

  // TODO: determine whether this should be refactored. Use only at the start of
  // a series of reads.
  isEol(): boolean {
    return this.nextReadBeginsLine;
  }

  // TODO: delete.
  EOF(): string {
    return this.EOF;
  }

  // Deprecated. Do not use in new code.
  match(str: string): boolean {
    return this.text.substr(this.index, str.length) === str;
  }

  // Deprecated. Do not use in new code.
  matchPeek(str: string): boolean {
    return this.text.substr(this.index + 1, str.length) === str;
  }

  // TODO: rename to "match" after migration.
  newMatch(str: string): boolean {
    return (
      this.text.substr(
        this.readAlready ? this.index + 1 : this.index,
        str.length
      ) === str
    );
  }
}
