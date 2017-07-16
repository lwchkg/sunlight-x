'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.last = last;
exports.regexEscape = regexEscape;
exports.merge = merge;
exports.clone = clone;
exports.contains = contains;
exports.matchWord = matchWord;
exports.createHashMap = createHashMap;
exports.createBetweenRule = createBetweenRule;
exports.createProceduralRule = createProceduralRule;
exports.getNextWhile = getNextWhile;
exports.getNextNonWsToken = getNextNonWsToken;
exports.getPreviousNonWsToken = getPreviousNonWsToken;
exports.getPreviousWhile = getPreviousWhile;
exports.getComputedStyle = getComputedStyle;
var jsdom = require('jsdom').jsdom;
var document = jsdom('', {});

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/

// gets the last character in a string or the last element in an array
function last(thing) {
  return thing.charAt ? thing.charAt(thing.length - 1) : thing[thing.length - 1];
}

// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
function regexEscape(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// TODO: remove IE hack
var isIe = !+'\v1';
var eol = exports.eol = isIe ? '\r' : '\n';

// non-recursively merges one object into the other
// TODO: remove because this is possible a polyfill
function merge(defaultObject, objectToMerge) {
  var key = void 0;
  if (!objectToMerge) return defaultObject;

  for (key in objectToMerge) {
    defaultObject[key] = objectToMerge[key];
  }return defaultObject;
}

function clone(object) {
  return merge({}, object);
}

var escapeSequences = exports.escapeSequences = ['\\n', '\\t', '\\r', '\\\\', '\\v', '\\f'];

// array.contains()
function contains(arr, value, caseInsensitive) {
  var i = void 0;
  if (arr.indexOf && !caseInsensitive) return arr.indexOf(value) >= 0;

  for (i = 0; i < arr.length; i++) {
    if (arr[i] === value) return true;

    if (caseInsensitive && typeof arr[i] === 'string' && typeof value === 'string' && arr[i].toUpperCase() === value.toUpperCase()) return true;
  }

  return false;
}

function matchWord(context, wordMap, tokenName, doNotRead) {
  var current = context.reader.current();
  var i = void 0,
      word = void 0,
      peek = void 0;
  var line = context.reader.getLine();
  var column = context.reader.getColumn();

  wordMap = wordMap || [];
  if (context.language.caseInsensitive) current = current.toUpperCase();

  if (!wordMap[current]) return null;

  wordMap = wordMap[current];
  for (i = 0; i < wordMap.length; i++) {
    word = wordMap[i].value;

    peek = current + context.reader.peek(word.length);
    if (word === peek || wordMap[i].regex.test(peek)) {
      return context.createToken(tokenName, context.reader.current() + context.reader[doNotRead ? 'peek' : 'read'](word.length - 1), line, column);
    }
  }

  return null;
}

// this is crucial for performance
function createHashMap(wordMap, boundary, caseInsensitive) {
  // creates a hash table where the hash is the first character of the word
  var newMap = {};
  for (var i = 0; i < wordMap.length; i++) {
    var word = caseInsensitive ? wordMap[i].toUpperCase() : wordMap[i];
    var firstChar = word.charAt(0);
    if (!newMap[firstChar]) newMap[firstChar] = [];

    newMap[firstChar].push({
      value: word,
      regex: new RegExp('^' + regexEscape(word) + boundary, caseInsensitive ? 'i' : '')
    });
  }

  return newMap;
}

function createBetweenRule(startIndex, opener, closer, caseInsensitive) {
  return function (tokens) {
    var index = startIndex,
        token = void 0,
        success = false;

    // check to the left: if we run into a closer or never run into an opener, fail
    while ((token = tokens[--index]) !== undefined) {
      if (token.name === closer.token && contains(closer.values, token.value)) {
        if (token.name === opener.token && contains(opener.values, token.value, caseInsensitive)) {
          // if the closer is the same as the opener that's okay
          success = true;
          break;
        }

        return false;
      }

      if (token.name === opener.token && contains(opener.values, token.value, caseInsensitive)) {
        success = true;
        break;
      }
    }

    if (!success) return false;

    // check to the right for the closer
    index = startIndex;
    while ((token = tokens[++index]) !== undefined) {
      if (token.name === opener.token && contains(opener.values, token.value, caseInsensitive)) {
        if (token.name === closer.token && contains(closer.values, token.value, caseInsensitive)) {
          // if the closer is the same as the opener that's okay
          success = true;
          break;
        }

        return false;
      }

      if (token.name === closer.token && contains(closer.values, token.value, caseInsensitive)) {
        success = true;
        break;
      }
    }

    return success;
  };
}

function createProceduralRule(startIndex, direction, tokenRequirements, caseInsensitive) {
  tokenRequirements = tokenRequirements.slice(0);
  return function (tokens) {
    var tokenIndexStart = startIndex,
        j = void 0,
        expected = void 0,
        actual = void 0;

    if (direction === 1) tokenRequirements.reverse();

    for (j = 0; j < tokenRequirements.length; j++) {
      actual = tokens[tokenIndexStart + j * direction];
      expected = tokenRequirements[tokenRequirements.length - 1 - j];

      if (actual === undefined) {
        if (expected.optional !== undefined && expected.optional) tokenIndexStart -= direction;else return false;
      } else if (actual.name === expected.token && (expected.values === undefined || contains(expected.values, actual.value, caseInsensitive))) {
        // derp
        continue;
      } else if (expected.optional !== undefined && expected.optional) {
        tokenIndexStart -= direction; // we need to reevaluate against this token again
      } else {
        return false;
      }
    }

    return true;
  };
}

function getNextWhile(tokens, index, matcher) {
  return getNextWhile(tokens, index, 1, matcher);
}

function getNextNonWsToken(tokens, index) {
  return getNextWhile(tokens, index, 1, function (token) {
    return token.name === 'default';
  });
}

function getPreviousNonWsToken(tokens, index) {
  return getNextWhile(tokens, index, -1, function (token) {
    return token.name === 'default';
  });
}

function getPreviousWhile(tokens, index, matcher) {
  return getNextWhile(tokens, index, -1, matcher);
}

var whitespace = exports.whitespace = { token: 'default', optional: true };

// adapted from http://blargh.tommymontgomery.com/2010/04/get-computed-style-in-javascript/
function getComputedStyle() {
  var func = null;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    func = document.defaultView.getComputedStyle;
  } else {
    func = function func(element) {
      return element.currentStyle || {};
    };
  }

  return function (element, style) {
    return func(element, null)[style];
  };
}