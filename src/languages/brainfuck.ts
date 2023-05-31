// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
export const name = "brainfuck";
export const customTokens = {
  increment: {
    values: [">"],
    boundary: ""
  },
  decrement: {
    values: ["<"],
    boundary: ""
  },
  incrementPointer: {
    values: ["+"],
    boundary: ""
  },
  decrementPointer: {
    values: ["-"],
    boundary: ""
  },
  write: {
    values: ["."],
    boundary: ""
  },
  read: {
    values: [","],
    boundary: ""
  },
  openLoop: {
    values: ["["],
    boundary: ""
  },
  closeLoop: {
    values: ["]"],
    boundary: ""
  }
};
export const punctuation = /(?!x)x/;

/**
 * Empty number parser. Always rejects the token.
 * @returns {null}
 */
export function numberParser(): null {
  return null;
}