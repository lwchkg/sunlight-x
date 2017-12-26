// @flow

import { isIe } from "./constants.js";

export class Token {
  +name: string;
  +value: string;
  +language: string;

  constructor(name: string, value: string, language: string) {
    this.name = name;
    this.value = isIe ? value.replace(/\n/g, "\r") : value;
    this.language = language;
  }
}
