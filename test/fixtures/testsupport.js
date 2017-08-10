// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as fs from "fs";
import * as path from "path";

import { Highlighter } from "../../src/sunlight.js";

import type { SunlightPartialOptionsType } from "../../src/globalOptions.js";

const defaultOptions = {
  enableDocLinks: true,
  maxHeight: undefined
};

export const nbsp = "\u00a0";

export class TestSupportForCode {
  classPrefix: string;
  codeElement: Element;

  /**
   * @param {string} code
   * @param {string} language
   * @param {Object|undefined} options
   */
  constructor(
    code: string,
    language: string,
    options?: SunlightPartialOptionsType
  ) {
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
    return (
      this.codeElement.querySelector("." + this.classPrefix + className) !==
      null
    );
  }

  /**
   * Return elements matching the specified CSS selectors.
   * @param {string} selectors
   * @returns {NodeList}
   */
  querySelectorAll(selectors: string): NodeList<*> {
    return this.codeElement.querySelectorAll(selectors);
  }

  /**
   * Return elements matching the specified CSS class name.
   * @param {string} className
   * @returns {NodeList}
   */
  GetElementsWithClassName(className: string): NodeList<HTMLElement> {
    return this.codeElement.querySelectorAll(
      "." + this.classPrefix + className
    );
  }

  /**
   * Assert that the text |content| inside a tag with class |className| exists.
   * @param {string} className
   * @param {string} content
   */
  AssertContentExists(className: string, content: string) {
    const elements = this.codeElement.querySelectorAll(
      "." + this.classPrefix + className
    );

    const nodeValues = [];
    for (let i = 0; i < elements.length; i++)
      if (elements[i].firstChild)
        nodeValues.push(elements[i].firstChild.nodeValue);

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
  constructor(
    filename: string,
    language: string,
    options?: SunlightPartialOptionsType
  ) {
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
