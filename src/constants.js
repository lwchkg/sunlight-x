export const isIe = !+'\v1';
export const EOL = isIe ? '\r' : '\n';
export const EMPTY = function() {
  return null;
};
export const DEFAULT_LANGUAGE = 'plaintext';
export const DEFAULT_CLASS_PREFIX = 'sunlight-';

export const TEXT_NODE = 3;
