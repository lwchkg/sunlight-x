// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
let testSupport: TestSupportForFile;
describe("Lua tests", function () {
  beforeAll(function () {
    testSupport = new TestSupportForFile("lua.lua", "lua");
  });
  it("single quoted string", function () {
    testSupport.AssertContentExists("string", "'alo\\n123\"'");
  });
  it("double quoted string with escapes", function () {
    testSupport.AssertContentExists("string", '"alo\\n123\\""');
  });
  it("single quoted string with escapes", function () {
    testSupport.AssertContentExists("string", "'\\97lo\\10\\04923\"'");
  });
  it("literal string with no equals signs", function () {
    testSupport.AssertContentExists("verbatimString", '[[alo\n123"]]');
  });
  it("literal string with two equals signs", function () {
    testSupport.AssertContentExists("verbatimString", '[==[\nalo\n123"]==]');
  });
  it("single line comment", function () {
    testSupport.AssertContentExists("comment", "--strings");
  });
  it("multi line comment", function () {
    testSupport.AssertContentExists("comment", "--[[\nmulti\nline\ncomment]]");
  });
  it("print standard function", function () {
    testSupport.AssertContentExists("function", "print");
  });
  it("read file function", function () {
    testSupport.AssertContentExists("function", "read");
  });
  it("local keyword", function () {
    testSupport.AssertContentExists("keyword", "local");
  });
  it("while keyword", function () {
    testSupport.AssertContentExists("keyword", "while");
  });
  it("true keyword", function () {
    testSupport.AssertContentExists("keyword", "true");
  });
  it("do keyword", function () {
    testSupport.AssertContentExists("keyword", "do");
  });
  it("if keyword", function () {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("not keyword", function () {
    testSupport.AssertContentExists("keyword", "not");
  });
  it("then keyword", function () {
    testSupport.AssertContentExists("keyword", "then");
  });
  it("break keyword", function () {
    testSupport.AssertContentExists("keyword", "break");
  });
  it("end keyword", function () {
    testSupport.AssertContentExists("keyword", "end");
  });
  it("repeat keyword", function () {
    testSupport.AssertContentExists("keyword", "repeat");
  });
  it("until keyword", function () {
    testSupport.AssertContentExists("keyword", "until");
  });
  it("string global table", function () {
    testSupport.AssertContentExists("named-ident", "string");
  });
  it("io global table", function () {
    testSupport.AssertContentExists("named-ident", "io");
  });
  it("os global table", function () {
    testSupport.AssertContentExists("named-ident", "os");
  });
  it("table global table", function () {
    testSupport.AssertContentExists("named-ident", "table");
  });
  it("function name in declaration", function () {
    testSupport.AssertContentExists("named-ident", "sortbygrade");
  });
  it(".. operator", function () {
    testSupport.AssertContentExists("operator", "..");
  });
  it(": operator", function () {
    testSupport.AssertContentExists("operator", ":");
  });
  it("~= operator", function () {
    testSupport.AssertContentExists("operator", "~=");
  });
});