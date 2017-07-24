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
import { errorInvalidValue } from "./logger.js";

import { document, Element as element } from "./jsdom.js";

import type {
  SunlightOptionsType,
  SunlightPartialOptionsType
} from "./globalOptions.js";
import type { Analyzer } from "./analyzer.js";
import type { ParserContext } from "./parser-context.js";

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

  // partialContext allows us to perform a partial parse, and then pick up where we left off at a later time
  // this functionality enables nested highlights (language within a language, e.g. PHP within HTML followed by more PHP)
  highlightText(
    unhighlightedCode: string,
    languageId: string,
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
      Tokenize(this, unhighlightedCode, language, partialContext, this.options),
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

  // matches the language of the node to highlight
  matchSunlightNode(node: Element): * {
    if (!this.matchSunlightNodeRegEx)
      this.matchSunlightNodeRegEx = new RegExp(
        "(?:\\s|^)" + this.options.classPrefix + "highlight-(\\S+)(?:\\s|$)"
      );

    return this.matchSunlightNodeRegEx.exec(node.className);
  }

  // determines if the node has already been highlighted
  isAlreadyHighlighted(node: Element): boolean {
    if (!this.isAlreadyHighlightedRegEx)
      this.isAlreadyHighlightedRegEx = new RegExp(
        "(?:\\s|^)" + this.options.classPrefix + "highlighted(?:\\s|$)"
      );

    return this.isAlreadyHighlightedRegEx.test(node.className);
  }

  // highlights a block of text
  highlight(code: string, languageId: string): AnalyzerContext {
    return this.highlightText(code, languageId);
  }

  // recursively highlights a DOM node
  highlightNode(node: Element, addContainer: ?boolean) {
    let partialContext;

    if (this.isAlreadyHighlighted(node)) return;

    const match = this.matchSunlightNode(node);
    if (match === null) return;

    BeforeHighlightNodeEvent.raise(this, { node: node });

    const languageId = match[1];
    let currentNodeCount = 0;
    for (let j = 0; j < node.childNodes.length; j++)
      if (node.childNodes[j].nodeType === TEXT_NODE) {
        // text nodes
        partialContext = this.highlightText(
          node.childNodes[j].nodeValue,
          languageId,
          partialContext
        );
        HIGHLIGHTED_NODE_COUNT++;
        currentNodeCount = currentNodeCount || HIGHLIGHTED_NODE_COUNT;

        const nodes = partialContext.getNodes();
        if (!nodes[0]) nodes[0] = document.createTextNode("");
        node.replaceChild(nodes[0], node.childNodes[j]);
        for (let k = 1; k < nodes.length; k++)
          node.insertBefore(nodes[k], nodes[k - 1].nextSibling);
      } else if (node.childNodes[j] instanceof element) {
        // element nodes
        this.highlightNode(node.childNodes[j]);
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
}
