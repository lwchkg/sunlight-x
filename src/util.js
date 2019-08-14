// @flow
import { document } from "./jsdom.js";

import type { FollowsOrPrecedesIdentRule, HashMapType } from "./languages.js";
import type { ParserContext } from "./parser-context.js";
import type { Token } from "./token.js";

/* eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }] */
/* eslint flowtype/no-weak-types: "warn" */

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
  context: ParserContext,
  wordMap: ?HashMapType,
  tokenName: string,
  doNotRead: boolean = false
): ?Token {
  wordMap = wordMap || {};

  let current = context.reader.peek();
  if (context.language.caseInsensitive) current = current.toUpperCase();

  if (!wordMap[current]) return null;

  const subMap = wordMap[current];

  const index = subMap.findIndex((wordItem: *): boolean => {
    const word = wordItem.value;
    const peek = context.reader.peek(word.length + 1);
    return word === peek || wordItem.regex.test(peek);
  });

  if (index >= 0)
    return context.createToken(
      tokenName,
      doNotRead
        ? context.reader.peek(subMap[index].value.length)
        : context.reader.read(subMap[index].value.length)
    );

  return null;
}

export { createHashMap } from "./languages.js";

/**
 * Return the regex string of non-capturing group with quantifier. i.e.
 * (?:expr1|expr2|...)quantifier. Tip: Put all OR conditions into a
 * non-capturing group before mixing with other expressions. If not, the first
 * or the last condition may be mix with other parts of the regular expression,
 * producing unpredictable results.
 * @param {string | string[]} expressions
 * @param {string?} quantifier
 * @returns {string}
 */
export function nonCapturingGroup(
  expressions: string | string[],
  quantifier: string = ""
): string {
  const expression =
    typeof expressions === "string" ? expressions : expressions.join("|");
  return "(?:" + expression + ")" + quantifier;
}

/**
 * Returns a parser from a regular expression. The parser match the content from
 * the index to the end of line against the regular expression.
 * @param {string} tokenName The type of the token returned for successful
 *                           parsing.
 * @param {RegExp} regex The regular expression. The regular expression should
 * always start with `^` to match only the beginning of a string, otherwise it
 * will be inefficient.
 * @returns {function}
 */
export function getRegexpParser(
  tokenName: string,
  regex: RegExp
): ParserContext => ?Token {
  return function(context: ParserContext): ?Token {
    const match = context.reader.peekToEndOfLine().match(regex);
    // Fail if no match or not matching the start of a string.
    if (!match || match.index !== 0) return null;

    return context.createToken(tokenName, context.reader.read(match[0].length));
  };
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
  opener: { token: string, values: string[] },
  closer: { token: string, values: string[] },
  caseInsensitive: boolean = false
): (Token[]) => boolean {
  return function(tokens: Token[]): boolean {
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
  tokenRequirements: FollowsOrPrecedesIdentRule,
  caseInsensitive: boolean = false
): (Token[]) => boolean {
  tokenRequirements = tokenRequirements.slice(0); // clone array
  if (direction === 1) tokenRequirements.reverse();

  return function(tokens: Token[]): boolean {
    let tokenIndexStart = startIndex;

    for (let j = 0; j < tokenRequirements.length; j++) {
      const actual = tokens[tokenIndexStart + j * direction];
      const expected = tokenRequirements[tokenRequirements.length - 1 - j];

      if (actual === undefined)
        if (expected.optional === true) tokenIndexStart -= direction;
        else return false;
      else if (
        actual.name === expected.token &&
        (expected.values === undefined ||
          contains(expected.values, actual.value, caseInsensitive))
      )
        // derp
        continue;
      else if (expected.optional === true)
        tokenIndexStart -= direction; // we need to reevaluate against this token again
      else return false;
    }

    return true;
  };
}

type Matcher = Token => boolean;

/**
 * Gets the next token in the specified direction while matcher matches the
 * current token.
 * @param {Token[]} tokens Array of tokens
 * @param {number} index The index at which to start
 * @param {number} direction The direction to search: 1 = forward, -1 = backward
 * @param {function} matcher Predicate for determining if the token matches
 * @returns {Token?} The token or undefined
 */
function getNextWhileInternal(
  tokens: Token[],
  index: number,
  direction: 1 | -1,
  matcher: Matcher
) {
  direction = direction || 1;
  let count = 1;
  let token;
  while ((token = tokens[index + direction * count++]))
    if (!matcher(token)) return token;

  return undefined;
}

/**
 * Gets the next token while the matcher returns true.
 * @param {Token[]} tokens Array of tokens
 * @param {number} index The index at which to start
 * @param {function} matcher Predicate for determining if the token matches
 * @returns {Token?} The token or undefined
 */
export function getNextWhile(
  tokens: Token[],
  index: number,
  matcher: Matcher
): ?Token {
  return getNextWhileInternal(tokens, index, 1, matcher);
}

/**
 * Gets the next non-whitespace token. This is not safe for looping.
 * @param {Token[]} tokens Array of tokens
 * @param {number} index  The index at which to start
 * @returns {Token?} The token or undefined
 */
export function getNextNonWsToken(tokens: Token[], index: number): ?Token {
  return getNextWhileInternal(
    tokens,
    index,
    1,
    (token: Token): boolean => token.name === "default"
  );
}

/**
 * Gets the previous non-whitespace token. This is not safe for looping.
 * @param {Token[]} tokens Array of tokens
 * @param {number} index  The index at which to start
 * @returns {Object} The token or undefined
 */
export function getPreviousNonWsToken(tokens: Token[], index: number): ?Token {
  return getNextWhileInternal(
    tokens,
    index,
    -1,
    (token: Token): boolean => token.name === "default"
  );
}

/**
 * Gets the previous token while the matcher returns true.
 * @param {Token[]} tokens Array of tokens
 * @param {number} index The index at which to start
 * @param {function} matcher Predicate for determining if the token matches
 * @returns {Object} The token or undefined
 */
export function getPreviousWhile(
  tokens: Token[],
  index: number,
  matcher: Matcher
): ?Token {
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
    func = function(element: Element): any {
      // TODO: Remove (IE compatibility)
      // $FlowFixMe
      return element.currentStyle || {};
    };

  return func(element)[style];
}

export { defaultAnalyzer } from "./default-helpers.js";
export { Token } from "./token.js";
export {
  IsPrecedesRuleSatisfied,
  IsFollowsRuleSatisfied,
  IsBetweenRuleSatisfied
} from "./rules-processor.js";

// Export types for language support
export type { FollowsOrPrecedesIdentRule, HashMapType, ParserContext };
export type { AnalyzerContext } from "./analyzer-context.js";
export type { BetweenIdentRule } from "./languages.js";
