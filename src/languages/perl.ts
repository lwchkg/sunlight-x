// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import * as logger from "../logger";
import * as util from "../util";
import type { ScopeType } from "../languages";
import type { ParserContext, Token } from "../util";

/* eslint require-jsdoc: 0 */
function isValidForRegexLiteral(context: ParserContext): boolean {
  const previousNonWsToken = context.token(context.count() - 1);
  // Valid if at the beginning of the file.
  if (!previousNonWsToken) return true;
  return !util.contains(["keyword", "ident", "number", "variable", "specialVariable"], previousNonWsToken.name) && !(previousNonWsToken.name === "punctuation" && !util.contains(["(", "{", "[", ",", ";"], previousNonWsToken.value));
}

function readWhileWhitespace(context: ParserContext): string {
  let value = "";

  while (!context.reader.isEOF() && /\s/.test(context.reader.peek())) value += context.reader.read();

  return value;
}

function readBetweenDelimiters(context: ParserContext, delimiter: string, appendCloser: boolean): string {
  const opener = delimiter;
  let closer;

  switch (delimiter) {
    case "[":
      closer = "]";
      break;

    case "(":
      closer = ")";
      break;

    case "{":
      closer = "}";
      break;

    default:
      closer = delimiter;
  }

  const trackCloser = util.contains(["[", "(", "{"], opener);
  let value = opener;
  let closerCount = 1;

  while (!context.reader.isEOF()) {
    const next = context.reader.read();

    // Escapes.
    if (next === "\\") {
      value += next + context.reader.read();
      continue;
    }

    if (next === opener && trackCloser) {
      closerCount++;
    } else if (next === closer) {
      closerCount--;

      if (closerCount <= 0) {
        // TODO: verify the existence of trackCloser
        if (trackCloser || appendCloser) value += next;
        break;
      }
    }

    value += next;
  }

  return value;
}

// perl allows whitespace before delimiters (wtf?)
function readDelimiterIfValid(context: ParserContext, startOffset: number): {
  delimiter: string;
  value: string;
} | false {
  let offset: number;
  let peek: string = "";

  for (offset = startOffset;; offset++) {
    peek = context.reader.peekWithOffset(offset);
    if (peek === "") return false;
    if (!/^\s$/.test(peek)) break;
  }

  if (/\w/.test(peek)) return false;
  const value = context.reader.read(offset);
  return {
    delimiter: context.reader.read(),
    value: value
  };
}

export const name = "perl";
export const keywords = ["caller", "die", "dump", "eval", "exit", "goto", "last", "next", "redo", "return", "sub", "wantarray", "break", "continue", "given", "when", "default", "import", "local", "my", "our", "state", "do", "no", "package", "require", "use", "bless", "dbmclose", "dbmopen", "ref", "tied", "untie", "tie", "if", "elsif", "else", "unless", "while", "foreach", "for", "until", "not", "or", "and"];
export const customTokens = {
  function: {
    values: ["chomp", "chop", "chr", "crypt", "hex", "index", "length", "oct", "ord", "rindex", "sprintf", "substr", "pos", "quotemeta", "split", "study", "abs", "atan2", "cos", "exp", "hex", "int", "log", "oct", "rand", "sin", "sqrt", "srand", "pop", "push", "shift", "splice", "unshift", "grep", "join", "map", "reverse", "sort", "delete", "each", "exists", "keys", "values", "binmode", "closedir", "close", "eof", "fileno", "flock", "format", "getc", "print", "printf", "readdir", "rewinddir", "say", "seekdir", "seek", "select", "syscall", "sysread", "sysseek", "tell", "telldir", "truncate", "warn", "write", "pack", "syswrite", "unpack", "vec", "chdir", "chmod", "chown", "chroot", "fcntl", "glob", "ioctl", "link", "lstat", "mkdir", "open", "opendir", "readlink", "rename", "rmdir", "stat", "symlink", "sysopen", "umask", "unlink", "utime", "defined", "dump", "eval", "formline", "reset", "scalar", "undef", "alarm", "exec", "fork", "getpgrp", "getppid", "getpriority", "kill", "pipe", "setpgrp", "setpriority", "sleep", "system", "wait", "waitpid", "accept", "bind", "connect", "getpeername", "getsockname", "getsockopt", "listen", "recv", "send", "setsockopt", "shutdown", "socket", "socketpair", "msgctl", "msgget", "msgrcv", "msgsnd", "semctl", "semget", "semop", "shmctl", "shmget", "shmread", "shmwrite", "endgrent", "endhostent", "endnetent", "endpwent", "getgrent", "getgrgid", "getgrnam", "getlogin", "getpwent", "getpwnam", "getpwuid", "setgrent", "setpwent", "endprotoent", "endservent", "gethostbyaddr", "gethostbyname", "gethostent", "getnetbyaddr", "getnetbyname", "getnetent", "getprotobyname", "getprotobynumber", "getprotoent", "getservbyname", "getservbyport", "getservent", "sethostent", "setnetent", "setprotoent", "setservent", "gmtime", "localtime", "times", "time", "lcfirst", "lc", "lock", "prototype", "readline", "readpipe", "read", "ucfirst", "uc"],
    boundary: "\\b"
  },
  // http://perldoc.perl.org/perlvar.html
  // jesus, perl...
  specialVariable: {
    values: ["$.", "$<", "$_", "$/", "$!", "$ARG", "$&", "$a", "$b", "$MATCH", "$PREMATCH", "${^MATCH}", "${^PREMATCH}", "$POSTMATCH", "$'", "$LAST_PAREN_MATCH", "$+", "$LAST_SUBMATCH_RESULT", "$^N", "$INPUT_LINE_NUMBER", "$NR", "$.", "$INPUT_RECORD_SEPARATOR", "$RS", "$OUTPUT_AUTOFLUSH", "$OFS", "$,", "@LAST_MATCH_END", "@+", "%LAST_PAREN_MATCH", "%+", "$OUTPUT_RECORD_SEPARATOR", "$ORS", "$LIST_SEPARATOR", '$"', "$SUBSCRIPT_SEPARATOR", "$SUBSEP", "$;", "$FORMAT_PAGE_NUMBER", "$%", "$FORMAT_LINES_PER_PAGE", "$=", "$FORMAT_LINES_LEFT", "$-", "@LAST_MATCH_START", "@-", "%-", "$FORMAT_NAME", "$~", "$FORMAT_TOP_NAME", "$FORMAT_LINE_BREAK_CHARACTERS", "$:", "$FORMAT_FORMFEED", "$^L", "$ACCUMULATOR", "$^A", "$CHILD_ERROR", "$?", "${^CHILD_ERROR_NATIVE}", "${^ENCODING}", "$OS_ERROR", "$ERRNO", "$!", "%OS_ERROR", "%ERRNO", "%!", "$EXTENDED_OS_ERROR", "$^E", "$EVAL_ERROR", "$@", "$PROCESS_ID", "$PID", "$$", "$REAL_USER_ID", "$UID", "$<", "$EFFECTIVE_USER_ID", "$EUID", "$>", "$REAL_GROUP_ID", "$GID", "$(", "$EFFECTIVE_GROUP_ID", "$EGID", "$)", "$PROGRAM_NAME", "$0", "$[", "$]", "$COMPILING", "$^C", "$DEBUGGING", "$^D", "${^RE_DEBUG_FLAGS}", "${^RE_TRIE_MAXBUF}", "$SYSTEM_FD_MAX", "$^F", "$^H", "%^H", "$INPLACE_EDIT", "$^I", "$^M", "$OSNAME", "$^O", "${^OPEN}", "$PERLDB", "$^P", "$LAST_REGEXP_CODE_RESULT", "$^R", "$EXCEPTIONS_BEING_CAUGHT", "$^S", "$BASETIME", "$^T", "${^TAINT}", "${^UNICODE}", "${^UTF8CACHE}", "${^UTF8LOCALE}", "$PERL_VERSION", "$^V", "$WARNING", "$^W", "${^WARNING_BITS}", "${^WIN32_SLOPPY_STAT}", "$EXECUTABLE_NAME", "$^X", "ARGV", "$ARGV", "@ARGV", "ARGVOUT", "@F", "@INC", "@ARG", "@_", "%INC", "%ENV", "$ENV", "%SIG", "$SIG", "$^", "$#array"],
    boundary: "\\W"
  }
};
export const scopes: Record<string, ScopeType[]> = {
  string: [['"', '"', util.escapeSequences.concat(['\\"']), false], ["'", "'", ["\\'", "\\\\"], false]],
  comment: [["#", "\n", [], true]],
  variable: [["$#", {
    length: 1,
    regex: /[\W]/
  }, [], true], // array count
  ["$", {
    length: 1,
    regex: /[\W]/
  }, [], true], ["@", {
    length: 1,
    regex: /[\W]/
  }, [], true], ["%", {
    length: 1,
    regex: /[\W]/
  }, [], true]]
};
export const customParseRules = [// qr/STRING/msixpo, m/PATTERN/msixpogc, /PATTERN/msixpogc, // (empty pattern), ?pattern?
// y///, tr///, s/PATTERN/REPLACEMENT/msixpogce
function (context: ParserContext): Token | null | undefined {
  if (!isValidForRegexLiteral(context)) return null;
  const currentAndNext = context.reader.peek(2);
  const current = currentAndNext.charAt(0);
  let delimiter;
  let hasReplace = false;
  let value = "";

  if (current === "/" || current === "?") {
    delimiter = context.reader.read();
  } else if (current === "m" || current === "y" || current === "s") {
    const delimiterInfo = readDelimiterIfValid(context, 1);
    if (!delimiterInfo) return null;
    value = delimiterInfo.value;
    delimiter = delimiterInfo.delimiter;
    hasReplace = current === "y" || current === "s";
  } else if (currentAndNext === "tr" || currentAndNext === "qr") {
    const delimiterInfo = readDelimiterIfValid(context, 2);
    if (!delimiterInfo) return null;
    hasReplace = current === "t";
    value = delimiterInfo.value;
    delimiter = delimiterInfo.delimiter;
  } else {
    return null;
  }

  // read the regex literal
  value += readBetweenDelimiters(context, delimiter, !hasReplace);

  if (hasReplace) {
    // apparently whitespace between search and replace is allowed, so read the whitespace, if it exists
    value += readWhileWhitespace(context);
    // new delimiter
    const fetchSecondDelimiter = util.contains(["[", "(", "{"], delimiter);

    if (fetchSecondDelimiter) {
      const delimiterInfo = readDelimiterIfValid(context, 0);

      if (delimiterInfo) {
        value += delimiterInfo.value;
        delimiter = delimiterInfo.delimiter;
      }
    }

    value += readBetweenDelimiters(context, delimiter, true);
  }

  // read the regex modifiers (we just assume any character is valid)
  while (!context.reader.isEOF() && /[A-Za-z]/.test(context.reader.peek())) value += context.reader.read();

  return context.createToken("regexLiteral", value);
}, // raw strings
function (context: ParserContext): Token | null | undefined {
  // begin with q, qw, qx, or qq  with a non-alphanumeric delimiter (opening
  // bracket/paren are closed by corresponding closing bracket/paren)
  if (!context.reader.match("q")) return null;
  let readCount = 1;
  const peek = context.reader.peekWithOffset(1);
  if (peek === "q" || peek === "w" || peek === "x") readCount++;
  if (/[A-Za-z0-9]/.test(context.reader.peekWithOffset(readCount))) // potential % operator
    return null;
  let value = context.reader.read(readCount);
  value += readBetweenDelimiters(context, context.reader.read(), true);
  return context.createToken("rawString", value);
}, // heredoc declaration (stolen from ruby)
function (context: ParserContext): Token | null | undefined {
  const opener = "<<";
  if (!context.reader.match(opener)) return null;
  // cannot be preceded by an ident or a number or a string
  const prevToken = util.getPreviousNonWsToken(context.getAllTokens(), context.count() - 1);
  if (prevToken && (prevToken.name === "ident" || prevToken.name === "number" || prevToken.name === "string")) return null;
  // can be between quotes (double, single or back) or not, or preceded by a hyphen
  let value = opener;
  context.reader.read(opener.length);
  let current = context.reader.read();

  if (current === "-") {
    value += current;
    current = context.reader.read();
  }

  let ident = "";
  let delimiter = "";
  if (util.contains(['"', "'", "`"], current)) delimiter = current;else ident = current;
  value += current;

  while (!context.reader.isEOF()) {
    const peek = context.reader.peek();
    if (peek === "\n" || delimiter === "" && /\W/.test(peek)) break;

    if (peek === "\\") {
      const peek2 = context.reader.peek(2);

      if (delimiter !== "" && util.contains(["\\" + delimiter, "\\\\"], peek2)) {
        value += peek2;
        ident += context.reader.read(2);
        continue;
      }
    }

    value += context.reader.read();
    if (delimiter !== "" && peek === delimiter) break;
    ident += peek;
  }

  if (Array.isArray(context.items.heredocQueue)) // $FlowFixMe
    context.items.heredocQueue.push(ident);else logger.errorInvalidValue(`context.items.heredocQueue is not an array.`, context.items.heredocQueue);
  return context.createToken("heredocDeclaration", value);
}, // heredoc
function (context: ParserContext): Token[] | null | undefined {
  if (!Array.isArray(context.items.heredocQueue)) {
    logger.errorInvalidValue(`context.items.heredocQueue is not an array.`, context.items.heredocQueue);
    return null;
  }

  if (context.items.heredocQueue.length === 0) return null;
  // there must have been at least one line break since the heredoc
  // declaration(s)
  if (context.defaultData.text.replace(/[^\n]/g, "").length === 0) return null;
  // we're confirmed to be in the heredoc body, so read until all of the
  // heredoc declarations have been satisfied
  const tokens: Token[] = [];

  while (Array.isArray(context.items.heredocQueue) && context.items.heredocQueue.length > 0 && !context.reader.isEOF()) {
    // $FlowFixMe
    const declaration = context.items.heredocQueue.shift();

    if (!(typeof declaration === "string")) {
      logger.errorInvalidValue(`Content of context.items.heredocQueue is not a string.`, declaration);
      break;
    }

    // read until "\n{declaration}\n"
    let value = "";

    while (!context.reader.isEOF()) {
      const peekIdent = context.reader.peek(declaration.length + 2);

      if (peekIdent === "\n" + declaration || peekIdent === "\n" + declaration + "\n") {
        value += context.reader.read(declaration.length + 2);
        break;
      }

      value += context.reader.read();
    }

    tokens.push(context.createToken("heredoc", value));
  }

  // Reset queue. This is needed if the reader reach EOF.
  context.items.heredocQueue = [];
  return tokens.length > 0 ? tokens : null;
}, // pod: http://perldoc.perl.org/perlpod.html
// stolen from ruby
function (context: ParserContext): Token | null | undefined {
  // these begin on with a line that starts with "=begin" and end with a line that starts with "=end"
  // apparently stuff on the same line as "=end" is also part of the comment
  if (!context.reader.match("=") || !context.reader.isStartOfLine()) return null;
  // read until "\n=cut" and then everything until the end of that line
  let value = context.reader.read();
  const endOfPod = "\n=cut";

  while (!context.reader.isEOF() && !context.reader.match(endOfPod)) value += context.reader.read();

  value += context.reader.read(endOfPod.length);

  while (!context.reader.isEOF() && !context.reader.match("\n")) value += context.reader.read();

  return context.createToken("docComment", value);
}];
export const identFirstLetter = /[A-Za-z_]/;
export const identAfterFirstLetter = /\w/;
export const namedIdentRules = {
  follows: [[{
    token: "keyword",
    values: ["sub"]
  }, {
    token: "default"
  }], [{
    token: "operator",
    values: ["\\&"]
  }, util.whitespace]]
};
export const operators = ["++", "+=", "+", "--", "-=", "-", "**=", "**", "*=", "*", "//=", "/=", "//", "/", "%=", "%", "=>", "=~", "==", "=", "!", "!~", "!=", "~", "~~", "\\&", "\\", "&&=", "&=", "&&", "&", "||=", "||", "|=", "|", "<<=", "<=>", "<<", "<=", "<", ">>=", ">>", ">=", ">", "^=", "^", "?", "::", ":", "...", ".=", "..", ".", ",", "x=", "x", // seriously, perl?
"lt", "gt", "le", "ge", "eq", "ne", "cmp"];
export const contextItems = {
  heredocQueue: []
};