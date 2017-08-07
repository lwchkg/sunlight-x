// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { Highlighter } from "./highlighter.js";
import { registerLanguages } from "./register-languages.js";

import {} from "./load-plugins.js";

import type { SunlightPartialOptionsType } from "./globalOptions.js";

// Exports
export { defaultAnalyzer } from "./default-helpers.js";
export { globalOptions } from "./globalOptions.js";
export { registerLanguage, isRegistered } from "./languages.js";
export { Highlighter };

/**
 * Highlight all code matching the given or default class prefix.
 * @param {SunlightPartialOptionsType} options
 */
export function highlightAll(options: SunlightPartialOptionsType) {
  const highlighter = new Highlighter(options);
  for (const node of highlighter.getAllHighlightableNodes())
    highlighter.highlightNode(node);
}

// Highlighter initialization
registerLanguages();
