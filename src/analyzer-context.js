// @flow
import { EOL, EMPTY } from "./constants.js";
import { document } from "./jsdom.js";

import type { Token } from "./token.js";
import type { ParserContext } from "./parser-context.js";
import type { SunlightOptionsType } from "./globalOptions.js";

export class AnalyzerContext {
  options: SunlightOptionsType;
  nodes: Element[];
  tokens: Token[];
  language: ?string;
  getAnalyzer: () => void;
  continuation: any;
  items: any;
  index: number; // TODO: initialize. But what to initialize with?

  nbsp: string;
  tab: string;

  constructor(
    parserContext: ParserContext,
    partialContext: AnalyzerContext,
    options: SunlightOptionsType
  ) {
    this.nodes = [];
    this.options = options;

    if (options.showWhitespace) {
      this.nbsp = "\u00b7";
      this.tab = new Array(this.options.tabWidth).join("\u2014") + "\u2192";
    } else {
      this.nbsp = "\u00a0";
      this.tab = new Array(this.options.tabWidth + 1).join(this.nbsp);
    }

    this.tokens = (partialContext.tokens || [])
      .concat(parserContext.getAllTokens());
    this.language = null;
    this.getAnalyzer = EMPTY;
    this.continuation = parserContext.continuation;
    this.items = parserContext.items;
  }

  _prepareText(token: Token): string {
    let value: string = token.value.split(" ").join(this.nbsp);

    // tabstop madness: replace \t with the appropriate number of characters,
    // depending on the tabWidth option and its relative position in the line
    let tabIndex;
    while ((tabIndex = value.indexOf("\t")) >= 0) {
      const lastNewlineColumn = value.lastIndexOf(EOL, tabIndex);
      const actualColumn =
        lastNewlineColumn >= 0 ? tabIndex - lastNewlineColumn - 1 : tabIndex;
      const tabLength =
        this.options.tabWidth - actualColumn % this.options.tabWidth; // actual length of the TAB character

      value =
        value.substring(0, tabIndex) +
        this.tab.substring(this.options.tabWidth - tabLength) +
        value.substring(tabIndex + 1);
    }
    return value;
  }

  addNode(node: Element) {
    this.nodes.push(node);
  }

  createTextNode(token: Token): Text {
    return document.createTextNode(this._prepareText(token));
  }

  getNodes(): Element[] {
    return this.nodes;
  }

  resetNodes() {
    this.nodes = [];
  }
}
