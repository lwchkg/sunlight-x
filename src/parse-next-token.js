// @flow
import { Continuation } from "./continuation.js";
import * as util from "./util.js";

import type { ParserContext } from "./parser-context.js";
import type { Token } from "./token.js";

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2, 3] }]*/

// token parsing functions
function parseKeyword(context: ParserContext): ?Token {
  return util.matchWord(context, context.language.keywords, "keyword");
}

function parseCustomTokens(context: ParserContext): ?Token {
  for (const tokenName in context.language.customTokens) {
    const token = util.matchWord(
      context,
      context.language.customTokens[tokenName],
      tokenName
    );
    if (token !== null) return token;
  }

  return null;
}

function parseOperator(context: ParserContext): ?Token {
  return util.matchWord(context, context.language.operators, "operator");
}

function parsePunctuation(context: ParserContext): ?Token {
  const current = context.reader.peek();
  if (context.language.punctuation.test(util.regexEscape(current)))
    return context.createToken("punctuation", context.reader.read());

  return null;
}

function parseIdent(context: ParserContext): ?Token {
  if (!context.language.identFirstLetter.test(context.reader.peek()))
    return null;

  let ident = context.reader.read();

  while (
    !context.reader.isEOF() &&
    context.language.identAfterFirstLetter.test(context.reader.peek())
  )
    ident += context.reader.read();

  return context.createToken("ident", ident);
}

function parseDefault(context: ParserContext): ?Token {
  context.defaultData.text += context.reader.read();
  return null;
}

function parseScopes(context: ParserContext): ?Token {
  for (const tokenName in context.language.scopes) {
    const specificScopes = context.language.scopes[tokenName];
    for (const scope of specificScopes) {
      const opener = scope[0];

      const value = context.reader.peek(opener.length);
      if (
        opener !== value &&
        (!context.language.caseInsensitive ||
          value.toUpperCase() !== opener.toUpperCase())
      )
        continue;

      context.reader.read(opener.length);
      const continuation = new Continuation(scope, tokenName);
      return continuation.process(context, continuation, value);
    }
  }

  return null;
}

function parseNumber(context: ParserContext): ?Token {
  return context.language.numberParser(context);
}

function parseCustomRules(context: ParserContext): ?Token | Token[] {
  const customRules = context.language.customParseRules;

  if (customRules === undefined) return null;

  for (let i = 0; i < customRules.length; i++) {
    const token = customRules[i](context);
    if (token) return token;
  }

  return null;
}

export function parseNextToken(context: ParserContext): ?Token | Token[] {
  if (context.language.doNotParse.test(context.reader.peek()))
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
