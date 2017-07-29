// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupport } from "./fixtures/testsupport.js";

describe("C++ tests", function() {
  let testSupport: TestSupport;
  beforeAll(function() {
    testSupport = new TestSupport("cpp.cpp", "cpp");
  });
  it("preprocessor", function() {
    testSupport.AssertContentExists(
      "preprocessorDirective",
      "#include <iostream>"
    );
  });

  it("single line comment", function() {
    testSupport.AssertContentExists(
      "comment",
      "// if a < b then use b else use a"
    );
  });

  it("using keyword", function() {
    testSupport.AssertContentExists("keyword", "using");
  });
  it("namespace keyword", function() {
    testSupport.AssertContentExists("keyword", "namespace");
  });
  it("float keyword", function() {
    testSupport.AssertContentExists("keyword", "float");
  });
  it("double keyword", function() {
    testSupport.AssertContentExists("keyword", "double");
  });
  it("return keyword", function() {
    testSupport.AssertContentExists("keyword", "return");
  });
  it("void keyword", function() {
    testSupport.AssertContentExists("keyword", "void");
  });
  it("const keyword", function() {
    testSupport.AssertContentExists("keyword", "const");
  });
  it("char keyword", function() {
    testSupport.AssertContentExists("keyword", "char");
  });
  it("if keyword", function() {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("friend keyword", function() {
    testSupport.AssertContentExists("keyword", "friend");
  });
  it("class keyword", function() {
    testSupport.AssertContentExists("keyword", "class");
  });
  it("template keyword", function() {
    testSupport.AssertContentExists("keyword", "template");
  });
  it("typename keyword", function() {
    testSupport.AssertContentExists("keyword", "typename");
  });

  it("double quoted string", function() {
    testSupport.AssertContentExists("string", '"chrome registration"');
  });

  it("class name with pointer in parameter list", function() {
    testSupport.AssertContentExists("named-ident", "nsIURI");
  });
  it("class name in parameter list", function() {
    testSupport.AssertContentExists("named-ident", "PRUint32");
  });
  it("class name in parameter list", function() {
    testSupport.AssertContentExists("named-ident", "PRUint32");
  });
  it("class name in default declaration", function() {
    testSupport.AssertContentExists("named-ident", "nsresult");
  });
  it("namespace name before ::", function() {
    testSupport.AssertContentExists("named-ident", "std");
  });
  it("class name after ::", function() {
    testSupport.AssertContentExists("named-ident", "regex");
  });
  it("class name", function() {
    testSupport.AssertContentExists("named-ident", "IntList");
  });
  it("class name in parameter list with reference", function() {
    testSupport.AssertContentExists("named-ident", "ostream");
  });
  it("class name with pointer in declaration", function() {
    testSupport.AssertContentExists("named-ident", "lolPointer");
  });
  it("class name with double pointer in declaration", function() {
    testSupport.AssertContentExists("named-ident", "lolPointer2");
  });
  it("cast", function() {
    testSupport.AssertContentExists("named-ident", "regularCast");
  });
  it("cast with pointer", function() {
    testSupport.AssertContentExists("named-ident", "pointerCast");
  });
  it("cast with reference and pointer", function() {
    testSupport.AssertContentExists("named-ident", "ReferenceCast");
  });
  it("class name inside <>", function() {
    testSupport.AssertContentExists("named-ident", "nsIConsoleService");
  });

  it("ident before *", function() {
    testSupport.AssertContentExists("ident", "firstIdent1");
  });
  it("ident after *", function() {
    testSupport.AssertContentExists("ident", "secondIdent1");
  });
  it("ident before * in parens", function() {
    testSupport.AssertContentExists("ident", "firstIdent2");
  });
  it("ident after * in parens", function() {
    testSupport.AssertContentExists("ident", "secondIdent2");
  });
  it("ident before &", function() {
    testSupport.AssertContentExists("ident", "firstIdent3");
  });
  it("ident after &", function() {
    testSupport.AssertContentExists("ident", "secondIdent3");
  });
  it("ident before & in parens", function() {
    testSupport.AssertContentExists("ident", "firstIdent4");
  });
  it("ident after & in parens", function() {
    testSupport.AssertContentExists("ident", "secondIdent4");
  });
  it("ident after class in <>", function() {
    testSupport.AssertContentExists("ident", "MyTemplateClass");
  });
});
