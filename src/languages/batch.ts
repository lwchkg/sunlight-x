// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

/* eslint no-magic-numbers: 1 */
import * as util from "../util";
import type { ParserContext, Token } from "../util";
export const name = "batch";
export const caseInsensitive = true;
export const scopes = {
  string: [['"', '"', ['\\"', "\\\\"], false]],
  comment: [["REM", "\n", [], true], ["::", "\n", [], true]],
  variable: [["%", {
    regex: /[^\w%]/,
    length: 1
  }, [], true]]
};
export const customParseRules = [// Labels
function (context: ParserContext): Token[] | null | undefined {
  if (!context.reader.isPrecededByWhitespaceOnly() || !context.reader.match(":")) return null;
  // Not a label if "::", end of line, or ":" followed by a whitespace.
  const peek = context.reader.peekWithOffset(1);
  if (peek === ":" || peek === "" || /\s/.test(peek)) return null;
  // Label. Read until whitespace.
  context.reader.read();
  let value = context.reader.read();

  while (!context.reader.isEOF() && !/\s/.test(context.reader.peek())) value += context.reader.read();

  if (value === "") return null;
  return [context.createToken("operator", ":"), context.createToken("label", value)];
}, // Label after goto statements
function (context: ParserContext): Token | null | undefined {
  if (!util.IsFollowsRuleSatisfied(context.getTokenWalker(), [{
    token: "keyword",
    values: ["goto"]
  }, {
    token: "operator",
    values: [":"],
    optional: true
  }], true)) return null;
  let value = context.reader.read();

  while (!context.reader.isEOF() && !/[\W]/.test(context.reader.peek())) value += context.reader.read();

  return context.createToken("label", value);
}, // keywords have to be handled manually because strings don't have to be quoted
// e.g. we don't want to highlight "do" in "echo do you have the time?"
function (): (arg0: ParserContext) => Token | null | undefined {
  const keywords = util.createHashMap([// commands
  "assoc", "attrib", "break", "bcdedit", "cacls", "call", "cd", "chcp", "chdir", "chkdsk", "chkntfs", "cls", "cmd", "color", "comp", "compact", "convertfcopy", "date", "del", "dir", "diskcomp", "diskcopy", "diskpart", "doskey", "driverquery", "echo", "endlocal", "erase", "exit", "fc", "findstr", "find", "format", "for", "fsutil", "ftype", "goto", "gpresult", "graftabl", "help", "icacls", "if", "label", "md", "mkdir", "mklink", "mode", "more", "move", "openfiles", "path", "pause", "popd", "print", "prompt", "pushd", "rd", "recover",
  /* "rem",*/
  "rename", "ren", "replace", "rmdir", "robocopy", "setlocal", "set", "schtasks", "sc", "shift", "shutdown", "sort", "start", "subst", "systeminfo", "tasklist", "taskkill", "time", "title", "tree", "type", "verify", "ver", "vol", "xcopy", "wmic", "lfnfor", // keywords
  "do", "else", "errorlevel", "exist", "in", "not", "choice", "com1", "con", "prn", "aux", "nul", "lpt1", "exit", "eof", "off", "on", "equ", "neq", "lss", "leq", "gtr", "geq"], "\\b", true);
  return function (context: ParserContext): Token | null | undefined {
    const token = util.matchWord(context, keywords, "keyword", true);
    if (!token) return null;

    // look backward for "echo" or "title" or "set" or "|" or beginning of line
    // if we find "echo" or "set" or "title" or "=" before "|" or sol then it's a fail
    if (!context.reader.isPrecededByWhitespaceOnly()) {
      const walker = context.getTokenWalker();

      while (walker.hasPrev()) {
        const prevToken = walker.prev();
        if (prevToken.name === "keyword" && util.contains(["echo", "title", "set"], prevToken.value)) return null;
        if (prevToken.name === "operator" && prevToken.value === "=") return null;
        // pipe
        if (prevToken.name === "operator" && prevToken.value === "|") break;
        // start of line
        if (prevToken.name === "default" && prevToken.value.indexOf("\n") >= 0) break;
      }
    }

    context.reader.read(token.value.length);
    return token;
  };
}()];
export const identFirstLetter = /[A-Za-z_.]/;
export const identAfterFirstLetter = /[\w-]/;
export const operators = ["&&", "||", "&", ":", "/", "==", "|", "@", "*", ">>", ">", "<", "==!", "!", "=", "+"];