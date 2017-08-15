// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import assert from "assert";
import fs from "fs";
import path from "path";
import { getCSSSync, Highlighter } from "../src/sunlight.js";
import {
  getOptionsFromString,
  TestSupportForFile
} from "./fixtures/testsupport.js";

/**
 * Returns the syntax highlighting language from the file extension.
 * @param {string} filename
 * @returns {string}
 */
function getHighlightLanguage(filename: string): string {
  const extension = path.parse(filename).ext;
  const map: { [string]: string } = {
    ".6502asm": "6502asm",
    ".as": "actionscript",
    ".bat": "batch",
    ".bf": "brainfuck",
    ".cpp": "cpp",
    ".cs": "csharp",
    ".css": "css",
    ".diff": "diff",
    ".erl": "erlang",
    ".hs": "haskell",
    ".httpdconf": "http",
    ".java": "java",
    ".js": "javascript",
    ".lisp": "lisp",
    ".lua": "lua",
    ".mm": "objective-c",
    ".nginxconf": "nginx",
    ".pl": "perl",
    ".php": "php",
    ".ps1": "powershell",
    ".py": "python",
    ".rb": "ruby",
    ".scala": "scala",
    ".sh": "bash",
    ".sln": "sln",
    ".sql": "mysql",
    ".tsql": "tsql",
    ".txt": "plaintext",
    ".vb": "vb",
    ".xml": "xml"
  };
  const language = map[extension] || "";
  assert.notStrictEqual(
    language,
    "",
    "Cannot find the language of extension " + extension
  );
  return language;
}

/**
 * Compare the expected result in the file with the actual result. If the
 * expected result does not exist, then write the expected result.
 * @param {string} filename
 * @param {string} actualContent
 */
function compareResult(filename: string, actualContent: string) {
  const resultsDir = path.join(__dirname, "output");
  const fileData = path.parse(filename);
  const expectedFilename = path.join(
    resultsDir,
    fileData.name + "-expected" + fileData.ext
  );
  if (fs.existsSync(expectedFilename)) {
    const expectedContent = fs.readFileSync(expectedFilename, "utf8");
    if (expectedContent === actualContent) return;

    const actualFilename = path.join(
      resultsDir,
      fileData.name + "-actual" + fileData.ext
    );
    if (expectedContent !== actualContent) {
      fs.writeFileSync(actualFilename, actualContent, "utf8");
      throw new Error(
        `Content doesn't match. \`${actualFilename}\` written for comparison.`
      );
    }
  } else {
    fs.writeFileSync(expectedFilename, actualContent, "utf8");
    throw new Error(
      `Test expectation file \`${expectedFilename}\` does not exist. New expectation written. Please commit the file.`
    );
  }
}

/**
 * Load asset from file.
 * @param {string} filename
 * @returns {string}
 */
function readAsset(filename: string): string {
  return fs.readFileSync(path.join(__dirname, "fixtures", filename), "utf8");
}

/**
 * Reset Sunlight highlighter node counts. Run before highlighting the first
 * snippet in each test. Do not run in hooks because of possible contamination
 * between the before-something hook and the main test.
 */
function resetHighlighterCount() {
  Highlighter.resetNodeCount();
}

describe("HTML files generation test", function() {
  const snippetList = TestSupportForFile.getSnippetFileList();

  it("Renders the demo page correctly", function() {
    resetHighlighterCount();

    const allResults: {
      filename: string,
      theme: string,
      lineNumbers: string,
      highlightedCode: string
    }[] = [];
    for (const filename of snippetList) {
      if (filename === "README.md") continue;

      const language = getHighlightLanguage(filename);
      const options = getOptionsFromString(filename);
      const testSupport = new TestSupportForFile(filename, language, options);
      allResults.push({
        filename: filename,
        theme: typeof options.theme === "string" ? options.theme : "",
        lineNumbers: options.lineNumbers ? "true" : "false",
        highlightedCode: testSupport.codeElement.outerHTML
      });
    }

    const title = "Sunlight-x demo";

    let content = "";
    let nav = "";
    for (const result of allResults) {
      nav += `<a href="#${result.filename}">${result.filename}</a>\n`;

      content += `<h2 id="${result.filename}">${result.filename}</h2>\n`;
      content += `<p>Theme: <b>${result.theme}</b>, `;
      content += `Line numbers: <b>${result.lineNumbers}</b></p>\n`;
      content += `${result.highlightedCode}\n`;
    }

    const data: { [string]: string } = {
      TITLE: title,
      HEADER: `<h1>${title}</h1>`,
      STRUCTURECSS: readAsset("htmltemplate.css"),
      HIGHLIGHTCSS: getCSSSync(),
      NAV: nav,
      CONTENT: content
    };

    const HTMLTemplate = readAsset("htmltemplate.html");
    const generatedHTML = HTMLTemplate.replace(
      /%%([A-Z][A-Z0-9]*)%%/gi,
      (match: string, p1: string): string => {
        expect(Object.keys(data)).toContain(p1);
        return data[p1];
      }
    );
    compareResult("integration.html", generatedHTML);
  });
});
