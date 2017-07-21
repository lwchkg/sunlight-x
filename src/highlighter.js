// @flow

import * as util from "./util.js";
import { isIe, EOL, EMPTY, DEFAULT_LANGUAGE, TEXT_NODE } from "./constants.js";
import { globalOptions } from "./globalOptions.js";
import { fireEvent } from "./events.js";
import { languages } from "./languages.js";
import { CodeReader } from "./code-reader.js";
import { AnalyzerContext } from "./analyzer-context.js";
import { parseNextToken } from "./parse-next-token.js";

import { document } from "./jsdom.js";

import type { SunlightOptionsType } from "./globalOptions.js";

let HIGHLIGHTED_NODE_COUNT = 0;

function appendAll(parent: Node, children: Node[]) {
  for (let i = 0; i < children.length; i++) parent.appendChild(children[i]);
}

/* eslint require-jsdoc: 0 */
export class Highlighter {
  options: SunlightOptionsType;
  matchSunlightNodeRegEx: RegExp;
  isAlreadyHighlightedRegEx: RegExp;

  constructor(options: SunlightOptionsType) {
    this.options = Object.assign({}, globalOptions, options);
  }

  // called before processing the current
  switchToEmbeddedLanguageIfNecessary(context) {
    let i, embeddedLanguage;

    for (i = 0; i < context.language.embeddedLanguages.length; i++) {
      if (!languages[context.language.embeddedLanguages[i].language])
        // unregistered language
        continue;

      embeddedLanguage = util.clone(context.language.embeddedLanguages[i]);

      if (embeddedLanguage.switchTo(context)) {
        embeddedLanguage.oldItems = util.clone(context.items);
        context.embeddedLanguageStack.push(embeddedLanguage);
        context.language = languages[embeddedLanguage.language];
        context.items = util.merge(
          context.items,
          util.clone(context.language.contextItems)
        );
        break;
      }
    }
  }

  // called after processing the current
  switchBackFromEmbeddedLanguageIfNecessary(context) {
    const current = util.lastElement(context.embeddedLanguageStack);

    if (current && current.switchBack(context)) {
      context.language = languages[current.parentLanguage];
      const lang = context.embeddedLanguageStack.pop();

      // restore old items
      context.items = util.clone(lang.oldItems);
      lang.oldItems = {};
    }
  }

  tokenize(
    unhighlightedCode: string,
    language: string,
    partialContext,
    options
  ) {
    let tokens = [];

    fireEvent("beforeTokenize", this, {
      code: unhighlightedCode,
      language: language
    });

    const context: Object = {
      reader: new CodeReader(unhighlightedCode),
      language: language,
      items: util.clone(language.contextItems),
      token: function(index) {
        return tokens[index];
      },
      getAllTokens: function() {
        return tokens.slice(0);
      },
      count: function() {
        return tokens.length;
      },
      options: options,
      embeddedLanguageStack: [],
      defaultData: { text: "", line: 1, column: 1 },
      createToken: function(name, value, line, column) {
        return {
          name: name,
          line: line,
          value: isIe ? value.replace(/\n/g, "\r") : value,
          column: column,
          language: this.language.name
        };
      }
    };

    // if continuation is given, then we need to pick up where we left off from a previous parse
    // basically it indicates that a scope was never closed, so we need to continue that scope
    if (partialContext.continuation) {
      const continuation = partialContext.continuation;
      partialContext.continuation = null;
      tokens.push(
        continuation(
          context,
          continuation,
          "",
          context.reader.getLine(),
          context.reader.getColumn(),
          true
        )
      );
    }

    while (!context.reader.isEof()) {
      this.switchToEmbeddedLanguageIfNecessary(context);
      const token = parseNextToken(context);

      // flush default data if needed (in pretty much all languages this is just whitespace)
      if (token !== null) {
        if (context.defaultData.text !== "") {
          tokens.push(
            context.createToken(
              "default",
              context.defaultData.text,
              context.defaultData.line,
              context.defaultData.column
            )
          );
          context.defaultData.text = "";
        }

        if (token[0] !== undefined)
          // multiple tokens
          tokens = tokens.concat(token);
        else
          // single token
          tokens.push(token);
      }

      this.switchBackFromEmbeddedLanguageIfNecessary(context);
      context.reader.read();
    }

    // append the last default token, if necessary
    if (context.defaultData.text !== "")
      tokens.push(
        context.createToken(
          "default",
          context.defaultData.text,
          context.defaultData.line,
          context.defaultData.column
        )
      );

    fireEvent("afterTokenize", this, {
      code: unhighlightedCode,
      parserContext: context
    });
    return context;
  }

  createContainer(ctx): Element {
    const container = document.createElement("span");
    container.className = ctx.options.classPrefix + ctx.language.name;
    return container;
  }

  analyze(analyzerContext: AnalyzerContext, startIndex: number) {
    let nodes, container, i, tokenName, func, language, analyzer;
    // TODO: let lastIndex;

    fireEvent("beforeAnalyze", this, { analyzerContext: analyzerContext });

    if (analyzerContext.tokens.length > 0) {
      analyzerContext.language =
        languages[analyzerContext.tokens[0].language] ||
        languages[DEFAULT_LANGUAGE];
      nodes = [];
      // TODO: lastIndex = 0;
      container = this.createContainer(analyzerContext);

      for (i = startIndex; i < analyzerContext.tokens.length; i++) {
        language =
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
        tokenName = analyzerContext.tokens[i].name;
        // TODO: clean up!!!
        func = "handle_" + tokenName;

        analyzer =
          analyzerContext.getAnalyzer.call(analyzerContext) ||
          analyzerContext.language.analyzer;
        analyzer[func]
          ? analyzer[func](analyzerContext)
          : analyzer.handleToken(analyzerContext);
      }

      // append the last nodes, and add the final nodes to the context
      appendAll(container, analyzerContext.getNodes());
      nodes.push(container);
      analyzerContext.resetNodes();
      for (i = 0; i < nodes.length; i++) analyzerContext.addNode(nodes[i]);
    }

    fireEvent("afterAnalyze", this, { analyzerContext: analyzerContext });
  }

  // partialContext allows us to perform a partial parse, and then pick up where we left off at a later time
  // this functionality enables nested highlights (language within a language, e.g. PHP within HTML followed by more PHP)
  highlightText(
    unhighlightedCode: string,
    languageId: string,
    partialContext: Object
  ): AnalyzerContext {
    let language = languages[languageId];

    partialContext = partialContext || {};
    if (language === undefined)
      // use default language if one wasn't specified or hasn't been registered
      language = languages[DEFAULT_LANGUAGE];

    fireEvent("beforeHighlight", this, {
      code: unhighlightedCode,
      language: language,
      previousContext: partialContext
    });

    //const analyzerContext = this.createAnalyzerContext(
    const analyzerContext = new AnalyzerContext(
      this.tokenize.call(
        this,
        unhighlightedCode,
        language,
        partialContext,
        this.options
      ),
      partialContext,
      this.options
    );

    this.analyze.call(
      this,
      analyzerContext,
      partialContext.index ? partialContext.index + 1 : 0
    );

    fireEvent("afterHighlight", this, { analyzerContext: analyzerContext });

    return analyzerContext;
  }

  // matches the language of the node to highlight
  matchSunlightNode(node: Element): any {
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
    return this.highlightText.call(this, code, languageId);
  }

  // recursively highlights a DOM node
  highlightNode(node: Element) {
    let partialContext;

    if (this.isAlreadyHighlighted(node)) return;

    const match = this.matchSunlightNode(node);
    if (match === null) return;

    const languageId = match[1];
    let currentNodeCount = 0;
    fireEvent("beforeHighlightNode", this, { node: node });
    for (let j = 0; j < node.childNodes.length; j++)
      if (node.childNodes[j].nodeType === TEXT_NODE) {
        // text nodes
        partialContext = this.highlightText.call(
          this,
          node.childNodes[j].nodeValue,
          languageId,
          partialContext
        );
        HIGHLIGHTED_NODE_COUNT++;
        currentNodeCount = currentNodeCount || HIGHLIGHTED_NODE_COUNT;
        const nodes = partialContext.getNodes();

        node.replaceChild(nodes[0], node.childNodes[j]);
        for (let k = 1; k < nodes.length; k++)
          node.insertBefore(nodes[k], nodes[k - 1].nextSibling);
      } else if (node.childNodes[j].nodeType === 1) {
        // element nodes
        this.highlightNode.call(this, node.childNodes[j]);
      }

    // indicate that this node has been highlighted
    node.className += " " + this.options.classPrefix + "highlighted";

    let container, codeContainer;
    // if the node is block level, we put it in a container, otherwise we just leave it alone
    if (util.getComputedStyle(node, "display") === "block") {
      container = document.createElement("div");
      container.className = this.options.classPrefix + "container";

      codeContainer = document.createElement("div");
      codeContainer.className = this.options.classPrefix + "code-container";

      // apply max height if specified in options
      if (this.options.maxHeight !== false) {
        codeContainer.style.overflowY = "auto";
        codeContainer.style.maxHeight =
          this.options.maxHeight +
          (/^\d+$/.test(this.options.maxHeight) ? "px" : "");
      }

      container.appendChild(codeContainer);

      node.parentNode.insertBefore(codeContainer, node);
      node.parentNode.removeChild(node);
      codeContainer.appendChild(node);

      codeContainer.parentNode.insertBefore(container, codeContainer);
      codeContainer.parentNode.removeChild(codeContainer);
      container.appendChild(codeContainer);
    }

    fireEvent("afterHighlightNode", this, {
      container: container,
      codeContainer: codeContainer,
      node: node,
      count: currentNodeCount
    });
  }
}
