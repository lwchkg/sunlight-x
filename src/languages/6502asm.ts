// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import * as util from "../util";
import type { ParserContext, Token } from "../util";
export const name = "6502asm";
export const keywords = [// conditional branch ops
"BCC", "BCS", "BEQ", "BMI", "BNE", "BPL", "BVC", "BVS", // comparison ops
"CMP", "CPX", "CPY", // flag ops
"CLC", "CLD", "CLI", "CLV", "SEC", "SED", "SEI", // register ops
"DEX", "DEY", "INX", "INY", "TAX", "TAY", "TXA", "TYA", // regular ops
"BRK", "NOP", "RTI", "RTS", "ASL", "LSR", "ROL", "ROR", "ADC", "AND", "BIT", "DEC", "EOR", "INC", "JMP", "JSR", "LDA", "LDX", "LDY", "ORA", "SBC", "STA", "STX", "STY", // stack ops
"PHA", "PHP", "PLA", "PLP", "TSX", "TXS"];
export const scopes = {
  string: [['"', '"', [], false]],
  comment: [[";", "\n", [], true]]
};
export const operators = [">>", "<<", ">=", "<=", "==", "!=", "&&", "||", "~", "-", "<", ">", "*", "/", "%", "+", "-", "=", "&", "^", "|", "?"];
export const identFirstLetter = /[A-Za-z]/; // must be alpha

export const identAfterFirstLetter = /\w/; // alphanumeric and underscore

export const customTokens = {
  illegalOpcode: {
    values: [// illegal ops
    "SLO", "RLA", "SRE", "RRA", "SAX", "LAX", "DCP", "ISC", "ANC", "ALR", "ARR", "XAA", "AXS", "AHX", "SHY", "SHX", "TAS", "LAS"],
    boundary: "\\b"
  },
  pseudoOp: {
    values: [// pre-processor pseudo-ops (not a complete list!)
    "BYTE", "WORD", "DS", "ORG", "RORG", "ALIGN", "MAC", "ENDM", "SUBROUTINE"],
    boundary: "\\b"
  }
};
export const customParseRules = [function (context: ParserContext): Token | null | undefined {
  if (!context.reader.match("#")) return null;
  // Quick and dirty: everything between "#" (inclusive) and whitespace
  // (exclusive) is a constant too dirty.  Need to account for parens and
  // square brackets, whitespace can appear inside them. New routine: once
  // inside () or [], anything goes, but once outside, terminate with
  // whitespace
  let value = context.reader.read();
  let parenCount = 0;
  let bracketCount = 0;

  for (;;) {
    const peek = context.reader.peek();
    if (parenCount === 0 && bracketCount === 0 && /\s/.test(peek)) break;
    if (peek === ")" && parenCount > 0) parenCount--;
    if (peek === "]" && bracketCount > 0) bracketCount--;
    if (peek === "(") parenCount++;
    if (peek === "[") bracketCount++;
    value += context.reader.read();
  }

  return context.createToken("constant", value);
}, // labels
function (): (arg0: ParserContext) => Token | null | undefined {
  const validLabelOps = ["BCC", "BCS", "BEQ", "BMI", "BNE", "BPL", "BVC", "BVS", "JMP", "JSR"];
  return function (context: ParserContext): Token | null | undefined {
    if (!/[A-Za-z]/.test(context.reader.peek())) return null;
    const prevToken = util.getPreviousNonWsToken(context.getAllTokens(), context.count());
    // Check if it is just a regular ident.
    if ((!prevToken || prevToken.name !== "keyword" || !util.contains(validLabelOps, prevToken.value, true)) && context.count() > 0 && !/\n$/.test(context.defaultData.text)) return null;
    // Read until the end of the ident.
    let label = context.reader.read();

    while (!context.reader.isEOF() && /\w/.test(context.reader.peek())) label += context.reader.read();

    return context.createToken("label", label);
  };
}()];
export const caseInsensitive = true;

/**
 * Number parser of 6502asm.
 * TODO: parsing appears to be incorrect. But needs specs before fixing.
 * @param {ParserContext} context
 * @returns {Token?}
 */
export function numberParser(context: ParserContext): Token | null | undefined {
  const current = context.reader.peek();
  let number;

  // is first char a digit?
  if (!/\d/.test(current)) {
    // does it start with "$" (hex) or "%" (binary)?
    if (current !== "$" && current !== "%") return null;
    // hex/binary number
    number = context.reader.read(2);
  } else {
    number = context.reader.read(1);
    // is it a decimal?
    if (context.reader.peek() === ".") number += context.reader.read();
  }

  // easy way out: read until it's not a number or letter a-f
  // this will work for hex ($FF), octal (012), decimal and binary
  while (!context.reader.isEOF() && /[A-Fa-f0-9]/.test(context.reader.peek())) number += context.reader.read();

  return context.createToken("number", number);
}