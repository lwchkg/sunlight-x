'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegisterLanguages = RegisterLanguages;

var _plaintext = require('./languages/plaintext.js');

var plaintext = _interopRequireWildcard(_plaintext);

var _javascript = require('./languages/javascript.js');

var javascript = _interopRequireWildcard(_javascript);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/
function RegisterLanguages(sunlight) {
  [plaintext, javascript].forEach(function (language) {
    sunlight.registerLanguage(language.name, language);
  });
}