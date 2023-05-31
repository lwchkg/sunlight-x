import * as util from "./util";
import type { ParserContext } from "./parser-context";
import type { ScopeType } from "./languages";
import type { Token } from "./token";
// TODO: rename the class to something more descriptive.
export class Continuation {
  closer: RegExp;
  closerLength: number;
  escapeSequences: string[];
  zeroWidth: boolean;
  tokenName: string;

  constructor(scope: ScopeType, tokenName: string) {
    this.escapeSequences = scope[2] || [];
    this.closerLength = scope[1].length;
    this.closer = typeof scope[1] === "string" ? new RegExp(util.regexEscape(scope[1])) : scope[1].regex;
    this.zeroWidth = scope[3] || false;
    this.tokenName = tokenName;
  }

  process(context: ParserContext, continuation: Continuation, buffer: string): Token {
    let foundCloser = false;

    while (!context.reader.isEOF()) {
      let foundEscapeSequence = false;

      for (const escapeSequence of this.escapeSequences) if (context.reader.peek(escapeSequence.length) === escapeSequence) {
        buffer += context.reader.read(escapeSequence.length);
        foundEscapeSequence = true;
      }

      if (foundEscapeSequence) continue;
      const peekValue = context.reader.peek(this.closerLength);

      if (this.closer.test(peekValue)) {
        foundCloser = true;
        break;
      }

      buffer += context.reader.read();
    }

    // TODO: Untested on multi-language settings. Probably buggy.
    if (foundCloser) {
      if (!this.zeroWidth && !context.reader.isEOF()) buffer += context.reader.read(this.closerLength);
    } else {
      // This scope is not closed. We are now at EOF, and will continue with the
      // scope in the next partial parse.
      context.continuation = continuation;
    }

    return context.createToken(this.tokenName, buffer);
  }

}