import assert from "assert";
import { TestSupportForFile } from "./fixtures/testsupport";
const lineNumberExtractorRegExp = /^#sunlight-\d+-line-(\d+)$/;

/**
 * Asserts that the line numbers in the code are expected.
 * @param {TestSupportForFile} testSupport Test support object.
 * @param {number} lineNumberStart The starting line number.
 */
function checkLineNumbers(testSupport: TestSupportForFile, lineNumberStart: number = 1) {
  const lineNumberElements = testSupport.querySelectorAll("[href|=\\#sunlight][href*=-line-]");
  lineNumberElements.forEach((node: Element, index: number) => {
    const attribute = node.getAttribute("href") || "";
    const match: string[] | null | undefined = attribute.match(lineNumberExtractorRegExp);
    const lineNumber: string = match && match[1] || "";
    assert.notStrictEqual(lineNumber, "");
    assert.strictEqual(Number.parseInt(lineNumber), lineNumberStart + index);
  });
}

describe("Line numbering plugin", function () {
  it("adds line numbering which starts from 1 as default", function () {
    const options = {
      lineNumbers: true
    };
    const testSupport = new TestSupportForFile("javascript.js", "javascript", options);
    assert.strictEqual(testSupport.DoesElementsWithClassNameExist("line-number-margin"), true);
    checkLineNumbers(testSupport, 1);
  });
  it("does not add line numbering if lineNumbers is set to false", function () {
    const options = {
      lineNumbers: false
    };
    const testSupport = new TestSupportForFile("javascript.js", "javascript", options);
    assert.strictEqual(testSupport.DoesElementsWithClassNameExist("line-number-margin"), false);
  });
  it("adds line numbering which starts the specified line number", function () {
    const lineNumberStart = 100;
    const options = {
      lineNumbers: true,
      lineNumberStart: lineNumberStart
    };
    const testSupport = new TestSupportForFile("javascript.js", "javascript", options);
    assert.strictEqual(testSupport.DoesElementsWithClassNameExist("line-number-margin"), true);
    checkLineNumbers(testSupport, lineNumberStart);
  });
});