// @flow
import { registerLanguage } from "./languages.js";

import * as plaintext from "./languages/plaintext.js";
import * as javascript from "./languages/javascript.js";
import * as php from "./languages/php.js";
import * as xml from "./languages/xml.js";
import * as css from "./languages/css.js";
import * as csharp from "./languages/csharp.js";
import * as brainfuck from "./languages/brainfuck.js";

const languages = [plaintext, javascript, php, xml, css, csharp, brainfuck];

/**
 * Register the languages into Sunlight-X highlighter.
 */
export function registerLanguages() {
  for (const language of languages) registerLanguage(language);
}
