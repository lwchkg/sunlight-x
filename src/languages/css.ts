import * as util from "../util";
import type { ParserContext, Token } from "../util";

/**
 * Peek selector token.
 * @param {Object} context
 * @returns {Object}
 */
function peekSelectorToken(context: ParserContext): string | null {
  // make sure it's not part of a property value
  // basically if we run into "{" before "}" it's bad
  const walker = context.getTokenWalker();

  while (walker.hasPrev()) {
    const token = walker.prev();
    if (token.name === "punctuation" && token.value === "}") break;else if (token.name === "punctuation" && token.value === "{") return null;
  }

  // now check to make sure we run into a { before a ;
  let value = "";
  let appendToValue = true;

  for (let offset = 1;; offset++) {
    const peek = context.reader.peekWithOffset(offset);
    if (peek === "") break;

    if (/[^\w-]/.test(peek)) {
      appendToValue = false;
      if (peek === "{") break;
      if (peek === ";") return null;
    } else if (appendToValue) {
      value += peek;
    }
  }

  return value;
}

export const name = "css";
export const caseInsensitive = true;
export const keywords = [// background (http://www.w3.org/TR/css3-background/)
"background-color", "background-image", "background-repeat", "background-attachment", "background-position", "background-clip", "background-origin", "background-size", "background", // border
"border-collapse", "border-top-style", "border-right-style", "border-left-style", "border-bottom-style", "border-style", "border-top-width", "border-right-width", "border-left-width", "border-bottom-width", "border-width", "border-top-color", "border-right-color", "border-left-color", "border-bottom-color", "border-color", "border-radius", "border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius", "border-image-repeat", "border-image-source", "border-image-slice", "border-image-width", "border-image-outset", "border-image", "border-top", "border-bottom", "border-right", "border-left", "border-spacing", "border", // miscellaneous effects
"box-decoration-break", "box-shadow", // speech (http://www.w3.org/TR/css3-speech/)
"voice-volume", "voice-balance", "pause-before", "pause-after", "pause", "rest-before", "rest-after", "rest", "cue-before", "cue-after", "cue", "mark-before", "mark-after", "mark", "voice-family", "voice-rate", "voice-pitch", "voice-pitch-range", "voice-stress", "voice-duration", "phonemes", "speak-header", "speak-numeral", "speak-punctuation", "pitch-range", "play-during", "richness", "speak", "speech-rate", // ui (http://www.w3.org/TR/css3-ui/)
"appearance", "icon", "box-sizing", "outline-width", "outline-style", "outline-color", "outline-offset", "outline", "resize", "cursor", "nav-index", "nav-up", "nav-right", "nav-down", "nav-left", // box-model (http://www.w3.org/TR/css3-box/)
"display", "position", "float", "clear", "visibility", "bottom", "top", "left", "right", "overflow", "overflow-x", "overflow-y", "overflow-style", "marquee-style", "marquee-direction", "marquee-play-count", "marquee-speed", "padding-top", "padding-right", "padding-bottom", "padding-left", "padding", "margin-top", "margin-right", "margin-bottom", "margin-left", "margin", "width", "height", "min-width", "max-width", "min-height", "max-height", "rotation-point", "rotation", // text (http://www.w3.org/TR/css3-text/)
"white-space-collapsing", "white-space", "line-break", "word-break", "hyphens", "hyphenate-character", "hyphenate-limit-before", "hyphenate-limit-after", "hyphenate-limit-lines", "hyphenate-limit-last", "hyphenate-resource", "text-wrap", "word-wrap", "text-align-first", "text-align-last", "text-align", "text-justify", "word-spacing", "letter-spacing", "text-trim", "text-autospace", "text-indent", "hanging-punctuation", "text-decoration-line", "text-decoration-color", "text-decoration-style", "text-decoration-skip", "text-decoration", "text-underline-position", "text-emphasis-position", "text-emphasis-style", "text-emphasis-color", "text-emphasis", "text-shadow", "text-outline", "text-transform", "vertical-align", // writing modes (http://www.w3.org/TR/css3-writing-modes/)
"direction", "unicode-bidi", "writing-mode", "text-orientation", "text-combine", // color (http://www.w3.org/TR/css3-color/)
"color", "opacity", // font (http://www.w3.org/TR/css3-fonts/)
"font-family", "font-weight", "font-stretch", "font-style", "font-size-adjust", "font-size", "font-synthesis", "src", "unicode-range", "font-feature-settings", "font-kerning", "vertical-position", "font-variant-ligatures", "font-variant-caps", "font-variant-numeric", "font-variant-alternates", "font-variant-east-asian", "font-variant", "font-feature-settings", "font-language-override", "font", "line-height", "text-height", // transformations (http://www.w3.org/TR/css3-2d-transforms/ & http://www.w3.org/TR/css3-3d-transforms/)
"transform-origin", "transform-style", "perspective-origin", "perspective", "backface-visibility", "transform", // transition (http://www.w3.org/TR/css3-transitions/)
"transition-property", "transition-duration", "transition-timing-function", "transition-delay", // lists (http://www.w3.org/TR/css3-lists/)
"list-style-type", "list-style-image", "list-style-position", "list-style", // multi-column (http://www.w3.org/TR/css3-multicol/)
"column-width", "column-count", "colunns", "column-gap", "column-rule-color", "column-rule-style", "column-rule-width", "column-rule", "break-before", "break-after", "break-inside", "column-span", "column-fill", // tables
"caption-side", "table-layout", "empty-cells", // print
"fit-position", "fit", "image-orientation", "orphans", "page-break-after", "page-break-before", "page-break-inside", "page", "size", "widows", // other
"content", "z-index", "counter-increment", "counter-reset", "azimuth", "elevation", "quotes", "filter", "zoom", // vendor specific
"-moz-appearance", "-moz-background-clip", "-moz-background-inline-policy", "-moz-background-origin", "-moz-background-size", "-moz-binding", "-moz-border-bottom-colors", "-moz-border-left-colors", "-moz-border-right-colors", "-moz-border-top-colors", "-moz-border-end", "-moz-border-end-color", "-moz-border-end-style", "-moz-border-end-width", "-moz-border-image", "-moz-border-start", "-moz-border-start-color", "-moz-border-start-style", "-moz-border-start-width", "-moz-box-align", "-moz-box-direction", "-moz-box-flex", "-moz-box-flexgroup", "-moz-box-ordinal-group", "-moz-box-orient", "-moz-box-pack", "-moz-box-sizing", "-moz-column-count", "-moz-column-gap", "-moz-column-width", "-moz-column-rule", "-moz-column-rule-width", "-moz-column-rule-style", "-moz-column-rule-color", "-moz-float-edge", "-moz-font-feature-settings", "-moz-font-language-override", "-moz-force-broken-image-icon", "-moz-image-region", "-moz-margin-end", "-moz-margin", "-moz-opacity", "-moz-outline", "-moz-outline-color", "-moz-outline-offset", "-moz-outline-radius", "-moz-outline-radius-bottomleft", "-moz-outline-radius-bottomright", "-moz-outline-radius-topleft", "-moz-outline-radius-topright", "-moz-outline-style", "-moz-outline-width", "-moz-padding-end", "-moz-padding-start", "-moz-stack-sizing", "-moz-tab-size", "-moz-transform", "-moz-transform-origin", "-moz-transition", "-moz-transition-delay", "-moz-transition-duration", "-moz-transition-property", "-moz-transition-timing-function", "-moz-user-focus", "-moz-user-input", "-moz-user-modify", "-moz-user-select", "-moz-window-shadow", "-webkit-appearance", "-webkit-background-clip", "-webkit-background-composite", "-webkit-background-origin", "-webkit-background-size", "-webkit-binding", "-webkit-border-bottom-left-radius", "-webkit-border-bottom-right-radius", "-webkit-border-fit", "-webkit-border-horizontal-spacing", "-webkit-border-image", "-webkit-border-radius", "-webkit-border-top-left-radius", "-webkit-border-top-right-radius", "-webkit-border-vertical-spacing", "-webkit-box-align", "-webkit-box-direction", "-webkit-box-flex", "-webkit-box-flex-group", "-webkit-box-lines", "-webkit-box-ordinal-group", "-webkit-box-orient", "-webkit-box-pack", "-webkit-box-shadow", "-webkit-box-sizing", "-webkit-column-break-after", "-webkit-column-break-before", "-webkit-column-break-inside", "-webkit-column-count", "-webkit-column-gap", "-webkit-column-rule", "-webkit-column-rule-color", "-webkit-column-rule-style", "-webkit-column-rule-width", "-webkit-column-width", "-webkit-columns", "-webkit-dashboard-region", "-webkit-font-size-delta", "-webkit-highlight", "-webkit-line-break", "-webkit-line-clamp", "-webkit-margin-bottom-collapse", "-webkit-margin-collapse", "-webkit-margin-start", "-webkit-margin-top-collapse", "-webkit-marquee", "-webkit-marquee-direction", "-webkit-marquee-increment", "-webkit-marquee-repetition", "-webkit-marquee-speed", "-webkit-marquee-style", "-webkit-match-nearest-mail-blockquote-color", "-webkit-nbsp-mode", "-webkit-padding-start", "-webkit-rtl-ordering", "-webkit-text-decorations-in-effect", "-webkit-text-fill-color", "-webkit-text-security", "-webkit-text-size-adjust", "-webkit-text-stroke", "-webkit-text-stroke-color", "-webkit-text-stroke-width", "-webkit-user-drag", "-webkit-user-modify", "-webkit-user-select", "-o-border-image", "-o-device-pixel-ratio", "-o-linear-gradient", "-o-repeating-linear-gradient", "-o-object-fit", "-o-object-position", "-o-tab-size", "-o-table-baseline", "-o-transform", "-o-transform-origin", "-o-transition", "-o-transition-delay", "-o-transition-duration", "-o-transition-property", "-o-transition-timing-function", "-o-zoom-in", "-o-zoom-out", "-ms-accelerator", "-ms-background-position-x", "-ms-background-position-y", "-ms-behavior", "-ms-block-progression", "-ms-filter", "-ms-ime-mode", "-ms-layout-grid", "-ms-layout-grid-char", "-ms-layout-grid-line", "-ms-layout-grid-mode", "-ms-layout-grid-type", "-ms-line-break", "-ms-line-grid-mode", "-ms-interpolation-mode", "-ms-overflow-x", "-ms-overflow-y", "-ms-scrollbar-3dlight-color", "-ms-scrollbar-arrow-color", "-ms-scrollbar-base-color", "-ms-scrollbar-darkshadow-color", "-ms-scrollbar-face-color", "-ms-scrollbar-highlight-color", "-ms-scrollbar-shadow-color", "-ms-scrollbar-track-color", "-ms-text-align-last", "-ms-text-autospace", "-ms-text-justify", "-ms-text-kashida-space", "-ms-text-overflow", "-ms-text-underline-position", "-ms-word-break", "-ms-word-wrap", "-ms-writing-mode", "-ms-zoom"];
export const customParseRules = [// functions
function (): (arg0: ParserContext) => Token | null | undefined {
  const functions = util.createHashMap(["matrix", "translate", "translateX", "translateY", "scaleX", "scaleY", "rotate", "skewX", "skewY", "skew", "translate3d", "scaleZ", "translateZ", "rotate3d", "perspective", "url", // ie filters
  "alpha", "basicimage", "blur", "dropshadow", "engrave", "glow", "light", "maskfilter", "motionblur", "shadow", "wave"], "\\b", true);
  return function (context: ParserContext): Token | null | undefined {
    const token = util.matchWord(context, functions, "function", true);
    if (!token) return null;

    // the next non-whitespace character must be a "("
    for (let offset = token.value.length;; offset++) {
      const peek = context.reader.peekWithOffset(offset);
      if (peek === "") return null;

      if (peek === "(") {
        // this token really is a function
        context.reader.read(token.value.length);
        return token;
      }

      if (!/^\s$/.test(peek)) return null;
    }
  };
}(), // pseudo classes
function (): (arg0: ParserContext) => Token | null | undefined {
  const pseudoClasses = util.createHashMap([// http://www.w3.org/TR/css3-selectors/#selectors
  "root", "nth-child", "nth-last-child", "nth-of-type", "nth-last-of-type", "first-child", "last-child", "first-of-type", "last-of-type", "only-child", "only-of-type", "empty", "link", "visited", "active", "hover", "focus", "target", "lang", "enabled", "disabled", "checked", "first-line", "first-letter", "before", "after", "not", // http//www.w3.org/TR/css3-ui/#pseudo-classes
  "read-only", "read-write", "default", "valid", "invalid", "in-range", "out-of-range", "required", "optional"], "\\b", true);
  return function (context: ParserContext): Token | null | undefined {
    const previousToken = util.getPreviousNonWsToken(context.getAllTokens(), context.count());
    if (!previousToken || previousToken.name !== "operator" || previousToken.value !== ":") return null;
    return util.matchWord(context, pseudoClasses, "pseudoClass");
  };
}(), // pseudo elements
function (): (arg0: ParserContext) => Token | null | undefined {
  const pseudoElements = util.createHashMap(["before", "after", "value", "choices", "repeat-item", "repeat-index", "marker"], "\\b", true);
  return function (context: ParserContext): Token | null | undefined {
    const previousToken = util.getPreviousNonWsToken(context.getAllTokens(), context.count());
    if (!previousToken || previousToken.name !== "operator" || previousToken.value !== "::") return null;
    return util.matchWord(context, pseudoElements, "pseudoElement");
  };
}(), // classes
function (context: ParserContext): Token[] | null | undefined {
  // we can't just make this a scope because we'll get false positives for things like ".png" in url(image.png) (image.png doesn't need to be in quotes)
  // so we detect them the hard way
  if (!context.reader.match(".")) return null;
  const className = peekSelectorToken(context);
  if (className === null) return null;
  context.reader.read(className.length + 1);
  return [context.createToken("operator", "."), context.createToken("class", className)];
}, // element selctors (div, html, body, etc.)
function (context: ParserContext): Token | null | undefined {
  if (!/[A-Za-z_]/.test(context.reader.peek())) return null;
  const prevToken = util.getPreviousNonWsToken(context.getAllTokens(), context.count());
  if (prevToken && prevToken.name === "operator" && (prevToken.value === ":" || prevToken.value === "::")) return null;
  const tagName = peekSelectorToken(context);
  if (tagName === null) return null;
  return context.createToken("element", context.reader.read(tagName.length + 1));
}, // hex color value
function (context: ParserContext): Token | null | undefined {
  if (!context.reader.match("#")) return null;
  let length: number = 1;
  let nonHex: boolean = false;

  for (let offset = 1;; offset++) {
    const peek = context.reader.peekWithOffset(offset);
    if (peek === "" || peek === "}" || peek === ";") break;
    // must be between ":" and ";" basically if we run into a "{" before a "}
    // it's an id selector instead.
    if (peek === "{") return null;
    if (nonHex) continue;
    if (/[A-Fa-f0-9]/.test(peek)) length++;else nonHex = true;
  }

  // Should not be the "#" character alone without any hex digits following.
  if (length === 1) return null;
  return context.createToken("hexColor", context.reader.read(length));
}];

// The number parser interprets numbers with their units (including %). Since
// new units may emerge, we accept any word or the % sign.
const numberLiteral: string = ((): string => {
  const sign = "[+-]?";
  const int = "[0-9]+";
  const value = sign + util.nonCapturingGroup(["[0-9]*\\." + int, int]);
  const exponent = "E[+-]?" + int;
  const unit = "(?:[a-z]+|%)?";
  return value + util.nonCapturingGroup(exponent, "?") + unit;
})();

export const numberParser = util.getRegexpParser("number", new RegExp("^" + numberLiteral, "i"));
export const customTokens = {
  rule: {
    values: ["@import", "@media", "@font-face", "@phonetic-alphabet", "@hyphenate-resource", "@font-feature-values", "@charset", "@namespace", "@page", "@bottom-left-corner", "@bottom-left", "@bottom-center", "@bottom-right", "@bottom-right-corner", "@top-left-corner", "@top-left", "@top-center", "@top-right", "@top-right-corner"],
    boundary: "\\b"
  },
  microsoftFilterPrefix: {
    values: ["progid:DXImageTransform.Microsoft"],
    boundary: "\\b"
  },
  importantFlag: {
    values: ["!important"],
    boundary: "\\b"
  }
};
export const scopes = {
  string: [['"', '"', ['\\"', "\\\\"], false], ["'", "'", ["\\'", "\\\\"], false]],
  comment: [["/*", "*/", [], false]],
  id: [["#", {
    length: 1,
    regex: /[^\w-]/
  }, [], true]]
};
export const identFirstLetter = /[A-Za-z-]/;
export const identAfterFirstLetter = /[\w-]/;
export const operators = ["::", ":", ">", "+", "~=", "^=", "$=", "|=", "=", ".", "*"];