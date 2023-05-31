// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { Highlighter } from "./highlighter";
import { registerLanguages } from "./register-languages";
import "./load-plugins";
import type { SunlightPartialOptionsType } from "./globalOptions";
// Exports
export { defaultAnalyzer } from "./default-helpers";
export { globalOptions } from "./globalOptions";
export { registerLanguage, isRegistered } from "./languages";
export { Highlighter };
export { getCSSSync } from "./styles";

/**
 * Highlight all code matching the given or default class prefix.
 * @param {SunlightPartialOptionsType} options
 */
export function highlightAll(options: SunlightPartialOptionsType) {
  const highlighter = new Highlighter(options);

  for (const node of highlighter.getAllHighlightableNodes()) highlighter.highlightNode(node);
}
// Highlighter initialization
registerLanguages();