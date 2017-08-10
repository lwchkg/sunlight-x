// @flow
import assert from "assert";
import { Highlighter } from "../src/sunlight.js";
const highlighter = new Highlighter();

describe("API tests", function() {
  it("all highlight functions have equivalent output", function() {
    const code = 'console.log("test")\nconsole.log("test")';
    const language = "javascript";

    // Highlight code using the given APIs. The node counts must be reset before
    // highlighting, otherwise the HTML generated will be unequal.
    Highlighter.resetNodeCount();
    const highlightedCode = highlighter.highlightCode(code, language);

    Highlighter.resetNodeCount();
    const highlightedElement = highlighter.highlightCodeAsElement(
      code,
      language
    );

    // The result of the highlighting should be the same.
    assert.strictEqual(highlightedCode, highlightedElement.outerHTML);
  });

  it("highlights empty code to completion", function() {
    const codeSnippets = ["\n", " ", "\n\n", ""];
    const language = "javascript";

    // The result is useless. Anyway, it must not throw or freeze.
    for (const code of codeSnippets) highlighter.highlightCode(code, language);
  });

  it("respects theme settings", function() {
    const code = 'console.log("test")\nconsole.log("test")';
    const language = "javascript";

    const customHighlighter = new Highlighter({ theme: "abcd" });
    const classPrefix = customHighlighter.options.classPrefix;
    const highlightedElement = customHighlighter.highlightCodeAsElement(
      code,
      language
    );

    const actualThemeList = highlightedElement.className
      .split(" ")
      .filter((item: string): boolean =>
        item.startsWith(classPrefix + "theme-")
      );
    assert.deepStrictEqual(actualThemeList, [classPrefix + "theme-abcd"]);
  });
});
