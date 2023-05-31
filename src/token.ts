import { isIe } from "./constants";
export class Token {
  readonly name: string;
  readonly value: string;
  readonly language: string;

  constructor(name: string, value: string, language: string) {
    this.name = name;
    this.value = isIe ? value.replace(/\n/g, "\r") : value;
    this.language = language;
  }

}