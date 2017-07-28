// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
export const name = "diff";

export const doNotParse = /(?!x)x/;

export const scopes = {
  header: [
    ["---", "\n", [], true],
    ["+++", "\n", [], true],
    ["***", "\n", [], true]
  ],
  added: [["+", "\n", [], true]],
  removed: [["-", "\n", [], true]],
  modified: [["!", "\n", [], true]],
  unchanged: [[" ", "\n", [], true]],
  rangeInfo: [["@@", "\n", [], true]],
  mergeHeader: [["Index:", "\n", [], true], ["=", "\n", [], true]]
};

export const customTokens = {
  noNewLine: {
    values: ["\\ No newline at end of file"],
    boundary: "\\b"
  }
};
