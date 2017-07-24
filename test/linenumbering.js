// @flow

import assert from "assert";
import { TestSupport } from "./fixtures/testsupport.js";

const lineNumberExtractorRegExp = /^#sunlight-\d+-line-(\d+)$/;

/**
 * Asserts that the line numbers in the code are expected.
 * @param {TestSupport} testSupport Test support object.
 * @param {number} lineNumberStart The starting line number.
 */
function checkLineNumbers(
  testSupport: TestSupport,
  lineNumberStart: number = 1
) {
  const lineNumberElements = testSupport.querySelectorAll(
    "[href|=\\#sunlight][href*=-line-]"
  );

  lineNumberElements.forEach((node: Element, index: number) => {
    const attribute = node.getAttribute("href") || "";
    const match: ?(string[]) = attribute.match(lineNumberExtractorRegExp);
    const lineNumber: string = (match && match[1]) || "";
    assert.notStrictEqual("", lineNumber);
    assert.strictEqual(lineNumberStart + index, Number.parseInt(lineNumber));
  });
}

describe("Line numbering plugin", function() {
  it("adds line numbering which starts from 1 as default", function() {
    const options = { lineNumbers: true };
    const testSupport = new TestSupport("javascript.js", "javascript", options);
    assert.strictEqual(
      true,
      testSupport.DoesElementsWithClassNameExist("line-number-margin")
    );

    checkLineNumbers(testSupport, 1);
  });

  it("does not add line numbering if lineNumbers is set to false", function() {
    const options = { lineNumbers: false };
    const testSupport = new TestSupport("javascript.js", "javascript", options);
    assert.strictEqual(
      false,
      testSupport.DoesElementsWithClassNameExist("line-number-margin")
    );
  });

  it("adds line numbering which starts the specified line number", function() {
    const lineNumberStart = 100;
    const options = { lineNumbers: true, lineNumberStart: lineNumberStart };
    const testSupport = new TestSupport("javascript.js", "javascript", options);
    assert.strictEqual(
      true,
      testSupport.DoesElementsWithClassNameExist("line-number-margin")
    );

    checkLineNumbers(testSupport, lineNumberStart);
  });
});
