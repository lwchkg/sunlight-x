// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { ArrayWalker } from "./array-walker.js";
import { CodeReader } from "./code-reader.js";
import { BeforeTokenizeEvent, AfterTokenizeEvent } from "./events.js";
import { Token } from "./token.js";
import { parseNextToken } from "./parse-next-token.js";
import { UserDefinedNameStore } from "./user-defined-name-store.js";
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
  userDefinedNameStore: UserDefinedNameStore;
  embeddedLanguageStack: EmbeddedLanguageDefinition[];
  defaultData: { text: string, line: number, column: number };
  continuation: ?Continuation;

  constructor(
    highlighter: Highlighter,
    unhighlightedCode: string,
    language: Language,
    userDefinedNameStore: UserDefinedNameStore,
    partialContext: ?AnalyzerContext,
    options: SunlightOptionsType
  ) {
    this.highlighter = highlighter;
    this.userDefinedNameStore = userDefinedNameStore;
    this.options = options;
    this.tokens = [];

    BeforeTokenizeEvent.raise(this.highlighter, {
      code: unhighlightedCode,
      language: language
    });

    this.reader = new CodeReader(unhighlightedCode);
    this.language = language;
    this.items = util.clone(language.contextItems);
    this.embeddedLanguageStack = [];
    this.defaultData = { text: "", line: 1, column: 1 };

    // If a continuation is given, then we need to pick up where we left off
    // from a previous parse. That indicates that a scope was not yet closed, so
    // so we need to continue that scope.
    if (partialContext && partialContext.continuation)
      this.tokens.push(
        partialContext.continuation.process(
          this, // this.continuation may be overwritten.
          partialContext.continuation,
          ""
        )
      );

    while (!this.reader.newIsEOF()) {
      this.highlighter.switchToEmbeddedLanguageIfNecessary(this);
      const token = parseNextToken(this);

      if (token !== null && token !== undefined) {
        // Write the stored default data if exist. These data are meant to be
        // joined into a single default token before writing.
        // Note: default data are whitespace and things marked not to parse.
        if (this.defaultData.text !== "") {
          this.tokens.push(this.createToken("default", this.defaultData.text));
          this.defaultData.text = "";
        }

        if (Array.isArray(token)) this.tokens = this.tokens.concat(token);
        else this.tokens.push(token);
      }

      this.highlighter.switchBackFromEmbeddedLanguageIfNecessary(this);
    }

    // append the last default token, if necessary
    if (this.defaultData.text !== "")
      this.tokens.push(this.createToken("default", this.defaultData.text));

    AfterTokenizeEvent.raise(this.highlighter, {
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

  // Create a token walker that is positioned at the end of the tokens. Use
  // walker.prev() to receive the last token.
  getTokenWalker(): ArrayWalker<Token> {
    return new ArrayWalker(this.tokens, this.tokens.length);
  }

  createToken(name: string, value: string): Token {
    return new Token(name, value, this.language.name);
  }
}

/**
 * Tokenize and return a ParserContext
 * @param {Highlighter} highlighter
 * @param {string} unhighlightedCode
 * @param {Language} language
 * @param {UserDefinedNameStore} userDefinedNameStore
 * @param {AnalyzerContext} partialContext
 * @param {SunlightOptionsType} options
 * @returns {ParserContext}
 */
export function Tokenize(
  highlighter: Highlighter,
  unhighlightedCode: string,
  language: Language,
  userDefinedNameStore: UserDefinedNameStore,
  partialContext: ?AnalyzerContext,
  options: SunlightOptionsType
): ParserContext {
  return new ParserContext(
    highlighter,
    unhighlightedCode,
    language,
    userDefinedNameStore,
    partialContext,
    options
  );
}
