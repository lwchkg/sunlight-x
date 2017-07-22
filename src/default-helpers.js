// @flow
import * as util from "./util.js";
import { document } from "./jsdom.js";

import type { AnalyzerContext } from "./analyzer-context.js";
import type {
  BetweenIdentRule,
  CustomIdentRule,
  FollowsOrPrecedesIdentRule
} from "./languages.js";
import type { ParserContext } from "./parser-context.js";
import type { Token } from "./token.js";

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }], camelcase: 0 */

function defaultHandleToken(suffix: string): * {
  return function(context: AnalyzerContext): true {
    const element: Element = document.createElement("span");
    element.className = context.options.classPrefix + suffix;
    element.appendChild(context.createTextNode(context.tokens[context.index]));
    context.addNode(element);
    return true;
  };
}

export class defaultAnalyzer {
  handleToken(context: AnalyzerContext): true {
    return defaultHandleToken(context.tokens[context.index].name)(context);
  }

  // TODO: clean up!!!
  // just append default content as a text node
  handle_default(context: AnalyzerContext): true {
    context.addNode(context.createTextNode(context.tokens[context.index]));
    return true;
  }

  // this handles the named ident mayhem
  handle_ident(context: AnalyzerContext): true {
    const _evaluateCustomRule = (rules: CustomIdentRule[]): boolean => {
      rules = rules || [];
      for (let i = 0; i < rules.length; i++)
        if (rules[i](context))
          return defaultHandleToken("named-ident")(context);

      return false;
    };

    const _evaluate = <T: FollowsOrPrecedesIdentRule | BetweenIdentRule>(
      rules: T[],
      createRule: T => (Token[]) => boolean
    ): boolean => {
      rules = rules || [];
      for (let i = 0; i < rules.length; i++)
        if (createRule && createRule(rules[i])(context.tokens))
          return defaultHandleToken("named-ident")(context);

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
      defaultHandleToken("ident")(context)
    );
  }
}

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
