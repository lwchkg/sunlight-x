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
  const current = context.reader.newPeek();
  if (context.language.punctuation.test(util.regexEscape(current)))
    return context.createToken("punctuation", context.reader.newRead());

  return null;
}

function parseIdent(context: ParserContext): ?Token {
  if (!context.language.identFirstLetter.test(context.reader.newPeek()))
    return null;

  let ident = context.reader.newRead();

  while (
    !context.reader.newIsEOF() &&
    context.language.identAfterFirstLetter.test(context.reader.newPeek())
  )
    ident += context.reader.newRead();

  return context.createToken("ident", ident);
}

function parseDefault(context: ParserContext): ?Token {
  context.defaultData.text += context.reader.newRead();
  return null;
}

function parseScopes(context: ParserContext): ?Token {
  for (const tokenName in context.language.scopes) {
    const specificScopes = context.language.scopes[tokenName];
    for (const scope of specificScopes) {
      const opener = scope[0];

      const value = context.reader.newPeek(opener.length);
      if (
        opener !== value &&
        (!context.language.caseInsensitive ||
          value.toUpperCase() !== opener.toUpperCase())
      )
        continue;

      context.reader.newRead(opener.length);
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
  if (context.language.doNotParse.test(context.reader.newPeek()))
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
