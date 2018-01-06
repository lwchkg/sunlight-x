// @flow

/* eslint no-magic-numbers: 1 */

export class CodeReader {
  index: number;
  text: string;
  length: number;

  constructor(text: string) {
    this.index = 0;

    // Normalize line endings to unix
    this.text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    this.length = this.text.length;
  }

  peek(count: number = 1): string {
    return this.text.substr(this.index, count);
  }

  peekWithOffset(relativeIndex: number, count: number = 1): string {
    if (count < 1) return "";
    const index: number = this.index + relativeIndex;
    return this.text.substring(index, index + count);
  }

  peekToEOF(): string {
    return this.text.substring(this.index);
  }

  peekToEndOfLine(): string {
    const startIndex = this.index;
    const endIndex: number = this.text.indexOf("\n", startIndex);
    if (endIndex >= 0) return this.text.substring(startIndex, endIndex);
    return this.text.substring(startIndex);
  }

  read(count: number = 1): string {
    const ret = this.peek(count);
    // Advance index by the actual number of characters read, so it doesn't go
    // past the end of the text.
    this.index += ret.length;
    return ret;
  }

  isEOF(): boolean {
    return this.index >= this.length;
  }

  isStartOfLine(): boolean {
    return (
      this.index === 0 || (!this.isEOF() && this.peekWithOffset(-1) === "\n")
    );
  }

  // Check if the current character is preceded by whitespace or nothing.
  isPrecededByWhitespaceOnly(): boolean {
    for (let offset = -1; ; offset--) {
      const peek = this.peekWithOffset(offset);
      if (peek === "" || peek === "\n") break;
      if (!/\s/.test(peek)) return false;
    }
    return true;
  }

  // TODO: rename to "match" after migration.
  match(str: string): boolean {
    return this.text.substr(this.index, str.length) === str;
  }
}
