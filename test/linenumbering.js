import assert from "power-assert";
import { TestSupport } from "./fixtures/testsupport.js";

describe("Line numbering plugin", function() {
  it("adds line numbering if option lineNumbers is set to true", function() {
    const options = { lineNumbers: true };
    const testSupport = new TestSupport("javascript.js", "javascript", options);
    assert.strictEqual(
      true,
      testSupport.DoesElementsWithClassNameExist("line-number-margin")
    );
  });

  it("does not add line numbering if option lineNumbers is set to false", function() {
    const options = { lineNumbers: false };
    const testSupport = new TestSupport("javascript.js", "javascript", options);
    assert.strictEqual(
      false,
      testSupport.DoesElementsWithClassNameExist("line-number-margin")
    );
  });
});
