// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import * as fs from "fs";
import * as path from "path";
import { djb2Utf8 } from "./djb2-utf8";
import { Highlighter } from "../../src/sunlight";
import type { SunlightPartialOptionsType } from "../../src/globalOptions";
const defaultOptions = {
  enableDocLinks: true,
  maxHeight: undefined
};
export const nbsp = "\u00a0";

/**
 * Generate options according to the hash. Exported for testing only.
 * @param {number} hash The hash, from 0 to 2 ^ 32 - 1.
 * @returns {Object}
 */
export function getOptionsFromHash(hash: number): SunlightPartialOptionsType {
  const themes = ["gitbook", "light", "dark"];
  const ret: SunlightPartialOptionsType = {};
  ret.theme = themes[hash % 3];
  hash = Math.floor(hash / 3);
  ret.lineNumbers = (hash & 1) !== 0;
  return ret;
}

/**
 * Generate options according to the hash of a string.
 * @param {string} s
 * @returns {Object}
 */
export function getOptionsFromString(s: string): SunlightPartialOptionsType {
  return getOptionsFromHash(djb2Utf8(s));
}
export class TestSupportForCode {
  classPrefix: string;
  codeElement: Element;

  /**
   * @param {string} code
   * @param {string} language
   * @param {Object|undefined} options
   */
  constructor(code: string, language: string, options?: SunlightPartialOptionsType) {
    const parsedOptions = Object.assign({}, defaultOptions, options);
    const highlighter = new Highlighter(parsedOptions);
    this.classPrefix = highlighter.options.classPrefix;
    this.codeElement = highlighter.highlightCodeAsElement(code, language);
  }

  /**
   * Return if an element with class |className| exists.
   * @param {string} className
   * @returns {boolean}
   */
  DoesElementsWithClassNameExist(className: string): boolean {
    return this.codeElement.querySelector("." + this.classPrefix + className) !== null;
  }

  /**
   * Return elements matching the specified CSS selectors.
   * @param {string} selectors
   * @returns {NodeList}
   */
  querySelectorAll(selectors: string): NodeList<any> {
    return this.codeElement.querySelectorAll(selectors);
  }

  /**
   * Return elements matching the specified CSS class name.
   * @param {string} className
   * @returns {NodeList}
   */
  GetElementsWithClassName(className: string): NodeList<HTMLElement> {
    return this.codeElement.querySelectorAll("." + this.classPrefix + className);
  }

  /**
   * Assert that the text |content| inside a tag with class |className| exists.
   * @param {string} className
   * @param {string} content
   */
  AssertContentExists(className: string, content: string) {
    const elements = this.codeElement.querySelectorAll("." + this.classPrefix + className);
    const nodeValues = [];

    for (let i = 0; i < elements.length; i++) if (elements[i].firstChild) nodeValues.push(elements[i].firstChild.nodeValue);

    content = content.replace(/ /g, nbsp).replace(/\t/g, nbsp.repeat(4));
    expect(nodeValues).toContain(content);
  }

}
const snippetsDir = path.join(__dirname, "..", "code-snippets");

/**
 * Returns the content of the file in "code-snippets" directory.
 * @param {string} filename
 * @returns {string}
 */
export function GetContentOfSnippet(filename: string): string {
  return fs.readFileSync(path.join(snippetsDir, filename), "utf8");
}
export class TestSupportForFile extends TestSupportForCode {
  /**
   * @param {string} filename Name of the file that contains the code to be highlighted.
   * @param {string} language
   * @param {Object|undefined} options
   */
  constructor(filename: string, language: string, options?: SunlightPartialOptionsType) {
    super(GetContentOfSnippet(filename), language, options);
  }

  /**
   * Returns the list of files in the snippet directory.
   * @returns {string[]}
   */
  static getSnippetFileList(): string[] {
    return fs.readdirSync(snippetsDir);
  }

}