import assert from 'power-assert';
const fs = require('fs');
const path = require('path');

import {jsdom} from 'jsdom';
import {Sunlight} from '../../src/sunlight.js';

const defaultOptions = {
  classPrefix: 'sunlight-',
  showMenu: true,
  enableDocLinks: true,
  maxHeight: undefined,
};

export class TestSupport {
  /**
   * @param {string} filename Name of the file that contains the code to be highlighted.
   * @param {string} language
   * @param {Object|undefined} options
   */
  constructor(filename, language, options) {
    this.options =
      options === undefined
        ? Object.assign({}, defaultOptions)
        : Object.assign({}, defaultOptions, options);

    const code = fs.readFileSync(
      path.join(__dirname, '..', 'code-snippets', filename)
    );

    const document = jsdom('', {});
    const preElement = document.createElement('div');
    // Note: setting innerText does not work in jsdom 9.4.2
    preElement.appendChild(document.createTextNode(code));
    preElement.setAttribute(
      'class',
      this.options.classPrefix + 'highlight-' + language
    );

    this.CodeElement = document.createElement('div');
    this.CodeElement.appendChild(preElement);

    const highlighter = new Sunlight.Highlighter(this.options);
    highlighter.highlightNode(preElement);
  }

  /**
   * Assert that the text |content| inside a tag with |className| exists.
   * @param {string} className
   * @param {string} content
   */
  AssertContentExists(className, content) {
    const elements = this.CodeElement.querySelectorAll(
      '.' + this.options.classPrefix + className
    );

    const nodeValues = [];
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].firstChild)
        nodeValues.push(elements[i].firstChild.nodeValue);
    }

    const nbsp = '\u00a0';
    content = content.replace(/ /g, nbsp).replace(/\t/g, nbsp.repeat(4));

    assert(nodeValues.indexOf(content) >= 0);
  }
}
