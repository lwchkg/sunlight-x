// @flow

import { isIe } from "./constants.js";

export class Token {
  +name: string;
  +value: string;
  +line: number;
  +column: number;
  +language: string;

  constructor(
    name: string,
    value: string,
    line: number,
    column: number,
    language: string
  ) {
    // TODO: Update after Flow issue #2646 is fixed.
    // $FlowFixMe
    this.name = name;
    // $FlowFixMe
    this.value = isIe ? value.replace(/\n/g, "\r") : value;
    // $FlowFixMe
    this.line = line;
    // $FlowFixMe
    this.column = column;
    // $FlowFixMe
    this.language = language;
  }
}
