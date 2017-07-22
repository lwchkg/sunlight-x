// @flow
import * as util from "./util.js";

export class CodeReader {
  index: number;
  line: number;
  column: number;
  EOF: string | void; // TODO: is it always undefined???
  nextReadBeginsLine: boolean | void; // TODO: remove undefined
  text: string;
  length: number;
  currentChar: string | void;

  constructor(text: string) {
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

  getCharacters(count: number = 1): string | void {
    if (count === 0) return "";

    const value = this.text.substring(this.index + 1, this.index + count + 1);
    return value === "" ? this.EOF : value;
  }

  toString(): string {
    const currentChar: string =
      this.currentChar === undefined ? "undefined" : this.currentChar;
    return `length: ${this.length}, index: ${this.index}, line: ${this
      .line}, column: ${this.column}, current: [${currentChar}]`;
  }

  peek(count: number = 1): string | void {
    return this.getCharacters(count);
  }

  substring(): string {
    return this.text.substring(this.index);
  }

  peekSubstring(): string {
    return this.text.substring(this.index + 1);
  }

  read(count: number = 1): string | void {
    const value: string | void = this.getCharacters(count);

    // this is a result of reading/peeking/doing nothing
    if (value === "") return value;

    if (value !== this.EOF) {
      // TODO: remove the condition because EOF === undefined (required by flow)
      if (value === undefined) return;

      // advance index
      this.index += value.length;
      this.column += value.length;

      // update line count
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

  isEof(): boolean {
    return this.index >= this.length;
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

  isEol(): boolean | void {
    return this.nextReadBeginsLine;
  }

  EOF(): string | void {
    return this.EOF;
  }

  current(): string | void {
    return this.currentChar;
  }
}
