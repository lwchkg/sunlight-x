import { registerLanguage } from "./languages.js";

import * as plaintext from "./languages/plaintext.js";
import * as javascript from "./languages/javascript.js";
import * as php from "./languages/php.js";
import * as xml from "./languages/xml.js";
import * as css from "./languages/css.js";
import * as csharp from "./languages/csharp.js";

const languages = [plaintext, javascript, php, xml, css, csharp];

/**
 * Register the languages into Sunlight-X highlighter.
 */
export function registerLanguages() {
  languages.forEach(language => {
    registerLanguage(language);
  });
}
