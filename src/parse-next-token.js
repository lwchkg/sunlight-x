// @flow
import { Continuation } from "./continuation.js";
import * as util from "./util.js";

import type { ParserContext } from "./parser-context.js";
import type { Token } from "./token.js";
import type { ScopeType } from "./languages.js";

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2, 3] }]*/

function isIdentMatch(context: ParserContext): boolean {
  return (
    context.language.identFirstLetter &&
    context.language.identFirstLetter.test(context.reader.current())
  );
}

// token parsing functions
function parseKeyword(context: ParserContext): ?Token {
  return util.matchWord(context, context.language.keywords, "keyword");
}

function parseCustomTokens(context: ParserContext): ?Token {
  if (context.language.customTokens === undefined) return null;

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
  const current = context.reader.current();
  if (context.language.punctuation.test(util.regexEscape(current)))
    return context.createToken(
      "punctuation",
      current,
      context.reader.getLine(),
      context.reader.getColumn()
    );

  return null;
}

function parseIdent(context: ParserContext): ?Token {
  const line = context.reader.getLine();
  const column = context.reader.getColumn();

  if (!isIdentMatch(context)) return null;

  let ident = context.reader.current();
  let peek;
  while ((peek = context.reader.peek()) !== context.reader.EOF) {
    if (!context.language.identAfterFirstLetter.test(peek)) break;

    ident += context.reader.read();
  }

  return context.createToken("ident", ident, line, column);
}

function parseDefault(context: ParserContext): ?Token {
  if (context.defaultData.text === "") {
    // new default token
    context.defaultData.line = context.reader.getLine();
    context.defaultData.column = context.reader.getColumn();
  }

  context.defaultData.text += context.reader.current();
  return null;
}

function parseScopes(context: ParserContext): ?Token {
  const current = context.reader.current();

  for (const tokenName in context.language.scopes) {
    const specificScopes = context.language.scopes[tokenName];
    for (const scope of specificScopes) {
      const opener = scope[0];

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
      const continuation = new Continuation(scope, tokenName);
      return continuation.process(context, continuation, value, line, column);
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
