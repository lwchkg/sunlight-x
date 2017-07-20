// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

import { createHashMap } from "./util.js";
import { defaultAnalyzer, defaultNumberParser } from "./default-helpers.js";

const languageDefaults = Object.freeze({
  analyzer: new defaultAnalyzer(),
  customTokens: [],
  namedIdentRules: {},
  punctuation: /[^\w\s]/,
  numberParser: defaultNumberParser,
  caseInsensitive: false,
  doNotParse: /\s/,
  contextItems: {},
  embeddedLanguages: {}
});

export const languages = {};

/**
 * Register a language to the highlighter.
 * @param {Object} languageData
 */
export function registerLanguage(languageData) {
  languageData = Object.assign({}, languageDefaults, languageData);

  // Transform keywords, operators and custom tokens into a hash map.
  languageData.keywords = createHashMap(
    languageData.keywords || [],
    "\\b",
    languageData.caseInsensitive
  );

  languageData.operators = createHashMap(
    languageData.operators || [],
    "",
    languageData.caseInsensitive
  );

  for (const tokenName in languageData.customTokens)
    languageData.customTokens[tokenName] = createHashMap(
      languageData.customTokens[tokenName].values
        ? languageData.customTokens[tokenName].values
        : [],
      languageData.customTokens[tokenName].boundary,
      languageData.caseInsensitive
    );

  // Convert the embedded language object to an easier-to-use array.
  const embeddedLanguages = [];
  for (const languageName in languageData.embeddedLanguages)
    embeddedLanguages.push({
      parentLanguage: languageData.name,
      language: languageName,
      switchTo: languageData.embeddedLanguages[languageName].switchTo,
      switchBack: languageData.embeddedLanguages[languageName].switchBack
    });

  languageData.embeddedLanguages = embeddedLanguages;

  languages[languageData.name] = languageData;
}

/**
 * Query if an language is registered to the highlighter.
 * @param {string} languageId
 * @returns {boolean}
 */
export function isRegistered(languageId) {
  return languages[languageId] !== undefined;
}
