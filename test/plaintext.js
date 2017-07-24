// @flow

import assert from "power-assert";
const fs = require("fs");
const path = require("path");
import { TEXT_NODE } from "../src/constants.js";
import { nbsp, TestSupport } from "./fixtures/testsupport.js";

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
      const testSupport = new TestSupport(snippetFileName, test.language);

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
