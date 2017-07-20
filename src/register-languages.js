import { registerLanguage } from "./languages.js";

import * as plaintext from "./languages/plaintext.js";
import * as javascript from "./languages/javascript.js";

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/
export function registerLanguages() {
  [plaintext, javascript].forEach(language => {
    registerLanguage(language.name, language);
  });
}
