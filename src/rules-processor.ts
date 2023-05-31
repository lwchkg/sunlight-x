// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { contains } from "./util";
import type { ArrayWalker } from "./array-walker";
import type { FollowsOrPrecedesIdentRule } from "./languages";
import type { Token } from "./token";

/**
 * Evaluate a precedes rule. The token at the index must precede the requirement
 * in the given order.
 * @param {ArrayWalker} walker The walker with the tokens. The walker will be
 *                             mutated.
 * @param {Array} tokenRequirements Array of token requirements, same as
 *                                  namedIdentRules.precedes
 * @param {boolean|undefined} caseInsensitive Indicates whether the token values
 *                                            are case insensitive
 * @returns {boolean}
 */
export function IsPrecedesRuleSatisfied(walker: ArrayWalker<Token>, tokenRequirements: FollowsOrPrecedesIdentRule, caseInsensitive: boolean = false): boolean {
  for (const expected of tokenRequirements) {
    if (!walker.hasNext()) if (expected.optional === true) continue;else return false;
    const actual = walker.next();
    if (actual.name === expected.token && (!expected.values || contains(expected.values, actual.value, caseInsensitive))) continue;
    if (expected.optional === true) walker.decreaseIndex();else return false;
  }

  return true;
}

/**
 * Evaluate a follows rule. The token at the index must follow the requirement
 * in the given order.
 * @param {ArrayWalker} walker The walker with the tokens. The walker will be
 *                             mutated.
 * @param {Array} tokenRequirements Array of token requirements, same as
 *                                  namedIdentRules.follows
 * @param {boolean|undefined} caseInsensitive Indicates whether the token values
 *                                            are case insensitive
 * @returns {boolean}
 */
export function IsFollowsRuleSatisfied(walker: ArrayWalker<Token>, tokenRequirements: FollowsOrPrecedesIdentRule, caseInsensitive: boolean = false): boolean {
  for (let i = tokenRequirements.length - 1; i >= 0; --i) {
    const expected = tokenRequirements[i];
    if (!walker.hasPrev()) if (expected.optional === true) continue;else return false;
    const actual = walker.prev();
    if (actual.name === expected.token && (!expected.values || contains(expected.values, actual.value, caseInsensitive))) continue;
    if (expected.optional === true) walker.increaseIndex();else return false;
  }

  return true;
}

/**
 * Evaluate a between rule.
 * @param {ArrayWalker} walker The walker with the tokens. The walker will be
 *                             mutated.
 * @param {object} opener { token: "tokenName", values: ["token", "values"] }
 * @param {object} closer { token: "tokenName", values: ["token", "values"] }
 * @param {boolean|undefined} caseInsensitive Indicates whether the token values
 *                                            are case insensitive.
 * @returns {boolean}
 */
export function IsBetweenRuleSatisfied(walker: ArrayWalker<Token>, opener: {
  token: string;
  values?: string[];
}, closer: {
  token: string;
  values?: string[];
}, caseInsensitive: boolean = false): boolean {
  // check to the left: if we run into a closer or never run into an opener, fail
  const walker1 = walker.duplicate();
  let success = false;

  while (walker1.hasPrev()) {
    const token = walker1.prev();

    if (token.name === opener.token && (!opener.values || contains(opener.values, token.value, caseInsensitive))) {
      success = true;
      break;
    }

    if (token.name === closer.token && (!closer.values || contains(closer.values, token.value, caseInsensitive))) return false;
  }

  if (!success) return false;

  // check to the right for the closer
  while (walker.hasNext()) {
    const token = walker.next();
    if (token.name === closer.token && (!closer.values || contains(closer.values, token.value, caseInsensitive))) return true;
    if (token.name === opener.token && (!opener.values || contains(opener.values, token.value, caseInsensitive))) return false;
  }

  return false;
}