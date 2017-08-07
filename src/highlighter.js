// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "./util.js";
import { DEFAULT_LANGUAGE, TEXT_NODE } from "./constants.js";
import { globalOptions } from "./globalOptions.js";
import {
  BeforeHighlightNodeEvent,
  AfterHighlightNodeEvent,
  BeforeHighlightEvent,
  AfterHighlightEvent,
  BeforeAnalyzeEvent,
  AfterAnalyzeEvent
} from "./events.js";
import { languages } from "./languages.js";
import { AnalyzerContext } from "./analyzer-context.js";
import { Tokenize } from "./parser-context.js";
import { error as logError, errorInvalidValue } from "./logger.js";
import { UserDefinedNameStore } from "./user-defined-name-store.js";

import { document, window } from "./jsdom.js";

import type {
  SunlightOptionsType,
  SunlightPartialOptionsType
} from "./globalOptions.js";
import type { Analyzer } from "./analyzer.js";
import type { ParserContext } from "./parser-context.js";

// TODO: Redo count. Is there really a need to increase count for sub-nodes?
let HIGHLIGHTED_NODE_COUNT = 0;

/**
 * Append all children to the parent node.
 * @param {Node} parent
 * @param {Node[]} children
 */
function appendAll<T: Node | Element>(parent: T, children: T[]) {
  for (let i = 0; i < children.length; i++) parent.appendChild(children[i]);
}

export class Highlighter {
  options: SunlightOptionsType;
  matchSunlightNodeRegEx: RegExp;
  isAlreadyHighlightedRegEx: RegExp;

  constructor(options: ?SunlightPartialOptionsType) {
    this.options = Object.assign({}, globalOptions, options);
  }

  // called before processing the current
  switchToEmbeddedLanguageIfNecessary(context: ParserContext) {
    for (let i = 0; i < context.language.embeddedLanguages.length; i++) {
      if (!languages[context.language.embeddedLanguages[i].language])
        // unregistered language
        continue;

      const embeddedLanguage = util.clone(
        context.language.embeddedLanguages[i]
      );

      if (embeddedLanguage.switchTo(context)) {
        embeddedLanguage.oldItems = util.clone(context.items);
        context.embeddedLanguageStack.push(embeddedLanguage);
        context.language = languages[embeddedLanguage.language];
        context.items = Object.assign(
          context.items,
          util.clone(context.language.contextItems)
        );
        break;
      }
    }
  }

  // called after processing the current
  switchBackFromEmbeddedLanguageIfNecessary(context: ParserContext) {
    const current = util.lastElement(context.embeddedLanguageStack);

    if (current && current.switchBack(context)) {
      context.language = languages[current.parentLanguage];
      const lang = context.embeddedLanguageStack.pop();

      // restore old items
      context.items = util.clone(lang.oldItems);
      lang.oldItems = {};
    }
  }

  createContainer(context: AnalyzerContext): Element {
    const container = document.createElement("span");
    container.className =
      (context.options.classPrefix || "") + context.language.name;
    return container;
  }

  analyze(analyzerContext: AnalyzerContext, startIndex: number) {
    BeforeAnalyzeEvent.raise(this, { analyzerContext: analyzerContext });

    if (analyzerContext.tokens.length > 0) {
      analyzerContext.language =
        languages[analyzerContext.tokens[0].language] ||
        languages[DEFAULT_LANGUAGE];
      const nodes = [];
      let container = this.createContainer(analyzerContext);

      for (let i = startIndex; i < analyzerContext.tokens.length; i++) {
        const language =
          languages[analyzerContext.tokens[i].language] ||
          languages[DEFAULT_LANGUAGE];
        if (language.name !== analyzerContext.language.name) {
          appendAll(container, analyzerContext.getNodes());
          analyzerContext.resetNodes();

          nodes.push(container);
          analyzerContext.language = language;
          container = this.createContainer(analyzerContext);
        }

        analyzerContext.index = i;
        const tokenName = analyzerContext.tokens[i].name;
        if (
          ![
            ...analyzerContext.analyzerOverrides,
            analyzerContext.language.analyzer
          ].some((analyzer: Analyzer): boolean => {
            if (analyzer.handlers.hasOwnProperty(tokenName)) {
              analyzer.handlers[tokenName](analyzerContext);
              return true;
            }
            return false;
          })
        )
          analyzerContext.language.analyzer.handleToken(analyzerContext);
      }

      // append the last nodes, and add the final nodes to the context
      appendAll(container, analyzerContext.getNodes());
      nodes.push(container);
      analyzerContext.resetNodes();
      for (let i = 0; i < nodes.length; i++) analyzerContext.addNode(nodes[i]);
    }

    AfterAnalyzeEvent.raise(this, { analyzerContext: analyzerContext });
  }

  // partialContext allows us to perform a partial parse, and then pick up where
  // we left off at a later time this functionality enables nested highlights
  // (language within a language, e.g. PHP within HTML followed by more PHP)
  _highlightText(
    unhighlightedCode: string,
    languageId: string,
    userDefinedNameStore: UserDefinedNameStore,
    partialContext: ?AnalyzerContext
  ): AnalyzerContext {
    let language = languages[languageId];

    if (language === undefined)
      // use default language if one wasn't specified or hasn't been registered
      language = languages[DEFAULT_LANGUAGE];

    BeforeHighlightEvent.raise(this, {
      code: unhighlightedCode,
      language: language,
      previousContext: partialContext
    });

    const analyzerContext = new AnalyzerContext(
      Tokenize(
        this,
        unhighlightedCode,
        language,
        userDefinedNameStore,
        partialContext,
        this.options
      ),
      userDefinedNameStore,
      partialContext,
      this.options
    );

    this.analyze(
      analyzerContext,
      partialContext && partialContext.index ? partialContext.index + 1 : 0
    );

    AfterHighlightEvent.raise(this, { analyzerContext: analyzerContext });

    return analyzerContext;
  }

  getAllHighlightableNodes(): NodeList<HTMLElement> {
    const classPrefix = this.options.classPrefix + "highlight-";
    return document.querySelectorAll(`[class^="${classPrefix}"]`);
  }

  getLanguageFromNode(node: Element): ?string {
    const classPrefix = this.options.classPrefix + "highlight-";
    const classList = node.className.split(" ");
    for (const classItem of classList)
      if (classItem.startsWith(classPrefix))
        return classItem.substring(classPrefix.length);

    // FIXME: Code goes to here when switching languages.
    return undefined;
  }

  // determines if the node has already been highlighted
  isAlreadyHighlighted(node: Element): boolean {
    return node.classList.contains(this.options.classPrefix + "highlighted");
  }

  // Highlights a block of text. DEPRECATED.
  highlight(code: string, languageId: string): AnalyzerContext {
    return this._highlightText(
      code,
      languageId,
      new UserDefinedNameStore(),
      undefined
    );
  }

  /**
   * Recursively highlights a DOM node. The node should have the class of
   * "sunlight-highlight-[lang]", or "[prefix]highlight-[lang]" if you have a
   * custom prefix.
   * @param {Element} node The element to be highlighted.
   * @param {boolean?} addContainer Whether to add the container. If omitted,
   * container will be added if it is a block element. (TODO: should we make it
   * omit == true?)
   */
  highlightNode(node: Element, addContainer: ?boolean) {
    if (this.isAlreadyHighlighted(node)) return;

    const languageId = this.getLanguageFromNode(node);
    if (!languageId) return;

    BeforeHighlightNodeEvent.raise(this, { node: node });

    let currentNodeCount = 0;
    const userDefinedNameStore = new UserDefinedNameStore();
    let partialContext: ?AnalyzerContext = undefined;
    for (const childNode of node.childNodes)
      if (childNode.nodeType === TEXT_NODE) {
        // text nodes
        partialContext = this._highlightText(
          childNode.nodeValue,
          languageId,
          userDefinedNameStore,
          partialContext
        );
        HIGHLIGHTED_NODE_COUNT++;
        currentNodeCount = currentNodeCount || HIGHLIGHTED_NODE_COUNT;

        const nodes = partialContext.getNodes();
        if (!nodes[0]) nodes[0] = document.createTextNode("");
        node.replaceChild(nodes[0], childNode);
        for (let k = 1; k < nodes.length; k++)
          node.insertBefore(nodes[k], nodes[k - 1].nextSibling);
      } else if (childNode instanceof window.Element) {
        // element nodes
        this.highlightNode(childNode);
      }

    // indicate that this node has been highlighted
    node.className += " " + this.options.classPrefix + "highlighted";

    // If the node is block level, or if we cannot know the style, put the code
    // inside a container.
    const style = util.getComputedStyle(node, "display");
    if (
      addContainer === true ||
      (addContainer !== false && (!style || style === "block"))
    ) {
      const container: HTMLElement = document.createElement("div");
      container.className = this.options.classPrefix + "container";

      if (this.options.theme)
        container.classList.add(
          `${this.options.classPrefix}theme-${this.options.theme}`
        );

      const codeContainer: HTMLElement = document.createElement("div");
      codeContainer.className = this.options.classPrefix + "code-container";

      // apply max height if specified in options
      if (this.options.maxHeight !== false) {
        codeContainer.style.overflowY = "auto";
        codeContainer.style.maxHeight =
          this.options.maxHeight +
          (/^\d+$/.test(this.options.maxHeight) ? "px" : "");
      }

      container.appendChild(codeContainer);

      const parentNode = node.parentNode;
      if (parentNode) {
        parentNode.insertBefore(container, node);
        codeContainer.appendChild(parentNode.removeChild(node));
      } else {
        errorInvalidValue("highlightNode: node has no parent node.");
      }

      AfterHighlightNodeEvent.raise(this, {
        container: container,
        codeContainer: codeContainer,
        node: node,
        count: currentNodeCount
      });
    } else {
      AfterHighlightNodeEvent.raise(this, {
        node: node,
        count: currentNodeCount
      });
    }
  }

  /**
   * Highlights the given code and returns the HTML Element.
   * @param {string} code
   * @param {string} languageId
   * @returns {Element}
   */
  highlightCodeAsElement(code: string, languageId: string): Element {
    const preElement = document.createElement("pre");
    // Note: setting innerText does not work in jsdom 9.4.2
    preElement.appendChild(document.createTextNode(code));
    preElement.setAttribute(
      "class",
      this.options.classPrefix + "highlight-" + languageId
    );

    const codeElement = document.createElement("div");
    codeElement.appendChild(preElement);

    this.highlightNode(preElement, true);

    const ret = codeElement.childNodes[0];
    if (!(ret instanceof window.Element)) {
      logError("Internal error.");
      return codeElement;
    }
    return ret;
  }

  /**
   * Highlights the given code and returns the HTML as a string.
   * @param {string} code
   * @param {string} languageId
   * @returns {Element}
   */
  highlightCode(code: string, languageId: string): string {
    return this.highlightCodeAsElement(code, languageId).outerHTML;
  }

  // Reset HIGHLIGHTED_NODE_COUNT to zero. Run this before a layout test.
  static resetNodeCount() {
    HIGHLIGHTED_NODE_COUNT = 0;
  }
}
