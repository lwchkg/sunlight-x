import * as util from './util.js';
/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2, 3] }]*/

function isIdentMatch(context) {
  return (
    context.language.identFirstLetter &&
    context.language.identFirstLetter.test(context.reader.current())
  );
}

// token parsing functions
function parseKeyword(context) {
  return util.matchWord(context, context.language.keywords, 'keyword');
}

function parseCustomTokens(context) {
  let tokenName, token;
  if (context.language.customTokens === undefined) return null;

  for (tokenName in context.language.customTokens) {
    token = util.matchWord(
      context,
      context.language.customTokens[tokenName],
      tokenName
    );
    if (token !== null) return token;
  }

  return null;
}

function parseOperator(context) {
  return util.matchWord(context, context.language.operators, 'operator');
}

function parsePunctuation(context) {
  const current = context.reader.current();
  if (context.language.punctuation.test(util.regexEscape(current))) {
    return context.createToken(
      'punctuation',
      current,
      context.reader.getLine(),
      context.reader.getColumn()
    );
  }

  return null;
}

function parseIdent(context) {
  const line = context.reader.getLine();
  const column = context.reader.getColumn();

  if (!isIdentMatch(context)) return null;

  let ident = context.reader.current();
  let peek;
  while ((peek = context.reader.peek()) !== context.reader.EOF) {
    if (!context.language.identAfterFirstLetter.test(peek)) break;

    ident += context.reader.read();
  }

  return context.createToken('ident', ident, line, column);
}

function parseDefault(context) {
  if (context.defaultData.text === '') {
    // new default token
    context.defaultData.line = context.reader.getLine();
    context.defaultData.column = context.reader.getColumn();
  }

  context.defaultData.text += context.reader.current();
  return null;
}

function getScopeReaderFunction(scope, tokenName) {
  const escapeSequences = scope[2] || [];
  const closerLength = scope[1].length;
  const closer =
      typeof scope[1] === 'string'
        ? new RegExp(util.regexEscape(scope[1]))
        : scope[1].regex;
  const zeroWidth = scope[3] || false;

  // processCurrent indicates that this is being called from a continuation
  // which means that we need to process the current char, rather than peeking at the next
  return function(
    context,
    continuation,
    buffer,
    line,
    column,
    processCurrent
  ) {
    let foundCloser = false;
    buffer = buffer || '';

    processCurrent = processCurrent ? 1 : 0;

    function process(processCurrent) {
      // check for escape sequences
      let peekValue;
      const current = context.reader.current();

      for (let i = 0; i < escapeSequences.length; i++) {
        peekValue =
          (processCurrent ? current : '') +
          context.reader.peek(escapeSequences[i].length - processCurrent);
        if (peekValue === escapeSequences[i]) {
          buffer += context.reader.read(peekValue.length - processCurrent);
          return true;
        }
      }

      peekValue =
        (processCurrent ? current : '') +
        context.reader.peek(closerLength - processCurrent);
      if (closer.test(peekValue)) {
        foundCloser = true;
        return false;
      }

      buffer += processCurrent ? current : context.reader.read();
      return true;
    }

    if (!processCurrent || process(true)) {
      while (context.reader.peek() !== context.reader.EOF && process(false)) {
        // empty
      }
    }

    if (processCurrent) {
      buffer += context.reader.current();
      context.reader.read();
    } else {
      buffer +=
        zeroWidth || context.reader.peek() === context.reader.EOF
          ? ''
          : context.reader.read(closerLength);
    }

    if (!foundCloser) {
      // we need to signal to the context that this scope was never properly closed
      // this has significance for partial parses (e.g. for nested languages)
      context.continuation = continuation;
    }

    return context.createToken(tokenName, buffer, line, column);
  };
}

function parseScopes(context) {
  const current = context.reader.current();

  for (const tokenName in context.language.scopes) {
    const specificScopes = context.language.scopes[tokenName];
    for (let j = 0; j < specificScopes.length; j++) {
      const opener = specificScopes[j][0];

      const value = current + context.reader.peek(opener.length - 1);

      if (
        opener !== value &&
        (!context.language.caseInsensitive ||
          value.toUpperCase() !== opener.toUpperCase())
      )
        continue;

      const line = context.reader.getLine();
      const column = context.reader.getColumn();
      context.reader.read(opener.length - 1);
      const continuation = getScopeReaderFunction(specificScopes[j], tokenName);
      return continuation(context, continuation, value, line, column);
    }
  }

  return null;
}

function parseNumber(context) {
  return context.language.numberParser(context);
}

function parseCustomRules(context) {
  const customRules = context.language.customParseRules;

  if (customRules === undefined) return null;

  for (let i = 0; i < customRules.length; i++) {
    const token = customRules[i](context);
    if (token) return token;
  }

  return null;
}

export function parseNextToken(context) {
  if (context.language.doNotParse.test(context.reader.current()))
    return parseDefault(context);

  return (
    parseCustomRules(context) ||
    parseCustomTokens(context) ||
    parseKeyword(context) ||
    parseScopes(context) ||
    parseIdent(context) ||
    parseNumber(context) ||
    parseOperator(context) ||
    parsePunctuation(context) ||
    parseDefault(context)
  );
}
