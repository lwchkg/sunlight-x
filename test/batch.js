// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupport } from "./fixtures/testsupport.js";

describe("Batch file (DOS) tests", function() {
  describe("file #1", function() {
    let testSupport: TestSupport;
    beforeAll(function() {
      testSupport = new TestSupport("batch1.bat", "batch");
    });
    it("echo keyword", function() {
      testSupport.AssertContentExists("keyword", "echo");
    });
    it("color keyword", function() {
      testSupport.AssertContentExists("keyword", "color");
    });
    it("title keyword", function() {
      testSupport.AssertContentExists("keyword", "title");
    });
    it("set keyword", function() {
      testSupport.AssertContentExists("keyword", "set");
    });
    it("cls keyword", function() {
      testSupport.AssertContentExists("keyword", "cls");
    });
    it("goto keyword", function() {
      testSupport.AssertContentExists("keyword", "goto");
    });
    it("shutdown keyword", function() {
      testSupport.AssertContentExists("keyword", "shutdown");
    });
    it("if keyword", function() {
      testSupport.AssertContentExists("keyword", "if");
    });
    it("for keyword", function() {
      testSupport.AssertContentExists("keyword", "for");
    });
    it("in keyword", function() {
      testSupport.AssertContentExists("keyword", "in");
    });
    it("do keyword", function() {
      testSupport.AssertContentExists("keyword", "do");
    });
    it("exit keyword", function() {
      testSupport.AssertContentExists("keyword", "exit");
    });
    it("lss keyword", function() {
      testSupport.AssertContentExists("keyword", "lss");
    });

    it("keyword after title", function() {
      testSupport.AssertContentExists("ident", "Shutdown");
    });
    it("keyword after echo", function() {
      testSupport.AssertContentExists("ident", "shutdown");
    });

    it("variable surrounded by %", function() {
      testSupport.AssertContentExists("variable", "%name%");
    });
    it("variable surrounded by %", function() {
      testSupport.AssertContentExists("variable", "%choice%");
    });
    it("variable prefixed with %%", function() {
      testSupport.AssertContentExists("variable", "%%a");
    });
    it("variable prefixed with %%", function() {
      testSupport.AssertContentExists("variable", "%%b%%100");
    });
    it("variable prefixed with %", function() {
      testSupport.AssertContentExists("variable", "%1");
    });

    it("== operator", function() {
      testSupport.AssertContentExists("operator", "==");
    });
    it("= operator", function() {
      testSupport.AssertContentExists("operator", "=");
    });
    it(": operator", function() {
      testSupport.AssertContentExists("operator", ":");
    });
    it("| operator", function() {
      testSupport.AssertContentExists("operator", "|");
    });
    it("* operator", function() {
      testSupport.AssertContentExists("operator", "*");
    });
    it("+ operator", function() {
      testSupport.AssertContentExists("operator", "+");
    });

    it("number", function() {
      testSupport.AssertContentExists("number", "2");
    });
    it("number", function() {
      testSupport.AssertContentExists("number", "60");
    });

    it("label prefixed with :", function() {
      testSupport.AssertContentExists("label", "start");
    });
    it("label after goto", function() {
      testSupport.AssertContentExists("label", "shutdown");
    });

    it("REM comment", function() {
      testSupport.AssertContentExists(
        "comment",
        "REM http://en.wikipedia.org/wiki/Batch_file#Advanced_batch_example_-_conditional_shutdown"
      );
    });
    it(":: comment", function() {
      testSupport.AssertContentExists(
        "comment",
        ":: http://en.wikipedia.org/wiki/Batch_file#Text_output_with_stripped_CR.2FLF"
      );
    });
  });
  describe("file #2", function() {
    let testSupport: TestSupport;
    beforeAll(function() {
      testSupport = new TestSupport("batch2.bat", "batch");
    });
    it("label label1", function() {
      testSupport.AssertContentExists("label", "label1");
    });
    it("label prefixed with :", function() {
      testSupport.AssertContentExists("label", "label3");
    });
    it("label after goto", function() {
      testSupport.AssertContentExists("label", "label2");
    });
  });
});
