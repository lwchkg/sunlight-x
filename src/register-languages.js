// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { registerLanguage } from "./languages.js";

import * as actionscript from "./languages/actionscript.js";
import * as asm6502 from "./languages/6502asm.js";
import * as bash from "./languages/bash.js";
import * as batch from "./languages/batch.js";
import * as brainfuck from "./languages/brainfuck.js";
import * as cpp from "./languages/cpp.js";
import * as csharp from "./languages/csharp.js";
import * as css from "./languages/css.js";
import * as diff from "./languages/diff.js";
import * as erlang from "./languages/erlang.js";
import * as haskell from "./languages/haskell.js";
import * as httpd from "./languages/httpd.js";
import * as javascript from "./languages/javascript.js";
import * as php from "./languages/php.js";
import * as plaintext from "./languages/plaintext.js";
import * as vb from "./languages/vb.js";
import * as xml from "./languages/xml.js";

const languages = [
  actionscript,
  asm6502,
  bash,
  batch,
  brainfuck,
  cpp,
  csharp,
  css,
  diff,
  erlang,
  haskell,
  httpd,
  javascript,
  php,
  plaintext,
  vb,
  xml
];

/**
 * Register the languages into Sunlight-X highlighter.
 */
export function registerLanguages() {
  for (const language of languages) registerLanguage(language);
}
