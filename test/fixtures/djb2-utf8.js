// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as utf8 from "utf8";

/**
 * Return the djb2 hash of the utf-8 encoding of the string.
 * @param {string} s
 * @returns {number}
 */
export function djb2Utf8(s: string): number {
  let hash = 5381;
  const buf: string = utf8.encode(s);

  for (const c: string of buf) hash = (hash << 5) + hash + c.charCodeAt(0);

  return hash >>> 0;
}
