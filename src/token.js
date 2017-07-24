// @flow

import { isIe } from "./constants.js";

export class Token {
  name: string;
  value: string;
  line: number;
  column: number;
  language: string;

  constructor(
    name: string,
    value: string,
    line: number,
    column: number,
    language: string
  ) {
    this.name = name;
    this.value = isIe ? value.replace(/\n/g, "\r") : value;
    this.line = line;
    this.column = column;
    this.language = language;
  }
}
