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
import { bind } from "../events.js";
import { globalOptions } from "../globalOptions.js";
import * as util from "../util.js";

import { document } from "../jsdom.js";
const eolElement = document.createTextNode(util.eol);

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
function maybeAddLineNumbers(highlighter: Highlighter, context) {
  if (!highlighter.options.lineNumbers) return;

  // Skip if it's not a block level element or the lineNumbers option is not set
  // to "automatic"
  if (
    highlighter.options.lineNumbers === "automatic" &&
    util.getComputedStyle(context.node, "display") !== "block"
  )
    return;

  const lineHighlightOverlay: HTMLElement = document.createElement("div");
  const lineHighlightingEnabled = highlighter.options.lineHighlight.length > 0;
  if (lineHighlightingEnabled)
    lineHighlightOverlay.className =
      highlighter.options.classPrefix + "line-highlight-overlay";

  const lineContainer = document.createElement("pre");
  lineContainer.className =
    highlighter.options.classPrefix + "line-number-margin";

  const lineCount = getLineCount(context.node);
  for (
    let i = highlighter.options.lineNumberStart;
    i <= highlighter.options.lineNumberStart + lineCount;
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

    link.appendChild(document.createTextNode(i));
    lineContainer.appendChild(link);
    lineContainer.appendChild(eolElement.cloneNode(false));

    if (lineHighlightingEnabled) {
      const currentLineOverlay = document.createElement("div");
      if (util.contains(highlighter.options.lineHighlight, i))
        currentLineOverlay.className =
          highlighter.options.classPrefix + "line-highlight-active";

      lineHighlightOverlay.appendChild(currentLineOverlay);
    }
  }

  context.codeContainer.insertBefore(
    lineContainer,
    context.codeContainer.firstChild
  );

  if (lineHighlightingEnabled)
    context.codeContainer.appendChild(lineHighlightOverlay);

  // enable the border on the code container
  context.codeContainer.style.borderWidth = "1px";
  context.codeContainer.style.borderStyle = "solid";
}

// Initialization of plugin
bind("afterHighlightNode", maybeAddLineNumbers);

globalOptions.lineNumbers = false; // TODO: was "automatic"
globalOptions.lineNumberStart = 1;
globalOptions.lineHighlight = [];
