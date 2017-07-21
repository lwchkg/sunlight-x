// @flow

import { document } from "./jsdom.js";

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/

/**
 * Gets the last element in an array.
 * @param {Array} arr
 * @returns {*}
 */
export function lastElement<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

/**
 * Gets the last character in a string
 * @param {string} s
 * @returns {string}
 */
export function lastChar(s: string): string {
  return s.charAt(s.length - 1);
}

/**
 * Escape a string for the use as a RegExp pattern.
 * See http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
 * @param {string} s The string to escape
 * @returns {string}
 */
export function regexEscape(s: string): string {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

// TODO: remove IE hack
const isIe = !+"\v1";

/**
 * The EOL character ("\r" on IE, "\n" otherwise)
 */
export const eol = isIe ? "\r" : "\n";

// non-recursively merges one object into the other
// TODO: remove because this is possible a polyfill
export function merge<T: {}>(defaultObject: T, objectToMerge: T): T {
  if (!objectToMerge) return defaultObject;

  for (const key in objectToMerge) defaultObject[key] = objectToMerge[key];

  return defaultObject;
}

/**
 * Returns a shallow clone of an object.
 * @param {Object} object
 * @returns {Object}
 */
export function clone<T: {}>(object: T): T {
  return Object.assign({}, object);
}

/**
 * Array of default string escape sequences.
 */
export const escapeSequences = ["\\n", "\\t", "\\r", "\\\\", "\\v", "\\f"];

/**
 * Returns if the array contains the value.
 * @param {Array} arr The haystack
 * @param {*} value The needle
 * @param {boolean|undefined} caseInsensitive Set to true to enable case insensitivity.
 * @returns {boolean}
 */
export function contains<T>(
  arr: T[],
  value: T,
  caseInsensitive: boolean = false
): boolean {
  if (!caseInsensitive) return arr.indexOf(value) >= 0;

  return arr.some(
    (element: T): boolean =>
      element === value ||
      (caseInsensitive &&
        typeof element === "string" &&
        typeof value === "string" &&
        element.toUpperCase() === value.toUpperCase())
  );
}

/**
 * Determines if a word in the word map matches the current context. This should
 * be used from a custom parse rule.
 * @param {object} context The parse context
 * @param {object} wordMap A hashmap returned by createHashMap
 * @param {string} tokenName The name of the token to create
 * @param {boolean|undefined} doNotRead Whether or not to advance the internal pointer
 * @returns {object} A token returned from context.createToken
 */
export function matchWord(
  context,
  wordMap,
  tokenName: string,
  doNotRead: boolean = false
) {
  const line = context.reader.getLine();
  const column = context.reader.getColumn();
  wordMap = wordMap || [];

  let current = context.reader.current();
  if (context.language.caseInsensitive) current = current.toUpperCase();

  if (!wordMap[current]) return null;

  wordMap = wordMap[current];

  const index = wordMap.findIndex(wordItem => {
    const word = wordItem.value;
    const peek = current + context.reader.peek(word.length);
    return word === peek || wordItem.regex.test(peek);
  });

  if (index >= 0)
    return context.createToken(
      tokenName,
      context.reader.current() +
        context.reader[doNotRead ? "peek" : "read"](
          wordMap[index].value.length - 1
        ),
      line,
      column
    );

  return null;
}

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
  boundary: RegExp,
  caseInsensitive: boolean = false
) {
  // creates a hash table where the hash is the first character of the word
  const newMap = {};
  for (let i = 0; i < wordMap.length; i++) {
    const word = caseInsensitive ? wordMap[i].toUpperCase() : wordMap[i];
    const firstChar = word.charAt(0);
    if (!newMap[firstChar]) newMap[firstChar] = [];

    newMap[firstChar].push({
      value: word,
      regex: new RegExp(
        "^" + regexEscape(word) + boundary,
        caseInsensitive ? "i" : ""
      )
    });
  }

  return newMap;
}

/**
 * Creates a between rule
 *
 * @param {number} startIndex The index at which to start examining the tokens.
 * @param {object} opener { token: "tokenName", values: ["token", "values"] }
 * @param {object} closer { token: "tokenName", values: ["token", "values"] }
 * @param {boolean|undefined} caseInsensitive Indicates whether the token values
 *                                            are case insensitive.
 * @returns {function} Accepts an array of tokens as the single parameter and
 *                     returns a boolean.
 */
export function createBetweenRule(
  startIndex: number,
  opener,
  closer,
  caseInsensitive: boolean = false
) {
  return function(tokens) {
    // check to the left: if we run into a closer or never run into an opener, fail
    let token;
    let success = false;
    let index = startIndex;
    while ((token = tokens[--index]) !== undefined) {
      if (
        token.name === opener.token &&
        contains(opener.values, token.value, caseInsensitive)
      ) {
        success = true;
        break;
      }

      if (
        token.name === closer.token &&
        contains(closer.values, token.value, caseInsensitive)
      )
        return false;
    }

    if (!success) return false;

    // check to the right for the closer
    index = startIndex;
    while ((token = tokens[++index]) !== undefined) {
      if (
        token.name === closer.token &&
        contains(closer.values, token.value, caseInsensitive)
      )
        return true;

      if (
        token.name === opener.token &&
        contains(opener.values, token.value, caseInsensitive)
      )
        return false;
    }

    // TODO: Verify because this is suspecious.
    return true;
  };
}

/**
 * Creates a follows or precedes rule
 * @param {number} startIndex The index at which to start examining the tokens.
 * @param {number} direction 1 for follows, -1 for precedes
 * @param {Array} tokenRequirements Array of token requirements, same as namedIdentRules.follows
 * @param {boolean|undefined} caseInsensitive Indicates whether the token values are case insensitive
 * @returns {function} Accepts an array of tokens as the single parameter and returns a boolean
 */
export function createProceduralRule(
  startIndex: number,
  direction: number,
  tokenRequirements,
  caseInsensitive: ?boolean
) {
  tokenRequirements = tokenRequirements.slice(0); // clone array
  // TODO: verify. Probably were buggy.
  if (direction === 1) tokenRequirements.reverse();

  return function(tokens) {
    let tokenIndexStart = startIndex;

    for (let j = 0; j < tokenRequirements.length; j++) {
      const actual = tokens[tokenIndexStart + j * direction];
      const expected = tokenRequirements[tokenRequirements.length - 1 - j];

      if (actual === undefined)
        if (expected.optional !== undefined && expected.optional)
          tokenIndexStart -= direction;
        else return false;
      else if (
        actual.name === expected.token &&
        (expected.values === undefined ||
          contains(expected.values, actual.value, caseInsensitive))
      )
        // derp
        continue;
      else if (expected.optional !== undefined && expected.optional)
        tokenIndexStart -= direction; // we need to reevaluate against this token again
      else return false;
    }

    return true;
  };
}

// gets the next token in the specified direction while matcher matches the current token
function getNextWhileInternal(tokens, index, direction, matcher) {
  direction = direction || 1;
  let count = 1;
  let token;
  while ((token = tokens[index + direction * count++]))
    if (!matcher(token)) return token;

  return undefined;
}

/**
 * Gets the next token while the matcher returns true.
 * @param {Array} tokens Array of tokens
 * @param {number} index The index at which to start
 * @param {function} matcher Predicate for determining if the token matches
 * @returns {Object} The token or undefined
 */
export function getNextWhile(tokens, index, matcher) {
  return getNextWhileInternal(tokens, index, 1, matcher);
}

/**
 * Gets the next non-whitespace token. This is not safe for looping.
 * @param {Array} tokens Array of tokens
 * @param {number} index  The index at which to start
 * @returns {Object} The token or undefined
 */
export function getNextNonWsToken(tokens, index) {
  return getNextWhileInternal(
    tokens,
    index,
    1,
    token => token.name === "default"
  );
}

/**
 * Gets the previous non-whitespace token. This is not safe for looping.
 * @param {Array} tokens Array of tokens
 * @param {number} index  The index at which to start
 * @returns {Object} The token or undefined
 */
export function getPreviousNonWsToken(tokens, index) {
  return getNextWhileInternal(
    tokens,
    index,
    -1,
    token => token.name === "default"
  );
}

/**
 * Gets the previous token while the matcher returns true.
 * @param {Array} tokens Array of tokens
 * @param {number} index The index at which to start
 * @param {function} matcher Predicate for determining if the token matches
 * @returns {Object} The token or undefined
 */
export function getPreviousWhile(tokens, index, matcher) {
  return getNextWhileInternal(tokens, index, -1, matcher);
}

/**
 * An object to be used in named ident rules to indicate optional whitespace
 */
export const whitespace = { token: "default", optional: true };

/**
 * Gets the computed style of the element
 * Adapted from http://blargh.tommymontgomery.com/2010/04/get-computed-style-in-javascript/
 * @param {HTMLElement} element A DOM element
 * @param {string} style The name of the CSS style to retrieve
 * @returns {string}
 */
export function getComputedStyle(element: Element, style: string): string {
  let func = null;
  if (document.defaultView && document.defaultView.getComputedStyle)
    func = document.defaultView.getComputedStyle;
  else
    func = function(element: HTMLElement): Object {
      // TODO: Remove (IE compatibility)
      return element.currentStyle || {};
    };

  return func(element, null)[style];
}
