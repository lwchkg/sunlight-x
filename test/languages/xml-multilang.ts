// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
describe("XML cross-language tests", function () {
  let testSupport: TestSupportForFile;
  beforeAll(function () {
    testSupport = new TestSupportForFile("xml-multilang.xml", "xml");
  });
  it("doctype", function () {
    testSupport.AssertContentExists("doctype", "<!doctype html>");
  });
  // embedded stuff
  it("php variable", function () {
    testSupport.AssertContentExists("variable", "$_GET");
  });
  it("php function", function () {
    testSupport.AssertContentExists("function", "print_r");
  });
  it("javascript keyword", function () {
    testSupport.AssertContentExists("keyword", "function");
  });
  it("css rule", function () {
    testSupport.AssertContentExists("rule", "@font-face");
  });
  it("xml tag", function () {
    testSupport.AssertContentExists("tagName", "style");
  });
  it("c# string", function () {
    testSupport.AssertContentExists("string", '"Short tag ftw"');
  });
  it("c# keyword if", function () {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("asp server side comment", function () {
    testSupport.AssertContentExists("comment", "<%-- server side comment --%>");
  });
  it("asp open tag", function () {
    testSupport.AssertContentExists("aspOpenTag", "<%");
  });
  it("asp short open tag", function () {
    testSupport.AssertContentExists("aspOpenTag", "<%=");
  });
  it("asp close tag", function () {
    testSupport.AssertContentExists("aspCloseTag", "%>");
  });
});