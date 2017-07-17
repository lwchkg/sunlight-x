/**
 * Sunlight
 *    Intelligent syntax highlighting
 *
 * http://sunlightjs.com/
 *
 * by Tommy Montgomery <http://tmont.com>
 * Licensed under WTFPL <http://sam.zoy.org/wtfpl/>
 */

import * as util from './util.js';
import {events, globalOptions} from './constants.js';
import {languages} from './globals.js';
import {Highlighter} from './highlighter.js';
import {RegisterLanguages} from './register-languages.js';
import {defaultAnalyzer, defaultNumberParser} from './default-helpers.js';

import {jsdom} from 'jsdom';
const document = jsdom('', {});

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

// public facing object
export const Sunlight = {
  version: '1.22.0',
  Highlighter: Highlighter,
  createAnalyzer: function() {
    return new defaultAnalyzer();
  },
  globalOptions: globalOptions,

  highlightAll: function(options) {
    const highlighter = new Highlighter(options);
    const tags = document.getElementsByTagName('*');
    for (let i = 0; i < tags.length; i++)
      highlighter.highlightNode(tags[i]);
  },

  registerLanguage: function(languageId, languageData) {
    let tokenName, languageName;

    if (!languageId) {
      throw new Error(
        'Languages must be registered with an identifier, e.g. "php" for PHP'
      );
    }

    languageData = util.merge(util.merge({}, languageDefaults), languageData);
    languageData.name = languageId;

    // transform keywords, operators and custom tokens into a hash map
    languageData.keywords = util.createHashMap(
      languageData.keywords || [],
      '\\b',
      languageData.caseInsensitive
    );
    languageData.operators = util.createHashMap(
      languageData.operators || [],
      '',
      languageData.caseInsensitive
    );
    for (tokenName in languageData.customTokens) {
      languageData.customTokens[tokenName] = util.createHashMap(
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
  },

  isRegistered: function(languageId) {
    return languages[languageId] !== undefined;
  },

  bind: function(event, callback) {
    if (!events[event]) throw new Error('Unknown event "' + event + '"');

    events[event].push(callback);
  },
};

RegisterLanguages(Sunlight);
