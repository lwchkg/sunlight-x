import {merge, createHashMap} from './util.js';
import {defaultAnalyzer, defaultNumberParser} from './default-helpers.js';

const languageDefaults = Object.freeze({
  analyzer: new defaultAnalyzer(),
  customTokens: [],
  namedIdentRules: {},
  punctuation: /[^\w\s]/,
  numberParser: defaultNumberParser,
  caseInsensitive: false,
  doNotParse: /\s/,
  contextItems: {},
  embeddedLanguages: {},
});

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [0, 1, 3] }]*/

export const languages = {};

export function registerLanguage(languageId, languageData) {
  let tokenName, languageName;

  if (!languageId) {
    throw new Error(
      'Languages must be registered with an identifier, e.g. "php" for PHP'
    );
  }

  languageData = merge(merge({}, languageDefaults), languageData);
  languageData.name = languageId;

  // transform keywords, operators and custom tokens into a hash map
  languageData.keywords = createHashMap(
    languageData.keywords || [],
    '\\b',
    languageData.caseInsensitive
  );
  languageData.operators = createHashMap(
    languageData.operators || [],
    '',
    languageData.caseInsensitive
  );
  for (tokenName in languageData.customTokens) {
    languageData.customTokens[tokenName] = createHashMap(
      languageData.customTokens[tokenName].values
        ? languageData.customTokens[tokenName].values
        : [],
      languageData.customTokens[tokenName].boundary,
      languageData.caseInsensitive
    );
  }

  // convert the embedded language object to an easier-to-use array
  const embeddedLanguages = [];
  for (languageName in languageData.embeddedLanguages) {
    embeddedLanguages.push({
      parentLanguage: languageData.name,
      language: languageName,
      switchTo: languageData.embeddedLanguages[languageName].switchTo,
      switchBack: languageData.embeddedLanguages[languageName].switchBack,
    });
  }

  languageData.embeddedLanguages = embeddedLanguages;

  languages[languageData.name] = languageData;
}

export function isRegistered(languageId) {
  return languages[languageId] !== undefined;
}
