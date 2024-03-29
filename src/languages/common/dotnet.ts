// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import type { ParserContext, Token } from "../../util";

/**
 * Returns the token parser function for XML doc comments.
 * @param {string} commentStart Either /// or '''
 * @returns {function}
 */
export function XMLDocComment(commentStart: string): (arg0: ParserContext) => Token[] | null | undefined {
  return function (context: ParserContext): Token[] | null | undefined {
    if (!context.reader.match(commentStart)) return null;
    const metaName = "xmlDocCommentMeta"; // tags and the "///" starting token

    const contentName = "xmlDocCommentContent"; // actual comments (words and stuff)

    const tokens = [context.createToken(metaName, commentStart)];
    context.reader.read(commentStart.length);
    const current: {
      name: string;
      value: string;
    } = {
      name: "",
      value: ""
    };

    while (!context.reader.isEOF()) {
      const peek = context.reader.peek();

      if (peek === "<" && current.name !== metaName) {
        // push the current token
        if (current.value !== "") tokens.push(context.createToken(current.name, current.value));
        // and create a token for the tag
        current.name = metaName;
        current.value = context.reader.read();
        continue;
      }

      if (peek === ">" && current.name === metaName) {
        // close the tag
        current.value += context.reader.read();
        tokens.push(context.createToken(current.name, current.value));
        current.name = "";
        current.value = "";
        continue;
      }

      if (peek === "\n") break;
      if (current.name === "") current.name = contentName;
      current.value += context.reader.read();
    }

    if (current.name === contentName) tokens.push(context.createToken(current.name, current.value));
    return tokens.length > 0 ? tokens : null;
  };
}