// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "../fixtures/testsupport.js";

let testSupport: TestSupportForFile;
describe("Lisp tests", function() {
  beforeAll(function() {
    testSupport = new TestSupportForFile("lisp.lisp", "lisp");
  });
  it("comment", function() {
    testSupport.AssertContentExists(
      "comment",
      ";;; Count and collect names and ages."
    );
  });
  it("comment", function() {
    testSupport.AssertContentExists("comment", "; user-defined variable");
  });

  it("loop macro", function() {
    testSupport.AssertContentExists("macro", "loop");
  });
  it("return macro", function() {
    testSupport.AssertContentExists("macro", "return");
  });
  it("setf macro", function() {
    testSupport.AssertContentExists("macro", "setf");
  });
  it("unless macro", function() {
    testSupport.AssertContentExists("macro", "unless");
  });

  it("for keyword", function() {
    testSupport.AssertContentExists("keyword", "for");
  });
  it("in keyword", function() {
    testSupport.AssertContentExists("keyword", "in");
  });
  it("as keyword", function() {
    testSupport.AssertContentExists("keyword", "as");
  });
  it("append keyword", function() {
    testSupport.AssertContentExists("keyword", "append");
  });
  it("into keyword", function() {
    testSupport.AssertContentExists("keyword", "into");
  });
  it("count keyword", function() {
    testSupport.AssertContentExists("keyword", "count");
  });
  it("sum keyword", function() {
    testSupport.AssertContentExists("keyword", "sum");
  });
  it("finally keyword", function() {
    testSupport.AssertContentExists("keyword", "finally");
  });

  it("list function", function() {
    testSupport.AssertContentExists("function", "list");
  });
  it("round function", function() {
    testSupport.AssertContentExists("function", "round");
  });
  it("values function", function() {
    testSupport.AssertContentExists("function", "values");
  });
  it("cons function", function() {
    testSupport.AssertContentExists("function", "cons");
  });
  it("< function", function() {
    testSupport.AssertContentExists("function", "<");
  });
  it("keywordp function", function() {
    testSupport.AssertContentExists("function", "keywordp");
  });

  it("user defined function", function() {
    testSupport.AssertContentExists("named-ident", "simple-collect-sum");
  });

  it("setq special form", function() {
    testSupport.AssertContentExists("specialForm", "setq");
  });
  it("function special form", function() {
    testSupport.AssertContentExists("specialForm", "function");
  });

  it("keyword argument", function() {
    testSupport.AssertContentExists("keywordArgument", ":pretty");
  });
  it("keyword argument before )", function() {
    testSupport.AssertContentExists("keywordArgument", ":downcase");
  });

  it("* variable", function() {
    testSupport.AssertContentExists("globalVariable", "*");
  });
  it("*print-lines* variable", function() {
    testSupport.AssertContentExists("globalVariable", "*print-lines*");
  });

  it("user defined variable", function() {
    testSupport.AssertContentExists("variable", "*temp*");
  });

  it("series type specifier", function() {
    testSupport.AssertContentExists("type", "series");
  });

  it("nil constant", function() {
    testSupport.AssertContentExists("constant", "nil");
  });
  it("t constant", function() {
    testSupport.AssertContentExists("constant", "t");
  });

  it("integer", function() {
    testSupport.AssertContentExists("number", "22");
  });
  it("float", function() {
    testSupport.AssertContentExists("number", "0.4");
  });

  it("ident with dashes", function() {
    testSupport.AssertContentExists("ident", "name-and-age-list");
  });

  it("=> operator", function() {
    testSupport.AssertContentExists("operator", "=>");
  });
  it("#' operator", function() {
    testSupport.AssertContentExists("operator", "#'");
  });
  it("#<n>A operator", function() {
    testSupport.AssertContentExists("operator", "#2A");
  });
  it("#<n>R operator", function() {
    testSupport.AssertContentExists("operator", "#4r");
  });
  it("#\\ operator", function() {
    testSupport.AssertContentExists("operator", "#\\");
  });
  it("' operator", function() {
    testSupport.AssertContentExists("operator", "'");
  });
  it("# operator", function() {
    testSupport.AssertContentExists("operator", "#");
  });
  it("... operator", function() {
    testSupport.AssertContentExists("operator", "...");
  });
});
