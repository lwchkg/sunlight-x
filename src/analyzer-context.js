// @flow
import { EOL, EMPTY } from "./constants.js";
import { document } from "./jsdom.js";
import { globalOptions } from "./globalOptions.js";

import type { SunlightOptionsType } from "./globalOptions.js";

const DEFAULT_TAB_WIDTH = 4;

export class AnalyzerContext {
  options: SunlightOptionsType;
  nodes: Element[];
  tokens: Token[];
  language: ?string;
  getAnalyzer: () => void;
  continuation: any;
  items: any;

  nbsp: string;
  tab: string;

  constructor(
    parserContext: any,
    partialContext: any,
    options: SunlightOptionsType
  ) {
    this.nodes = [];
    this.options = options;

    if (options.showWhitespace) {
      this.nbsp = "\u00b7";
      this.tab = new Array(this._getTabWidth()).join("\u2014") + "\u2192";
    } else {
      this.nbsp = "\u00a0";
      this.tab = new Array(this._getTabWidth() + 1).join(this.nbsp);
    }

    // TODO: add code between
    this.tokens = (partialContext.tokens || [])
      .concat(parserContext.getAllTokens());
    this.language = null;
    this.getAnalyzer = EMPTY;
    this.continuation = parserContext.continuation;
    this.items = parserContext.items;
  }

  _getTabWidth(): number {
    if (typeof this.options.tabWidth === "number") return this.options.tabWidth;
    if (typeof globalOptions.tabWidth === "number")
      return globalOptions.tabWidth;
    return DEFAULT_TAB_WIDTH;
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
        this._getTabWidth() - actualColumn % this._getTabWidth(); // actual length of the TAB character

      value =
        value.substring(0, tabIndex) +
        this.tab.substring(this._getTabWidth() - tabLength) +
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
