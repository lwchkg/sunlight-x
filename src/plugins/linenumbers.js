/**
 * Sunlight line number/line highlighting plugin
 *
 * This creates the line number gutter in addition to creating the line highlighting
 * overlay (if applicable). It is bundled in sunlight-min.js.
 *
 * Options:
 *  - lineNumbers: true/false/"automatic" (default is "automatic")
 *  - lineNumberStart: <number> (line number to start from, default is 1)
 *  - lineHighlight: <array> (array of line numbers to highlight)
 */

// @flow

import { TEXT_NODE } from "../constants.js";
import { AfterHighlightNodeEvent } from "../events.js";
import { globalOptions } from "../globalOptions.js";
import { warnInvalidValue } from "../logger.js";
import * as util from "../util.js";

import { document } from "../jsdom.js";

import type { AfterHighlightNodeEventArgs } from "../events.js";
import type { SunlightOptionsType } from "../globalOptions.js";
import type { Highlighter } from "../highlighter.js";

type LineNumberOptionsType = {
  lineNumbers: boolean,
  lineNumberStart: number,
  lineHighlight: number[]
};

const defaultLineNumberOptions: LineNumberOptionsType = {
  lineNumbers: false, // TODO: was "automatic"
  lineNumberStart: 1,
  lineHighlight: []
};
const eolElement = document.createTextNode(util.eol);

/**
 * Get line numbering options from Sunlight highlighter options, and do
 * validation. Invalid options are logged.
 * @param {SunlightOptionsType} options
 * @returns {LineNumberOptionsType}
 */
function getLineNumberOptions(
  options: SunlightOptionsType
): LineNumberOptionsType {
  const logger = console;
  const parsedOptions: LineNumberOptionsType = Object.assign(
    {},
    defaultLineNumberOptions
  );

  if (typeof options.lineNumbers === "boolean")
    parsedOptions.lineNumbers = options.lineNumbers;
  else
    warnInvalidValue(
      "Option lineNumbers must be boolean.",
      options.lineNumbers
    );

  if (
    // TODO: remove typeof check when Flow issue #4441 is resolved.
    typeof options.lineNumberStart === "number" &&
    Number.isInteger(options.lineNumberStart) &&
    options.lineNumberStart >= 0
  )
    parsedOptions.lineNumberStart = options.lineNumberStart;
  else
    warnInvalidValue(
      "Option lineNumberStart must be a non-negative integer.",
      options.lineNumberStart
    );

  if (Array.isArray(options.lineHighlight)) {
    // TODO: remove typeof check when Flow issue #4441 is resolved.
    for (const line: mixed of options.lineHighlight)
      if (typeof line === "number" && Number.isInteger(line) && line >= 0)
        if (parsedOptions.lineHighlight.indexOf(line) >= 0)
          parsedOptions.lineHighlight.push(line);
        else
          logger.warn(
            "Duplicate elements in option lineHighlight found.",
            line
          );
      else
        logger.warn(
          "Elements of option lineHighlight must be a non-negative integer.",
          line
        );
    parsedOptions.lineHighlight.sort();
  } else {
    logger.warn(
      "Option lineHighlight must be an array of non-negative integers.",
      options.lineHighlight
    );
  }

  return parsedOptions;
}

/**
 * Get the line count
 * TODO: rewrite in non-functional manner.
 * @param {Element} node
 * @returns {number}
 */
function getLineCount(node: Element): number {
  // browsers don't render the last trailing newline, so we make sure that the
  // line numbers reflect that by disregarding the last trailing newline

  // get the last text node
  const lastTextNode = (function getLastNode(node: Node): ?Node {
    if (!node.lastChild) return null;
    if (node.lastChild.nodeType === TEXT_NODE) return node.lastChild;
    return getLastNode(node.lastChild);
  })(node) || { nodeValue: "" };

  return (
    node.innerHTML.replace(/[^\n]/g, "").length -
    (/\n$/.test(lastTextNode.nodeValue) ? 1 : 0)
  );
}

/**
 * Add line numbers to the highlighted nodes, if configured to do so.
 * @param {Highlighter} highlighter
 * @param {Object} context
 */
function maybeAddLineNumbers(
  highlighter: Highlighter,
  context: AfterHighlightNodeEventArgs
) {
  const codeContainer = context.codeContainer;
  if (!codeContainer) return;

  const options: LineNumberOptionsType = getLineNumberOptions(
    highlighter.options
  );
  if (!options.lineNumbers) return;

  // Skip if it's not a block level element or the lineNumbers option is not set
  // to "automatic"
  if (
    highlighter.options.lineNumbers === "automatic" &&
    util.getComputedStyle(context.node, "display") !== "block"
  )
    return;

  const lineHighlightOverlay: HTMLElement = document.createElement("div");
  const lineHighlightingEnabled = options.lineHighlight.length > 0;
  if (lineHighlightingEnabled)
    lineHighlightOverlay.className =
      highlighter.options.classPrefix + "line-highlight-overlay";

  const lineContainer = document.createElement("pre");
  lineContainer.className =
    highlighter.options.classPrefix + "line-number-margin";

  const lineCount = getLineCount(context.node);
  for (
    let i = options.lineNumberStart;
    i <= options.lineNumberStart + lineCount;
    ++i
  ) {
    const link = document.createElement("a");
    const name =
      (context.node.id
        ? context.node.id
        : highlighter.options.classPrefix + context.count) +
      "-line-" +
      i;

    link.setAttribute("name", name);
    link.setAttribute("href", "#" + name);

    link.appendChild(document.createTextNode(i.toString()));
    lineContainer.appendChild(link);
    lineContainer.appendChild(eolElement.cloneNode(false));

    if (lineHighlightingEnabled) {
      const currentLineOverlay = document.createElement("div");
      if (options.lineHighlight.indexOf(i) >= 0)
        currentLineOverlay.className =
          highlighter.options.classPrefix + "line-highlight-active";

      lineHighlightOverlay.appendChild(currentLineOverlay);
    }
  }

  codeContainer.insertBefore(lineContainer, codeContainer.firstChild);

  if (lineHighlightingEnabled) codeContainer.appendChild(lineHighlightOverlay);

  // enable the border on the code container
  codeContainer.style.borderWidth = "1px";
  codeContainer.style.borderStyle = "solid";
}

// Initialization of plugin
AfterHighlightNodeEvent.addListener(maybeAddLineNumbers);

Object.assign(globalOptions, defaultLineNumberOptions);
