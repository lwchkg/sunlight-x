// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupport } from "./fixtures/testsupport.js";

describe("Diff tests", function() {
  let testSupport: TestSupport;
  before(function() {
    testSupport = new TestSupport("diff.diff", "diff");
  });
  it("Index: merge header", function() {
    testSupport.AssertContentExists("mergeHeader", "Index: path/to/file.cpp");
  });
  it("= merge header", function() {
    testSupport.AssertContentExists(
      "mergeHeader",
      "==================================================================="
    );
  });

  it("--- header", function() {
    testSupport.AssertContentExists(
      "header",
      "--- /path/to/original ''timestamp''"
    );
  });
  it("+++ header", function() {
    testSupport.AssertContentExists(
      "header",
      "+++ /path/to/new      ''timestamp''"
    );
  });
  it("*** header", function() {
    testSupport.AssertContentExists("header", "*** 5,20 ****");
  });
  it("--- header", function() {
    testSupport.AssertContentExists("header", "--- 1,9 ----");
  });

  it("range info", function() {
    testSupport.AssertContentExists("rangeInfo", "@@ -22,3 +22,7 @@");
  });

  it("added line", function() {
    testSupport.AssertContentExists("added", "+This is an important");
  });
  it("modified line", function() {
    testSupport.AssertContentExists("modified", "! compress the size of the");
  });
  it("removed line", function() {
    testSupport.AssertContentExists("removed", "-This paragraph contains");
  });
  it("unchanged line", function() {
    testSupport.AssertContentExists("unchanged", " be shown if it doesn't");
  });

  it("no new line declaration", function() {
    testSupport.AssertContentExists(
      "noNewLine",
      "\\ No newline at end of file"
    );
  });
});
