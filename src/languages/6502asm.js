// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

import type { ParserContext, Token } from "../util.js";

export const name = "6502asm";

export const keywords = [
  // conditional branch ops
  "BCC",
  "BCS",
  "BEQ",
  "BMI",
  "BNE",
  "BPL",
  "BVC",
  "BVS",
  // comparison ops
  "CMP",
  "CPX",
  "CPY",
  // flag ops
  "CLC",
  "CLD",
  "CLI",
  "CLV",
  "SEC",
  "SED",
  "SEI",
  // register ops
  "DEX",
  "DEY",
  "INX",
  "INY",
  "TAX",
  "TAY",
  "TXA",
  "TYA",
  // regular ops
  "BRK",
  "NOP",
  "RTI",
  "RTS",
  "ASL",
  "LSR",
  "ROL",
  "ROR",
  "ADC",
  "AND",
  "BIT",
  "DEC",
  "EOR",
  "INC",
  "JMP",
  "JSR",
  "LDA",
  "LDX",
  "LDY",
  "ORA",
  "SBC",
  "STA",
  "STX",
  "STY",
  // stack ops
  "PHA",
  "PHP",
  "PLA",
  "PLP",
  "TSX",
  "TXS"
];

export const scopes = {
  string: [['"', '"', [], false]],
  comment: [[";", "\n", [], true]]
};

export const operators = [
  ">>",
  "<<",
  ">=",
  "<=",
  "==",
  "!=",
  "&&",
  "||",
  "~",
  "-",
  "<",
  ">",
  "*",
  "/",
  "%",
  "+",
  "-",
  "=",
  "&",
  "^",
  "|",
  "?"
];

export const identFirstLetter = /[A-Za-z]/; // must be alpha
export const identAfterFirstLetter = /\w/; // alphanumeric and underscore

export const customTokens = {
  illegalOpcode: {
    values: [
      // illegal ops
      "SLO",
      "RLA",
      "SRE",
      "RRA",
      "SAX",
      "LAX",
      "DCP",
      "ISC",
      "ANC",
      "ALR",
      "ARR",
      "XAA",
      "AXS",
      "AHX",
      "SHY",
      "SHX",
      "TAS",
      "LAS"
    ],
    boundary: "\\b"
  },

  pseudoOp: {
    values: [
      // pre-processor pseudo-ops (not a complete list!)
      "BYTE",
      "WORD",
      "DS",
      "ORG",
      "RORG",
      "ALIGN",
      "MAC",
      "ENDM",
      "SUBROUTINE"
    ],
    boundary: "\\b"
  }
};

export const customParseRules = [
  function(context: ParserContext): ?Token {
    if (!context.reader.newMatch("#")) return null;

    // Quick and dirty: everything between "#" (inclusive) and whitespace
    // (exclusive) is a constant too dirty.  Need to account for parens and
    // square brackets, whitespace can appear inside them. New routine: once
    // inside () or [], anything goes, but once outside, terminate with
    // whitespace
    let value = context.reader.newRead();
    let parenCount = 0;
    let bracketCount = 0;
    for (;;) {
      const peek = context.reader.newPeek();
      if (parenCount === 0 && bracketCount === 0 && /\s/.test(peek)) break;

      if (peek === ")" && parenCount > 0) parenCount--;
      if (peek === "]" && bracketCount > 0) bracketCount--;
      if (peek === "(") parenCount++;
      if (peek === "[") bracketCount++;

      value += context.reader.newRead();
    }

    return context.createToken("constant", value);
  },

  // labels
  (function(): ParserContext => ?Token {
    const validLabelOps = [
      "BCC",
      "BCS",
      "BEQ",
      "BMI",
      "BNE",
      "BPL",
      "BVC",
      "BVS",
      "JMP",
      "JSR"
    ];

    return function(context: ParserContext): ?Token {
      if (!/[A-Za-z]/.test(context.reader.newPeek())) return null;

      const prevToken = util.getPreviousNonWsToken(
        context.getAllTokens(),
        context.count()
      );

      // Check if it is just a regular ident.
      if (
        (!prevToken ||
          prevToken.name !== "keyword" ||
          !util.contains(validLabelOps, prevToken.value, true)) &&
        context.count() > 0 &&
        !/\n$/.test(context.defaultData.text)
      )
        return null;

      // Read until the end of the ident.
      let label = context.reader.newRead();
      while (!context.reader.newIsEOF() && /\w/.test(context.reader.newPeek()))
        label += context.reader.newRead();

      return context.createToken("label", label);
    };
  })()
];

export const caseInsensitive = true;

/**
 * Number parser of 6502asm.
 * TODO: parsing appears to be incorrect. But needs specs before fixing.
 * @param {ParserContext} context
 * @returns {Token?}
 */
export function numberParser(context: ParserContext): ?Token {
  const current = context.reader.newPeek();

  let number;
  // is first char a digit?
  if (!/\d/.test(current)) {
    // does it start with "$" (hex) or "%" (binary)?
    if (current !== "$" && current !== "%") return null;

    // hex/binary number
    number = context.reader.newRead(2);
  } else {
    number = context.reader.newRead(1);
    // is it a decimal?
    if (context.reader.newPeek() === ".") number += context.reader.newRead();
  }

  // easy way out: read until it's not a number or letter a-f
  // this will work for hex ($FF), octal (012), decimal and binary
  while (
    !context.reader.newIsEOF() &&
    /[A-Fa-f0-9]/.test(context.reader.newPeek())
  )
    number += context.reader.newRead();

  return context.createToken("number", number);
}
