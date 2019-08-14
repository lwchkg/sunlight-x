// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import type { AnalyzerContext } from "./analyzer-context.js";
import type { Highlighter } from "./highlighter.js";
import type { Language } from "./languages.js";
import type { ParserContext } from "./parser-context.js";

export type BeforeHighlightNodeEventArgs = { node: Element };
export type BeforeHighlightEventArgs = {
  code: string,
  language: Language,
  previousContext: ?AnalyzerContext
};
export type BeforeTokenizeEventArgs = {
  code: string,
  language: Language
};
export type AfterTokenizeEventArgs = {
  code: string,
  parserContext: ParserContext
};
export type BeforeAnalyzeEventArgs = { analyzerContext: AnalyzerContext };
export type AfterAnalyzeEventArgs = { analyzerContext: AnalyzerContext };
export type AfterHighlightEventArgs = { analyzerContext: AnalyzerContext };
export type AfterHighlightNodeEventArgs = {
  container?: HTMLElement,
  codeContainer?: HTMLElement,
  node: Element,
  count: number
};

class EventClass<T> {
  delegates: Array<(Highlighter, T) => void>;
  constructor() {
    this.delegates = [];
  }
  addListener(callback: (Highlighter, T) => void) {
    this.delegates.push(callback);
  }
  raise(highlighter: Highlighter, eventArgs: T) {
    for (const delegate of this.delegates) delegate(highlighter, eventArgs);
  }
}

export const BeforeHighlightNodeEvent: EventClass<BeforeHighlightNodeEventArgs> = new EventClass();

export const BeforeHighlightEvent: EventClass<BeforeHighlightEventArgs> = new EventClass();

export const BeforeTokenizeEvent: EventClass<BeforeTokenizeEventArgs> = new EventClass();

export const AfterTokenizeEvent: EventClass<AfterTokenizeEventArgs> = new EventClass();

export const BeforeAnalyzeEvent: EventClass<BeforeAnalyzeEventArgs> = new EventClass();

export const AfterAnalyzeEvent: EventClass<AfterAnalyzeEventArgs> = new EventClass();

export const AfterHighlightEvent: EventClass<AfterHighlightEventArgs> = new EventClass();

export const AfterHighlightNodeEvent: EventClass<AfterHighlightNodeEventArgs> = new EventClass();
