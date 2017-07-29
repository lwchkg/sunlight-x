// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { regexEscape } from "./util.js";
import { defaultAnalyzer, defaultNumberParser } from "./default-helpers.js";

import type { Analyzer } from "./analyzer.js";
import type { AnalyzerContext } from "./analyzer-context.js";
import type { ParserContext } from "./parser-context.js";
import type { Token } from "./token.js";

export type { ParserContext, Token };

export type ScopeType = [
  string,
  string | { length: number, regex: RegExp },
  string[],
  boolean
];
export type ContextItemsType = { [string]: mixed | mixed[] };

export type EmbeddedLanguageDefinitionPrecompiled = {|
  switchTo: ParserContext => boolean,
  switchBack: ParserContext => boolean
|};

export type EmbeddedLanguageListPrecompiled = {
  [string]: EmbeddedLanguageDefinitionPrecompiled
};

export type EmbeddedLanguageDefinition = {|
  parentLanguage: string,
  language: string,
  switchTo: ParserContext => boolean,
  switchBack: ParserContext => boolean,
  oldItems: ContextItemsType
|};

export type FollowsOrPrecedesIdentRuleUnit = {|
  token: string,
  values?: string[],
  optional?: boolean
|};

export type FollowsOrPrecedesIdentRule = FollowsOrPrecedesIdentRuleUnit[];

export type BetweenIdentRule = {|
  opener: {| token: string, values?: string[] |},
  closer: {| token: string, values?: string[] |}
|};

export type CustomIdentRule = { (AnalyzerContext): boolean };

export type CustomParseRule = { (ParserContext): ?Token | Token[] };

export type HashMapType = {
  [string]: { value: string, regex: RegExp }[]
};

export type Language = {
  name: string,
  analyzer: Analyzer,
  customTokens: { [string]: HashMapType },
  operators: HashMapType,
  keywords: HashMapType,
  namedIdentRules: {|
    follows: FollowsOrPrecedesIdentRule[],
    precedes: FollowsOrPrecedesIdentRule[],
    between: BetweenIdentRule[],
    custom: CustomIdentRule[]
  |},
  punctuation: RegExp,
  numberParser: ParserContext => ?Token,
  caseInsensitive: boolean,
  doNotParse: RegExp,
  contextItems: ContextItemsType,
  embeddedLanguages: EmbeddedLanguageDefinition[],
  customParseRules: CustomParseRule[],
  scopes: { [string]: ScopeType[] },
  identFirstLetter: RegExp,
  identAfterFirstLetter: RegExp
};

export const languages: { [string]: Language } = {};

/**
 * Creates a hash map from the given array. This is crucial for performance.
 *
 * @param {string[]} wordMap An array of strings to hash.
 * @param {string} boundary A regular expression representing the boundary of
 *                          each string (e.g. "\\b")
 * @param {boolean|undefined} caseInsensitive Indicates if the words are case
 *                            insensitive (defaults to false)
 * @returns {Object} Each string in the array is hashed by its first letter. The
 *                   value is transformed into an object with properties value
 *                   (the original value) and a regular expression to match the
 *                   word.
 */
export function createHashMap(
  wordMap: string[],
  boundary: string,
  caseInsensitive: boolean = false
): HashMapType {
  // creates a hash table where the hash is the first character of the word
  const newMap: { [string]: { value: string, regex: RegExp }[] } = {};
  for (let i = 0; i < wordMap.length; i++) {
    const word = caseInsensitive ? wordMap[i].toUpperCase() : wordMap[i];
    const firstChar = word.charAt(0);
    if (!newMap[firstChar]) newMap[firstChar] = [];

    newMap[firstChar].push({
      value: word,
      // TODO: rewrite expression once Flow issue #4435 is fixed.
      regex: caseInsensitive
        ? new RegExp("^" + regexEscape(word) + boundary, "i")
        : new RegExp("^" + regexEscape(word) + boundary)
    });
  }

  return newMap;
}

export type EmbeddedLanguageDefinitionBeforeCompile = {|
  switchTo: ParserContext => boolean,
  switchBack: ParserContext => boolean
|};

export type LanguageBeforeCompile = {
  name?: string,
  analyzer?: Analyzer,
  customTokens?: { [string]: {| values: string[], boundary: string |} },
  operators?: string[],
  keywords?: string[],
  namedIdentRules?: {|
    follows?: FollowsOrPrecedesIdentRule[],
    precedes?: FollowsOrPrecedesIdentRule[],
    between?: BetweenIdentRule[],
    custom?: CustomIdentRule[]
  |},
  punctuation?: RegExp,
  numberParser?: ParserContext => ?Token,
  caseInsensitive?: boolean,
  doNotParse?: RegExp,
  contextItems?: ContextItemsType,
  embeddedLanguages?: { [string]: EmbeddedLanguageDefinitionBeforeCompile },
  customParseRules?: CustomParseRule[],
  scopes?: { [string]: ScopeType[] },
  identFirstLetter?: RegExp,
  identAfterFirstLetter?: RegExp
};

/**
 * Register a language to the highlighter.
 * @param {Object} languageData
 */
export function registerLanguage(languageData: LanguageBeforeCompile) {
  const parsedLanguage: Language = {
    analyzer: languageData.analyzer || new defaultAnalyzer(),
    caseInsensitive: languageData.caseInsensitive || false,
    contextItems: languageData.contextItems || {},
    customParseRules: languageData.customParseRules || [],
    customTokens: {}, // initializer later
    doNotParse: languageData.doNotParse || /\s/,
    embeddedLanguages: [],
    identAfterFirstLetter: languageData.identAfterFirstLetter || /(?!x)x/,
    identFirstLetter: languageData.identFirstLetter || /(?!x)x/,
    keywords: {}, // initializer later
    name: languageData.name || "",
    namedIdentRules: (languageData.namedIdentRules && {
      follows: languageData.namedIdentRules.follows || [],
      precedes: languageData.namedIdentRules.precedes || [],
      between: languageData.namedIdentRules.between || [],
      custom: languageData.namedIdentRules.custom || []
    }) || { follows: [], precedes: [], between: [], custom: [] },
    numberParser: languageData.numberParser || defaultNumberParser,
    operators: {}, // initializer later
    punctuation: languageData.punctuation || /[^\w\s]/,
    scopes: languageData.scopes || {}
  };
  // Transform keywords, operators and custom tokens into a hash map.
  parsedLanguage.keywords = createHashMap(
    languageData.keywords || [],
    "\\b",
    languageData.caseInsensitive
  );

  parsedLanguage.operators = createHashMap(
    languageData.operators || [],
    "",
    languageData.caseInsensitive
  );

  for (const tokenName in languageData.customTokens)
    parsedLanguage.customTokens[tokenName] = createHashMap(
      languageData.customTokens[tokenName].values
        ? languageData.customTokens[tokenName].values
        : [],
      languageData.customTokens[tokenName].boundary,
      languageData.caseInsensitive
    );

  // Convert the embedded language object to an easier-to-use array.
  const embeddedLanguages: EmbeddedLanguageDefinition[] = [];
  for (const languageName in languageData.embeddedLanguages)
    embeddedLanguages.push({
      parentLanguage: languageData.name || "",
      language: languageName,
      switchTo: languageData.embeddedLanguages[languageName].switchTo,
      switchBack: languageData.embeddedLanguages[languageName].switchBack,
      oldItems: {}
    });

  parsedLanguage.embeddedLanguages = embeddedLanguages;

  languages[parsedLanguage.name] = parsedLanguage;
}

/**
 * Query if an language is registered to the highlighter.
 * @param {string} languageId
 * @returns {boolean}
 */
export function isRegistered(languageId: string): boolean {
  return languages[languageId] !== undefined;
}
