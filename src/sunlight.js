// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow

import { Highlighter } from "./highlighter.js";
import { registerLanguages } from "./register-languages.js";
import { defaultAnalyzer } from "./default-helpers.js";
import {} from "./load-plugins.js";
import { document } from "./jsdom.js";

import type { SunlightPartialOptionsType } from "./globalOptions.js";

/* eslint require-jsdoc: 0 */

// Exports
export const version = "1.22.0";

export { globalOptions } from "./globalOptions.js";

export { registerLanguage, isRegistered } from "./languages.js";

export { Highlighter };

export function createAnalyzer() {
  return new defaultAnalyzer();
}

export function highlightAll(options: SunlightPartialOptionsType) {
  const highlighter = new Highlighter(options);
  const tags = document.getElementsByTagName("*");
  for (let i = 0; i < tags.length; i++) highlighter.highlightNode(tags[i]);
}

export { bind } from "./events.js";

// Highlighter initialization
registerLanguages();
