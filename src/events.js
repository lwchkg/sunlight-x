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

// TODO: reformat after prettier recognize flow
type BeforeHighlightNodeEventType = EventClass<BeforeHighlightNodeEventArgs>;
export const BeforeHighlightNodeEvent: BeforeHighlightNodeEventType = new EventClass();

type BeforeHighlightEventType = EventClass<BeforeHighlightEventArgs>;
export const BeforeHighlightEvent: BeforeHighlightEventType = new EventClass();

type BeforeTokenizeEventType = EventClass<BeforeTokenizeEventArgs>;
export const BeforeTokenizeEvent: BeforeTokenizeEventType = new EventClass();

type AfterTokenizeEventType = EventClass<AfterTokenizeEventArgs>;
export const AfterTokenizeEvent: AfterTokenizeEventType = new EventClass();

type BeforeAnalyzeEventType = EventClass<BeforeAnalyzeEventArgs>;
export const BeforeAnalyzeEvent: BeforeAnalyzeEventType = new EventClass();

type AfterAnalyzeEventType = EventClass<AfterAnalyzeEventArgs>;
export const AfterAnalyzeEvent: AfterAnalyzeEventType = new EventClass();

type AfterHighlightEventType = EventClass<AfterHighlightEventArgs>;
export const AfterHighlightEvent: AfterHighlightEventType = new EventClass();

type AfterHighlightNodeEventType = EventClass<AfterHighlightNodeEventArgs>;
export const AfterHighlightNodeEvent: AfterHighlightNodeEventType = new EventClass();
