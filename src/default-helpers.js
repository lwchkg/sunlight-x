// @flow
import { Analyzer } from "./analyzer.js";
import {
  IsBetweenRuleSatisfied,
  IsFollowsRuleSatisfied,
  IsPrecedesRuleSatisfied
} from "./rules-processor.js";

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
    const rules = context.language.namedIdentRules;
    const caseInsensitive = context.language.caseInsensitive;

    const isNamedIdent =
      rules.custom.some((rule: CustomIdentRule): boolean => rule(context)) ||
      rules.precedes.some((rule: FollowsOrPrecedesIdentRule): boolean =>
        IsPrecedesRuleSatisfied(context.getTokenWalker(), rule, caseInsensitive)
      ) ||
      rules.follows.some((rule: FollowsOrPrecedesIdentRule): boolean =>
        IsFollowsRuleSatisfied(context.getTokenWalker(), rule, caseInsensitive)
      ) ||
      rules.between.some((rule: BetweenIdentRule): boolean =>
        IsBetweenRuleSatisfied(
          context.getTokenWalker(),
          rule.opener,
          rule.closer,
          caseInsensitive
        )
      );

    if (isNamedIdent) Analyzer.defaultHandleToken("named-ident")(context);
    else super.handleToken(context);

    return true;
  }
}

/**
 * The default number parser.
 * @param {ParserContext} context
 * @returns {Token?}
 */
export function defaultNumberParser(context: ParserContext): ?Token {
  const current = context.reader.newPeek();

  let number: string;
  let allowDecimal = true;
  if (!/\d/.test(current)) {
    // is it a decimal followed by a number?
    if (current !== "." || !/\d/.test(context.reader.peekWithOffset(1)))
      return null;

    // decimal without leading zero
    number = context.reader.newRead(2);
    allowDecimal = false;
  } else {
    number = context.reader.newRead();
    if (current === "0" && context.reader.newPeek() !== ".")
      // hex or octal
      allowDecimal = false;
  }

  // easy way out: read until it's not a number or letter
  // this will work for hex (0xef), octal (012), decimal and scientific notation (1e3)
  // anything else and you're on your own
  while (!context.reader.newIsEOF()) {
    const peek = context.reader.newPeek();
    if (!/[A-Za-z0-9]/.test(peek)) {
      if (
        peek === "." &&
        allowDecimal &&
        /\d$/.test(context.reader.newPeek(2))
      ) {
        number += context.reader.newRead();
        allowDecimal = false;
        continue;
      }
      break;
    }
    number += context.reader.newRead();
  }
  return context.createToken("number", number);
}
