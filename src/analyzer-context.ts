import { ArrayWalker } from "./array-walker";
import { EOL } from "./constants";
import { document } from "./jsdom";
import { UserDefinedNameStore } from "./user-defined-name-store";
import type { Analyzer } from "./analyzer";
import type { Continuation } from "./continuation";
import type { ContextItemsType, Language } from "./languages";
import type { ParserContext } from "./parser-context";
import type { SunlightOptionsType } from "./globalOptions";
import type { Token } from "./token";
export class AnalyzerContext {
  options: SunlightOptionsType;
  nodes: (Element | Text)[];
  tokens: Token[];
  language: Language; // Uninitizlized by constructor. Initialize before using!

  analyzerOverrides: Analyzer[];
  userDefinedNameStore: UserDefinedNameStore;
  continuation: Continuation | null | undefined;
  items: ContextItemsType;
  index: number; // Uninitizlized by constructor. Managed by highlighter.js.

  nbsp: string;
  tab: string;

  constructor(parserContext: ParserContext, userDefinedNameStore: UserDefinedNameStore, partialContext: AnalyzerContext | null | undefined, options: SunlightOptionsType) {
    this.nodes = [];
    this.userDefinedNameStore = userDefinedNameStore;
    this.options = options;

    if (options.showWhitespace) {
      this.nbsp = "\u00b7";
      this.tab = new Array(this.options.tabWidth).join("\u2014") + "\u2192";
    } else {
      this.nbsp = "\u00a0";
      this.tab = new Array(this.options.tabWidth + 1).join(this.nbsp);
    }

    // this.tokens = (partialContext ? partialContext.tokens : []).concat(parserContext.getAllTokens());
    this.tokens = (partialContext && partialContext.tokens || []).concat(parserContext.getAllTokens());
    this.analyzerOverrides = [];
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
      const actualColumn = lastNewlineColumn >= 0 ? tabIndex - lastNewlineColumn - 1 : tabIndex;
      const tabLength = this.options.tabWidth - actualColumn % this.options.tabWidth;
      // actual length of the TAB character
      value = value.substring(0, tabIndex) + this.tab.substring(this.options.tabWidth - tabLength) + value.substring(tabIndex + 1);
    }

    return value;
  }

  // Create a token walker that is positioned at the this.index.
  getTokenWalker(): ArrayWalker<Token> {
    return new ArrayWalker(this.tokens, this.index);
  }

  addNode(node: Element | Text) {
    this.nodes.push(node);
  }

  createTextNode(token: Token): Text {
    return document.createTextNode(this._prepareText(token));
  }

  getNodes(): (Element | Text)[] {
    return this.nodes;
  }

  resetNodes() {
    this.nodes = [];
  }

}