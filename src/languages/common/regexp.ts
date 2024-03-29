// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { Token } from "../../util";
import * as util from "../../util";
import type { ParserContext } from "../../util";

/**
 * Helper function to see if the previous token is okay to preceed a regexp
 * literal. The function was used for JavaScript and ActionScript.
 * @param {Object} context
 * @returns {boolean}
 */
function isValidRegExp(context: ParserContext): boolean {
  const previousNonWsToken = context.token(context.count() - 1);
  let previousToken;

  if (context.defaultData.text !== "") {
    previousToken = context.createToken("default", context.defaultData.text);
  } else {
    previousToken = previousNonWsToken;
    // Okay if there is no previous token.
    if (!previousToken) return true;
  }

  // Since JavaScript doesn't require statement terminators, if the previous
  // token was whitespace and contained a newline, then we're good.
  if (previousToken.name === "default" && previousToken.value.indexOf("\n") >= 0) return true;
  // In these case the / stands for division.
  if (util.contains(["keyword", "ident", "number"], previousNonWsToken.name)) return false;
  if (previousNonWsToken.name === "punctuation" && !util.contains(["(", "{", "[", ",", ";"], previousNonWsToken.value)) return false;
  return true;
}

/**
 * Parse a regular expression literal. Used by Javascript and ActionScript.
 * @param {Object} context
 * @returns {Object}
 */
export function ParseRegExpLiteral(context: ParserContext): Token | null | undefined {
  // Must start with a "/".
  if (!context.reader.match("/")) return null;
  // Should not start with "//" (comment) or "/*" (multi-line comment).
  if (context.reader.match("//") || context.reader.match("/*")) return null;
  if (!isValidRegExp(context)) return null;
  // read the regex literal
  let regexLiteral = context.reader.read();
  let charClass = false;

  while (!context.reader.isEOF()) {
    const next = context.reader.read();
    regexLiteral += next;
    if (next === "\\") regexLiteral += context.reader.read();else if (next === "[") charClass = true;else if (next === "]") charClass = false;else if (next === "/" && !charClass) break;
  }

  // Read the regex modifiers. Only "g", "i" and "m", "u" and "y" are allowed,
  // but in the future extra letters may be allowed, so we allow any
  // alphabetical character here.
  while (!context.reader.isEOF() && /[A-Za-z]/.test(context.reader.peek())) regexLiteral += context.reader.read();

  return context.createToken("regexLiteral", regexLiteral);
}