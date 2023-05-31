// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
describe("Scala tests", function () {
  let testSupport: TestSupportForFile;
  beforeAll(function () {
    testSupport = new TestSupportForFile("scala.scala", "scala");
  });
  it("object keyword", function () {
    testSupport.AssertContentExists("keyword", "object");
  });
  it("case keyword", function () {
    testSupport.AssertContentExists("keyword", "case");
  });
  it("class keyword", function () {
    testSupport.AssertContentExists("keyword", "class");
  });
  it("private keyword", function () {
    testSupport.AssertContentExists("keyword", "private");
  });
  it("val keyword", function () {
    testSupport.AssertContentExists("keyword", "val");
  });
  it("def keyword", function () {
    testSupport.AssertContentExists("keyword", "def");
  });
  it("if keyword", function () {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("match keyword", function () {
    testSupport.AssertContentExists("keyword", "match");
  });
  it("new keyword", function () {
    testSupport.AssertContentExists("keyword", "new");
  });
  it("type keyword", function () {
    testSupport.AssertContentExists("keyword", "type");
  });
  it("extends keyword", function () {
    testSupport.AssertContentExists("keyword", "extends");
  });
  it("built in type", function () {
    testSupport.AssertContentExists("named-ident", "Pair");
  });
  it("type name", function () {
    testSupport.AssertContentExists("named-ident", "Answer");
  });
  it("trait name", function () {
    testSupport.AssertContentExists("named-ident", "Term");
  });
  it("class name", function () {
    testSupport.AssertContentExists("named-ident", "AddressBook");
  });
  it("object name", function () {
    testSupport.AssertContentExists("named-ident", "addressbook");
  });
  it("built in type", function () {
    testSupport.AssertContentExists("named-ident", "List");
  });
  it("embedded xml", function () {
    testSupport.AssertContentExists("tagName", "tr");
  });
  it("embedded xml", function () {
    testSupport.AssertContentExists("tagName", "td");
  });
  it("embedded xml", function () {
    testSupport.AssertContentExists("tagName", "table");
  });
  it("embedded xml", function () {
    testSupport.AssertContentExists("operator", "</");
  });
  it("embedded xml", function () {
    testSupport.AssertContentExists("attribute", "cellpadding");
  });
  it("embedded xml", function () {
    testSupport.AssertContentExists("string", '"text/css"');
  });
  it("generic type name", function () {
    testSupport.AssertContentExists("ident", "T");
  });
  it("generic type name", function () {
    testSupport.AssertContentExists("ident", "A");
  });
  it("@tailrec annotation", function () {
    testSupport.AssertContentExists("annotation", "@tailrec");
  });
  it("@switch annotation", function () {
    testSupport.AssertContentExists("annotation", "@switch");
  });
  it("multi line comment", function () {
    testSupport.AssertContentExists("comment", "/** An AddressBook takes a variable number of arguments\n   *  which are accessed as a Sequence\n   */");
  });
  it("symbol literal", function () {
    testSupport.AssertContentExists("symbolLiteral", "'aSymbol");
  });
  it("single character char", function () {
    testSupport.AssertContentExists("char", "'['");
  });
  it("single character char", function () {
    testSupport.AssertContentExists("char", "']'");
  });
  it("space character", function () {
    testSupport.AssertContentExists("char", "' '");
  });
  it("single character char", function () {
    testSupport.AssertContentExists("char", "'a'");
  });
  it("char code point", function () {
    testSupport.AssertContentExists("char", "'\\u0041'");
  });
  it("string in embedded xml", function () {
    testSupport.AssertContentExists("string", '"My Address Book"');
  });
  it("raw string in embedded xml", function () {
    testSupport.AssertContentExists("string", '"""table { border-right: 1px solid #cccccc; }\n        th { background-color: #cccccc; }\n        td { border-left: 1px solid #acacac; }\n        td { border-bottom: 1px solid #acacac;"""');
  });
});