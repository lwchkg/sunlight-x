// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import type { ParserContext, Token } from "../../util.js";

/**
 * Returns the token parser function for XML doc comments.
 * @param {string} commentStart Either /// or '''
 * @returns {function}
 */
export function XMLDocComment(
  commentStart: string
): ParserContext => ?(Token[]) {
  return function(context: ParserContext): ?(Token[]) {
    if (!context.reader.newMatch(commentStart)) return null;

    const metaName = "xmlDocCommentMeta"; // tags and the "///" starting token
    const contentName = "xmlDocCommentContent"; // actual comments (words and stuff)
    const tokens = [context.createToken(metaName, commentStart)];
    context.reader.newRead(commentStart.length);

    const current: { name: string, value: string } = { name: "", value: "" };

    while (!context.reader.newIsEOF()) {
      const peek = context.reader.newPeek();
      if (peek === "<" && current.name !== metaName) {
        // push the current token
        if (current.value !== "")
          tokens.push(context.createToken(current.name, current.value));

        // and create a token for the tag
        current.name = metaName;
        current.value = context.reader.newRead();
        continue;
      }

      if (peek === ">" && current.name === metaName) {
        // close the tag
        current.value += context.reader.newRead();
        tokens.push(context.createToken(current.name, current.value));
        current.name = "";
        current.value = "";
        continue;
      }

      if (peek === "\n") break;

      if (current.name === "") current.name = contentName;

      current.value += context.reader.newRead();
    }

    if (current.name === contentName)
      tokens.push(context.createToken(current.name, current.value));

    return tokens.length > 0 ? tokens : null;
  };
}
