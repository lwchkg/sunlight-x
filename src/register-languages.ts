// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { registerLanguage } from "./languages";
import * as actionscript from "./languages/actionscript";
import * as asm6502 from "./languages/6502asm";
import * as bash from "./languages/bash";
import * as batch from "./languages/batch";
import * as brainfuck from "./languages/brainfuck";
import * as cpp from "./languages/cpp";
import * as csharp from "./languages/csharp";
import * as css from "./languages/css";
import * as diff from "./languages/diff";
import * as erlang from "./languages/erlang";
import * as haskell from "./languages/haskell";
import * as httpd from "./languages/httpd";
import * as java from "./languages/java";
import * as javascript from "./languages/javascript";
import * as lisp from "./languages/lisp";
import * as lua from "./languages/lua";
import * as mysql from "./languages/mysql";
import * as nginx from "./languages/nginx";
import * as objectivec from "./languages/objective-c";
import * as perl from "./languages/perl";
import * as php from "./languages/php";
import * as plaintext from "./languages/plaintext";
import * as powershell from "./languages/powershell";
import * as python from "./languages/python";
import * as ruby from "./languages/ruby";
import * as scala from "./languages/scala";
import * as sln from "./languages/sln";
import * as tsql from "./languages/tsql";
import * as vb from "./languages/vb";
import * as xml from "./languages/xml";
const languages = [actionscript, asm6502, bash, batch, brainfuck, cpp, csharp, css, diff, erlang, haskell, httpd, java, javascript, lisp, lua, mysql, nginx, objectivec, perl, php, plaintext, powershell, python, ruby, scala, sln, tsql, vb, xml];

/**
 * Register the languages into Sunlight-X highlighter.
 */
export function registerLanguages() {
  for (const language of languages) registerLanguage(language);
}