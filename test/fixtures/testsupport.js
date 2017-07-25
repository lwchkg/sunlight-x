// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as assert from "assert";
import * as fs from "fs";
import { jsdom } from "jsdom";
import * as path from "path";

import { Highlighter } from "../../src/sunlight.js";

import type { SunlightPartialOptionsType } from "../../src/globalOptions.js";

const defaultOptions = {
  classPrefix: "sunlight-",
  enableDocLinks: true,
  maxHeight: undefined
};

export const nbsp = "\u00a0";

export class TestSupport {
  /**
   * @param {string} filename Name of the file that contains the code to be highlighted.
   * @param {string} language
   * @param {Object|undefined} options
   */
  options: SunlightPartialOptionsType;
  classPrefix: string;
  codeElement: Element;

  constructor(
    filename: string,
    language: string,
    options?: SunlightPartialOptionsType
  ) {
    this.options = Object.assign({}, defaultOptions, options);
    this.classPrefix = this.options.classPrefix || "sunlight-";

    const code = fs.readFileSync(
      path.join(__dirname, "..", "code-snippets", filename),
      "utf8"
    );

    const document: Document = jsdom("", {});
    const preElement = document.createElement("pre");
    // Note: setting innerText does not work in jsdom 9.4.2
    preElement.appendChild(document.createTextNode(code));
    preElement.setAttribute(
      "class",
      this.classPrefix + "highlight-" + language
    );

    this.codeElement = document.createElement("div");
    this.codeElement.appendChild(preElement);

    const highlighter = new Highlighter(this.options);
    highlighter.highlightNode(preElement);
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

    assert(
      nodeValues.indexOf(content) >= 0,
      `Cannot find \`${content}\` in \`${className}\`.`
    );
  }
}
