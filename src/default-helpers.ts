import { Analyzer } from "./analyzer";
import { IsBetweenRuleSatisfied, IsFollowsRuleSatisfied, IsPrecedesRuleSatisfied } from "./rules-processor";
import type { AnalyzerContext } from "./analyzer-context";
import type { BetweenIdentRule, CustomIdentRule, FollowsOrPrecedesIdentRule } from "./languages";
import type { ParserContext } from "./parser-context";
import type { Token } from "./token";

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
    const isNamedIdent = rules.custom.some((rule: CustomIdentRule): boolean => rule(context)) || rules.precedes.some((rule: FollowsOrPrecedesIdentRule): boolean => IsPrecedesRuleSatisfied(context.getTokenWalker(), rule, caseInsensitive)) || rules.follows.some((rule: FollowsOrPrecedesIdentRule): boolean => IsFollowsRuleSatisfied(context.getTokenWalker(), rule, caseInsensitive)) || rules.between.some((rule: BetweenIdentRule): boolean => IsBetweenRuleSatisfied(context.getTokenWalker(), rule.opener, rule.closer, caseInsensitive));
    if (isNamedIdent) Analyzer.defaultHandleToken("named-ident")(context);else super.handleToken(context);
    return true;
  }

}

/**
 * The default number parser.
 * @param {ParserContext} context
 * @returns {Token?}
 */
export function defaultNumberParser(context: ParserContext): Token | null | undefined {
  const current = context.reader.peek();
  let number: string;
  let allowDecimal = true;

  if (!/\d/.test(current)) {
    // is it a decimal followed by a number?
    if (current !== "." || !/\d/.test(context.reader.peekWithOffset(1))) return null;
    // decimal without leading zero
    number = context.reader.read(2);
    allowDecimal = false;
  } else {
    number = context.reader.read();
    if (current === "0" && context.reader.peek() !== ".") // hex or octal
      allowDecimal = false;
  }

  // easy way out: read until it's not a number or letter
  // this will work for hex (0xef), octal (012), decimal and scientific notation (1e3)
  // anything else and you're on your own
  while (!context.reader.isEOF()) {
    const peek = context.reader.peek();

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

  return context.createToken("number", number);
}