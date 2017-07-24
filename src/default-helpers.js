// @flow
import { Analyzer } from "./analyzer.js";
import * as util from "./util.js";

import type { AnalyzerContext } from "./analyzer-context.js";
import type {
  BetweenIdentRule,
  CustomIdentRule,
  FollowsOrPrecedesIdentRule
} from "./languages.js";
import type { ParserContext } from "./parser-context.js";
import type { Token } from "./token.js";

/* eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }], camelcase: 0 */

export class defaultAnalyzer extends Analyzer {
  constructor() {
    super();
    this.handlers.default = this.handleDefault;
    this.handlers.ident = this.handleIdent;
  }

  // just append default content as a text node
  handleDefault(context: AnalyzerContext): true {
    context.addNode(context.createTextNode(context.tokens[context.index]));
    return true;
  }

  // this handles the named ident mayhem
  handleIdent(context: AnalyzerContext): true {
    const _evaluateCustomRule = (rules: CustomIdentRule[]): boolean => {
      rules = rules || [];
      for (let i = 0; i < rules.length; i++)
        if (rules[i](context))
          return Analyzer.defaultHandleToken("named-ident")(context);

      return false;
    };

    const _evaluate = <T: FollowsOrPrecedesIdentRule | BetweenIdentRule>(
      rules: T[],
      createRule: T => (Token[]) => boolean
    ): boolean => {
      rules = rules || [];
      for (let i = 0; i < rules.length; i++)
        if (createRule && createRule(rules[i])(context.tokens))
          return Analyzer.defaultHandleToken("named-ident")(context);

      return false;
    };

    return (
      _evaluateCustomRule(context.language.namedIdentRules.custom) ||
      _evaluate(context.language.namedIdentRules.follows, (ruleData: *): * =>
        util.createProceduralRule(
          context.index - 1,
          -1,
          ruleData,
          context.language.caseInsensitive
        )
      ) ||
      _evaluate(context.language.namedIdentRules.precedes, (ruleData: *): * =>
        util.createProceduralRule(
          context.index + 1,
          1,
          ruleData,
          context.language.caseInsensitive
        )
      ) ||
      _evaluate(context.language.namedIdentRules.between, (ruleData: *): * =>
        util.createBetweenRule(
          context.index,
          ruleData.opener,
          ruleData.closer,
          context.language.caseInsensitive
        )
      ) ||
      Analyzer.defaultHandleToken("ident")(context)
    );
  }
}

/**
 * The default number parser.
 * @param {ParserContext} context
 * @returns {Token?}
 */
export function defaultNumberParser(context: ParserContext): ?Token {
  const current = context.reader.current();
  const line = context.reader.getLine();
  const column = context.reader.getColumn();

  let number: string;
  let allowDecimal = true;
  if (!/\d/.test(current)) {
    // is it a decimal followed by a number?
    if (current !== "." || !/\d/.test(context.reader.peek())) return null;

    // decimal without leading zero
    number = current + context.reader.read();
    allowDecimal = false;
  } else {
    number = current;
    if (current === "0" && context.reader.peek() !== ".")
      // hex or octal
      allowDecimal = false;
  }

  // easy way out: read until it's not a number or letter
  // this will work for hex (0xef), octal (012), decimal and scientific notation (1e3)
  // anything else and you're on your own

  let peek;
  while ((peek = context.reader.peek()) !== context.reader.EOF) {
    if (!/[A-Za-z0-9]/.test(peek)) {
      if (peek === "." && allowDecimal && /\d$/.test(context.reader.peek(2))) {
        number += context.reader.read();
        allowDecimal = false;
        continue;
      }
      break;
    }
    number += context.reader.read();
  }
  return context.createToken("number", number, line, column);
}
