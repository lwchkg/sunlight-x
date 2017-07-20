/* eslint require-jsdoc: 0 */
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

export function numberParser() {
  return null;
}
