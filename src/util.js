const jsdom = require('jsdom').jsdom;
const document = jsdom('', {});

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/

// gets the last character in a string or the last element in an array
export function last(thing) {
  return thing.charAt
    ? thing.charAt(thing.length - 1)
    : thing[thing.length - 1];
}

// http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
export function regexEscape(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

// TODO: remove IE hack
const isIe = !+'\v1';
export const eol = isIe ? '\r' : '\n';

// non-recursively merges one object into the other
// TODO: remove because this is possible a polyfill
export function merge(defaultObject, objectToMerge) {
  let key;
  if (!objectToMerge) return defaultObject;

  for (key in objectToMerge) defaultObject[key] = objectToMerge[key];

  return defaultObject;
}

export function clone(object) {
  return merge({}, object);
}

export const escapeSequences = ['\\n', '\\t', '\\r', '\\\\', '\\v', '\\f'];

// array.contains()
export function contains(arr, value, caseInsensitive) {
  if (arr.indexOf && !caseInsensitive) return arr.indexOf(value) >= 0;

  return arr.some(
    (element) =>
      element === value ||
      (caseInsensitive &&
        typeof element === 'string' &&
        typeof value === 'string' &&
        element.toUpperCase() === value.toUpperCase())
  );
}

export function matchWord(context, wordMap, tokenName, doNotRead) {
  const line = context.reader.getLine();
  const column = context.reader.getColumn();
  wordMap = wordMap || [];

  let current = context.reader.current();
  if (context.language.caseInsensitive)
    current = current.toUpperCase();

  if (!wordMap[current])
    return null;

  wordMap = wordMap[current];

  const index = wordMap.findIndex((wordItem) => {
    const word = wordItem.value;
    const peek = current + context.reader.peek(word.length);
    return word === peek || wordItem.regex.test(peek);
  });

  if (index >= 0) {
    return context.createToken(
      tokenName,
      context.reader.current() +
        context.reader[doNotRead ? 'peek' : 'read'](
          wordMap[index].value.length - 1
        ),
      line,
      column
    );
  }

  return null;
}

// this is crucial for performance
export function createHashMap(wordMap, boundary, caseInsensitive) {
  // creates a hash table where the hash is the first character of the word
  const newMap = {};
  for (let i = 0; i < wordMap.length; i++) {
    const word = caseInsensitive ? wordMap[i].toUpperCase() : wordMap[i];
    const firstChar = word.charAt(0);
    if (!newMap[firstChar]) newMap[firstChar] = [];

    newMap[firstChar].push({
      value: word,
      regex: new RegExp(
        '^' + regexEscape(word) + boundary,
        caseInsensitive ? 'i' : ''
      ),
    });
  }

  return newMap;
}

export function createBetweenRule(startIndex, opener, closer, caseInsensitive) {
  return function(tokens) {
    let index = startIndex,
      token,
      success = false;

    // check to the left: if we run into a closer or never run into an opener, fail
    while ((token = tokens[--index]) !== undefined) {
      if (token.name === closer.token && contains(closer.values, token.value)) {
        if (
          token.name === opener.token &&
          contains(opener.values, token.value, caseInsensitive)
        ) {
          // if the closer is the same as the opener that's okay
          success = true;
          break;
        }

        return false;
      }

      if (
        token.name === opener.token &&
        contains(opener.values, token.value, caseInsensitive)
      ) {
        success = true;
        break;
      }
    }

    if (!success) return false;

    // check to the right for the closer
    index = startIndex;
    while ((token = tokens[++index]) !== undefined) {
      if (
        token.name === opener.token &&
        contains(opener.values, token.value, caseInsensitive)
      ) {
        if (
          token.name === closer.token &&
          contains(closer.values, token.value, caseInsensitive)
        ) {
          // if the closer is the same as the opener that's okay
          success = true;
          break;
        }

        return false;
      }

      if (
        token.name === closer.token &&
        contains(closer.values, token.value, caseInsensitive)
      ) {
        success = true;
        break;
      }
    }

    return success;
  };
}

export function createProceduralRule(
  startIndex,
  direction,
  tokenRequirements,
  caseInsensitive
) {
  tokenRequirements = tokenRequirements.slice(0);
  return function(tokens) {
    let tokenIndexStart = startIndex,
      j,
      expected,
      actual;

    if (direction === 1) tokenRequirements.reverse();

    for (j = 0; j < tokenRequirements.length; j++) {
      actual = tokens[tokenIndexStart + j * direction];
      expected = tokenRequirements[tokenRequirements.length - 1 - j];

      if (actual === undefined) {
        if (expected.optional !== undefined && expected.optional)
          tokenIndexStart -= direction;
        else return false;
      } else if (
        actual.name === expected.token &&
        (expected.values === undefined ||
          contains(expected.values, actual.value, caseInsensitive))
      ) {
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

// gets the next token in the specified direction while matcher matches the current token
function getNextWhileInternal(tokens, index, direction, matcher) {
  let count = 1,
    token;

  direction = direction || 1;
  while ((token = tokens[index + direction * count++]))
    if (!matcher(token)) return token;

  return undefined;
}

export function getNextWhile(tokens, index, matcher) {
  return getNextWhileInternal(tokens, index, 1, matcher);
}

export function getNextNonWsToken(tokens, index) {
  return getNextWhileInternal(
    tokens,
    index,
    1,
    (token) => token.name === 'default'
  );
}

export function getPreviousNonWsToken(tokens, index) {
  return getNextWhileInternal(
    tokens,
    index,
    -1,
    (token) => token.name === 'default'
  );
}

export function getPreviousWhile(tokens, index, matcher) {
  return getNextWhileInternal(tokens, index, -1, matcher);
}

export const whitespace = {token: 'default', optional: true};

// adapted from http://blargh.tommymontgomery.com/2010/04/get-computed-style-in-javascript/
export function getComputedStyle() {
  let func = null;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    func = document.defaultView.getComputedStyle;
  } else {
    func = function(element) {
      return element.currentStyle || {};
    };
  }

  return function(element, style) {
    return func(element, null)[style];
  };
}
