// @flow
import { registerLanguage } from "./languages.js";

import * as asm6502 from "./languages/6502asm.js";
import * as batch from "./languages/batch.js";
import * as brainfuck from "./languages/brainfuck.js";
import * as csharp from "./languages/csharp.js";
import * as css from "./languages/css.js";
import * as javascript from "./languages/javascript.js";
import * as php from "./languages/php.js";
import * as plaintext from "./languages/plaintext.js";
import * as xml from "./languages/xml.js";

const languages = [
  asm6502,
  batch,
  brainfuck,
  csharp,
  css,
  javascript,
  php,
  plaintext,
  xml
];

/**
 * Register the languages into Sunlight-X highlighter.
 */
export function registerLanguages() {
  for (const language of languages) registerLanguage(language);
}
