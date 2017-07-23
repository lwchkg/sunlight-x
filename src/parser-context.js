// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { CodeReader } from "./code-reader.js";
import { fireEvent } from "./events.js";
import { Token } from "./token.js";
import { parseNextToken } from "./parse-next-token.js";
import * as util from "./util.js";

import type { AnalyzerContext } from "./analyzer-context.js";
import type { Continuation } from "./continuation.js";
import type { Highlighter } from "./highlighter.js";
import type {
  ContextItemsType,
  EmbeddedLanguageDefinition,
  Language
} from "./languages.js";
import type { SunlightOptionsType } from "./globalOptions.js";

export class ParserContext {
  highlighter: Highlighter;
  tokens: Token[];
  options: SunlightOptionsType;
  reader: CodeReader;
  language: Language;
  items: ContextItemsType;
  embeddedLanguageStack: EmbeddedLanguageDefinition[];
  defaultData: { text: string, line: number, column: number };
  continuation: ?Continuation;

  constructor(
    highlighter: Highlighter,
    unhighlightedCode: string,
    language: Language,
    partialContext: ?AnalyzerContext,
    options: SunlightOptionsType
  ) {
    this.highlighter = highlighter;
    this.options = options;
    this.tokens = [];

    fireEvent("beforeTokenize", this.highlighter, {
      code: unhighlightedCode,
      language: language
    });

    this.reader = new CodeReader(unhighlightedCode);
    this.language = language;
    this.items = util.clone(language.contextItems);
    this.embeddedLanguageStack = [];
    this.defaultData = { text: "", line: 1, column: 1 };

    // if continuation is given, then we need to pick up where we left off from a previous parse
    // basically it indicates that a scope was never closed, so we need to continue that scope
    if (partialContext && partialContext.continuation) {
      const continuation = partialContext.continuation;
      partialContext.continuation = null;
      // The following statement can write to this.continuation
      // TODO: clean up
      this.tokens.push(
        continuation.process(
          this,
          continuation,
          "",
          this.reader.getLine(),
          this.reader.getColumn(),
          true
        )
      );
    }

    while (!this.reader.isEof()) {
      this.highlighter.switchToEmbeddedLanguageIfNecessary(this);
      const token = parseNextToken(this);

      // flush default data if needed (in pretty much all languages this is just whitespace)
      if (token !== null && token !== undefined) {
        if (this.defaultData.text !== "") {
          this.tokens.push(
            this.createToken(
              "default",
              this.defaultData.text,
              this.defaultData.line,
              this.defaultData.column
            )
          );
          this.defaultData.text = "";
        }

        if (Array.isArray(token)) this.tokens = this.tokens.concat(token);
        else this.tokens.push(token);
      }

      this.highlighter.switchBackFromEmbeddedLanguageIfNecessary(this);
      this.reader.read();
    }

    // append the last default token, if necessary
    if (this.defaultData.text !== "")
      this.tokens.push(
        this.createToken(
          "default",
          this.defaultData.text,
          this.defaultData.line,
          this.defaultData.column
        )
      );

    fireEvent("afterTokenize", this.highlighter, {
      code: unhighlightedCode,
      parserContext: this
    });
  }

  token(index: number): Token {
    return this.tokens[index];
  }

  getAllTokens(): Token[] {
    return this.tokens.slice(0);
  }

  count(): number {
    return this.tokens.length;
  }

  createToken(
    name: string,
    value: string,
    line: number,
    column: number
  ): Token {
    return new Token(name, value, line, column, this.language.name);
  }
}

/**
 * Tokenize and return a ParserContext
 * @param {Highlighter} highlighter
 * @param {string} unhighlightedCode
 * @param {Language} language
 * @param {AnalyzerContext} partialContext
 * @param {SunlightOptionsType} options
 * @returns {ParserContext}
 */
export function Tokenize(
  highlighter: Highlighter,
  unhighlightedCode: string,
  language: Language,
  partialContext: ?AnalyzerContext,
  options: SunlightOptionsType
): ParserContext {
  return new ParserContext(
    highlighter,
    unhighlightedCode,
    language,
    partialContext,
    options
  );
}
