'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sunlight = undefined;

var _util = require('./util.js');

var util = _interopRequireWildcard(_util);

var _constants = require('./constants.js');

var _globals = require('./globals.js');

var _highlighter = require('./highlighter.js');

var _registerLanguages = require('./register-languages.js');

var _jsdom = require('jsdom');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Sunlight
 *    Intelligent syntax highlighting
 *
 * http://sunlightjs.com/
 *
 * by Tommy Montgomery <http://tmont.com>
 * Licensed under WTFPL <http://sam.zoy.org/wtfpl/>
 */

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/

var document = (0, _jsdom.jsdom)('', {});

function defaultHandleToken(suffix) {
  return function (context) {
    var element = document.createElement('span');
    element.className = context.options.classPrefix + suffix;
    element.appendChild(context.createTextNode(context.tokens[context.index]));
    return context.addNode(element) || true;
  };
}

class defaultAnalyzer {
  handleToken(context) {
    return defaultHandleToken(context.tokens[context.index].name)(context);
  }

  // TODO: clean up!!!
  // just append default content as a text node
  handle_default(context) {
    return context.addNode(context.createTextNode(context.tokens[context.index]));
  }

  // this handles the named ident mayhem
  handle_ident(context) {
    var evaluate = function evaluate(rules, createRule) {
      var i = void 0;
      rules = rules || [];
      for (i = 0; i < rules.length; i++) {
        if (typeof rules[i] === 'function') {
          if (rules[i](context)) return defaultHandleToken('named-ident')(context);
        } else if (createRule && createRule(rules[i])(context.tokens)) {
          return defaultHandleToken('named-ident')(context);
        }
      }

      return false;
    };

    return evaluate(context.language.namedIdentRules.custom) || evaluate(context.language.namedIdentRules.follows, function (ruleData) {
      return util.createProceduralRule(context.index - 1, -1, ruleData, context.language.caseInsensitive);
    }) || evaluate(context.language.namedIdentRules.precedes, function (ruleData) {
      return util.createProceduralRule(context.index + 1, 1, ruleData, context.language.caseInsensitive);
    }) || evaluate(context.language.namedIdentRules.between, function (ruleData) {
      return util.createBetweenRule(context.index, ruleData.opener, ruleData.closer, context.language.caseInsensitive);
    }) || defaultHandleToken('ident')(context);
  }
}

function defaultNumberParser(context) {
  var current = context.reader.current();
  var line = context.reader.getLine();
  var column = context.reader.getColumn();

  var number = void 0;
  var allowDecimal = true;
  if (!/\d/.test(current)) {
    // is it a decimal followed by a number?
    if (current !== '.' || !/\d/.test(context.reader.peek())) return null;

    // decimal without leading zero
    number = current + context.reader.read();
    allowDecimal = false;
  } else {
    number = current;
    if (current === '0' && context.reader.peek() !== '.') {
      // hex or octal
      allowDecimal = false;
    }
  }

  // easy way out: read until it's not a number or letter
  // this will work for hex (0xef), octal (012), decimal and scientific notation (1e3)
  // anything else and you're on your own

  var peek = void 0;
  while ((peek = context.reader.peek()) !== context.reader.EOF) {
    if (!/[A-Za-z0-9]/.test(peek)) {
      if (peek === '.' && allowDecimal && /\d$/.test(context.reader.peek(2))) {
        number += context.reader.read();
        allowDecimal = false;
        continue;
      }
      break;
    }
    number += context.reader.read();
  }
  return context.createToken('number', number, line, column);
}

var languageDefaults = Object.freeze({
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

// public facing object
var Sunlight = exports.Sunlight = {
  version: '1.22.0',
  Highlighter: _highlighter.Highlighter,
  createAnalyzer: function createAnalyzer() {
    return new defaultAnalyzer();
  },
  globalOptions: _constants.globalOptions,

  highlightAll: function highlightAll(options) {
    var highlighter = new _highlighter.Highlighter(options);
    var tags = document.getElementsByTagName('*');
    for (var i = 0; i < tags.length; i++) {
      highlighter.highlightNode(tags[i]);
    }
  },

  registerLanguage: function registerLanguage(languageId, languageData) {
    var tokenName = void 0,
        languageName = void 0;

    if (!languageId) {
      throw new Error('Languages must be registered with an identifier, e.g. "php" for PHP');
    }

    languageData = util.merge(util.merge({}, languageDefaults), languageData);
    languageData.name = languageId;

    // transform keywords, operators and custom tokens into a hash map
    languageData.keywords = util.createHashMap(languageData.keywords || [], '\\b', languageData.caseInsensitive);
    languageData.operators = util.createHashMap(languageData.operators || [], '', languageData.caseInsensitive);
    for (tokenName in languageData.customTokens) {
      languageData.customTokens[tokenName] = util.createHashMap(languageData.customTokens[tokenName].values ? languageData.customTokens[tokenName].values : [], languageData.customTokens[tokenName].boundary, languageData.caseInsensitive);
    }

    // convert the embedded language object to an easier-to-use array
    var embeddedLanguages = [];
    for (languageName in languageData.embeddedLanguages) {
      embeddedLanguages.push({
        parentLanguage: languageData.name,
        language: languageName,
        switchTo: languageData.embeddedLanguages[languageName].switchTo,
        switchBack: languageData.embeddedLanguages[languageName].switchBack
      });
    }

    languageData.embeddedLanguages = embeddedLanguages;

    _globals.languages[languageData.name] = languageData;
  },

  isRegistered: function isRegistered(languageId) {
    return _globals.languages[languageId] !== undefined;
  },

  bind: function bind(event, callback) {
    if (!_constants.events[event]) throw new Error('Unknown event "' + event + '"');

    _constants.events[event].push(callback);
  }
};

(0, _registerLanguages.RegisterLanguages)(Sunlight);