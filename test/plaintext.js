// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import assert from "assert";
const fs = require("fs");
const path = require("path");
import { TEXT_NODE } from "../src/constants.js";
import { nbsp, TestSupportForFile } from "./fixtures/testsupport.js";

describe("Plaintext tests", function() {
  const tests = [
    {
      name: "renders plaintext correctly",
      language: "plaintext"
    },
    {
      name: "render invalid languages as plaintext",
      language: "asdf"
    }
  ];

  tests.forEach(function(test: { name: string, language: string }) {
    it(test.name, function() {
      const snippetFileName = "plaintext.txt";
      const testSupport = new TestSupportForFile(snippetFileName, test.language);

      const expected = fs
        .readFileSync(
          path.join(__dirname, "code-snippets", snippetFileName),
          "utf8"
        )
        .replace(/ /g, nbsp)
        .replace(/\t/g, nbsp.repeat(4));

      const elements = testSupport.GetElementsWithClassName("plaintext");
      assert.strictEqual(1, elements.length);
      assert.strictEqual(1, elements[0].childNodes.length);

      const textElement = elements[0].childNodes[0];
      assert.strictEqual(TEXT_NODE, textElement.nodeType);
      assert.strictEqual(expected, textElement.nodeValue);
    });
  });
});
