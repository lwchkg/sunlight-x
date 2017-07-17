export const isIe = !+'\v1';
export const EOL = isIe ? '\r' : '\n';
export const EMPTY = function() {
  return null;
};
export const DEFAULT_LANGUAGE = 'plaintext';
export const DEFAULT_CLASS_PREFIX = 'sunlight-';

// global sunlight variables
export const globalOptions = {
  tabWidth: 4,
  classPrefix: DEFAULT_CLASS_PREFIX,
  showWhitespace: false,
  maxHeight: false,
};
export const events = {
  beforeHighlightNode: [],
  beforeHighlight: [],
  beforeTokenize: [],
  afterTokenize: [],
  beforeAnalyze: [],
  afterAnalyze: [],
  afterHighlight: [],
  afterHighlightNode: [],
};
