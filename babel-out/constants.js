'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isIe = exports.isIe = !+'\v1';
var EOL = exports.EOL = isIe ? '\r' : '\n';
var EMPTY = exports.EMPTY = function EMPTY() {
  return null;
};
var DEFAULT_LANGUAGE = exports.DEFAULT_LANGUAGE = 'plaintext';
var DEFAULT_CLASS_PREFIX = exports.DEFAULT_CLASS_PREFIX = 'sunlight-';

// global sunlight variables
var globalOptions = exports.globalOptions = {
  tabWidth: 4,
  classPrefix: DEFAULT_CLASS_PREFIX,
  showWhitespace: false,
  maxHeight: false
};
var events = exports.events = {
  beforeHighlightNode: [],
  beforeHighlight: [],
  beforeTokenize: [],
  afterTokenize: [],
  beforeAnalyze: [],
  afterAnalyze: [],
  afterHighlight: [],
  afterHighlightNode: []
};