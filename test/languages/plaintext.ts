// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import assert from "assert";
import { TEXT_NODE } from "../../src/constants";
import { nbsp, GetContentOfSnippet, TestSupportForFile } from "../fixtures/testsupport";
describe("Plaintext tests", function () {
  const tests = [{
    name: "renders plaintext correctly",
    language: "plaintext"
  }, {
    name: "render invalid languages as plaintext",
    language: "asdf"
  }];
  tests.forEach(function (test: {
    name: string;
    language: string;
  }) {
    it(test.name, function () {
      const snippetFileName = "plaintext.txt";
      const testSupport = new TestSupportForFile(snippetFileName, test.language);
      const expected = GetContentOfSnippet(snippetFileName).replace(/ /g, nbsp).replace(/\t/g, nbsp.repeat(4));
      const elements = testSupport.GetElementsWithClassName("plaintext");
      assert.strictEqual(elements.length, 1);
      assert.strictEqual(elements[0].childNodes.length, 1);
      const textElement = elements[0].childNodes[0];
      assert.strictEqual(textElement.nodeType, TEXT_NODE);
      assert.strictEqual(textElement.nodeValue, expected);
    });
  });
});