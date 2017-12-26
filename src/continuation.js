// @flow
import * as util from "./util.js";

import type { ParserContext } from "./parser-context.js";
import type { ScopeType } from "./languages.js";
import type { Token } from "./token.js";

export class Continuation {
  closer: RegExp;
  closerLength: number;
  escapeSequences: string[];
  zeroWidth: boolean;
  tokenName: string;

  constructor(scope: ScopeType, tokenName: string) {
    this.escapeSequences = scope[2] || [];
    this.closerLength = scope[1].length;
    this.closer =
      typeof scope[1] === "string"
        ? new RegExp(util.regexEscape(scope[1]))
        : scope[1].regex;
    this.zeroWidth = scope[3] || false;
    this.tokenName = tokenName;
  }

  process(
    context: ParserContext,
    continuation: Continuation,
    buffer: string,
    line: number,
    column: number,
    processCurrent: boolean = false
  ): Token {
    let foundCloser = false;
    // buffer = buffer || ""; // TODO: remove

    const _processSingle = (processCurrent: boolean): boolean => {
      // check for escape sequences
      const current = context.reader.current() || "";

      const maybeMinusOne = processCurrent ? 1 : 0;
      const peepStart = processCurrent ? current : "";
      for (const escapeSequence of this.escapeSequences) {
        const peekValue =
          peepStart +
          context.reader.peek(escapeSequence.length - maybeMinusOne);
        if (peekValue === escapeSequence) {
          buffer += context.reader.read(peekValue.length - maybeMinusOne);
          return true;
        }
      }

      const peekValue =
        peepStart + context.reader.peek(this.closerLength - maybeMinusOne);
      if (this.closer.test(peekValue)) {
        foundCloser = true;
        return false;
      }

      buffer += processCurrent ? current : context.reader.read();
      return true;
    };

    if (!processCurrent || _processSingle(true))
      while (
        context.reader.peek() !== context.reader.EOF &&
        _processSingle(false)
      ) {
        // empty
      }

    if (processCurrent) {
      buffer += context.reader.current();
      context.reader.read();
    } else {
      buffer +=
        this.zeroWidth || context.reader.peek() === context.reader.EOF
          ? ""
          : context.reader.read(this.closerLength);
    }

    // we need to signal to the context that this scope was never properly closed
    // this has significance for partial parses (e.g. for nested languages)
    if (!foundCloser) context.continuation = continuation;

    return context.createToken(this.tokenName, buffer);
  }
}
