// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "../fixtures/testsupport.js";

describe("PowerShell tests", function() {
  let testSupport: TestSupportForFile;
  beforeAll(function() {
    testSupport = new TestSupportForFile("powershell.ps1", "powershell");
  });
  it("variable", function() {
    testSupport.AssertContentExists("variable", "$strComputer");
  });
  it("variable", function() {
    testSupport.AssertContentExists("variable", "$OS");
  });

  it("$null special variable", function() {
    testSupport.AssertContentExists("specialVariable", "$null");
  });
  it("$_ special variable", function() {
    testSupport.AssertContentExists("specialVariable", "$_");
  });

  it("cmdlet", function() {
    testSupport.AssertContentExists("named-ident", "write-host");
  });
  it("cmdlet", function() {
    testSupport.AssertContentExists("named-ident", "Get-WmiObject");
  });
  it("type coercion", function() {
    testSupport.AssertContentExists("named-ident", "type");
  });
  it("type coercion", function() {
    testSupport.AssertContentExists("named-ident", "WebRequest");
  });

  it("switch", function() {
    testSupport.AssertContentExists("switch", "-namespace");
  });
  it("switch at start of line after continuation", function() {
    testSupport.AssertContentExists("switch", "-computerName");
  });
  it("switch at start of line after continuation", function() {
    testSupport.AssertContentExists("switch", "-ComputerName");
  });

  it("if keyword", function() {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("elseif keyword", function() {
    testSupport.AssertContentExists("keyword", "elseif");
  });
  it("foreach keyword", function() {
    testSupport.AssertContentExists("keyword", "foreach");
  });
  it("else keyword", function() {
    testSupport.AssertContentExists("keyword", "else");
  });
  it("in keyword", function() {
    testSupport.AssertContentExists("keyword", "in");
  });

  it("-eq special operator", function() {
    testSupport.AssertContentExists("specialOperator", "-eq");
  });
  it("-or special operator", function() {
    testSupport.AssertContentExists("specialOperator", "-or");
  });

  it("switch value", function() {
    testSupport.AssertContentExists("ident", "win32_OperatingSystem");
  });
  it("fully qualified type name in brackets", function() {
    testSupport.AssertContentExists("ident", "Fully");
  });
  it("fully qualified type name in brackets", function() {
    testSupport.AssertContentExists("ident", "Qualified");
  });

  it("string", function() {
    testSupport.AssertContentExists("string", '"root\\CIMV2"');
  });

  it("comment", function() {
    testSupport.AssertContentExists("comment", "# if OS not identified");
  });

  it("` operator", function() {
    testSupport.AssertContentExists("operator", "`");
  });
  it("@( operator", function() {
    testSupport.AssertContentExists("operator", "@(");
  });
  it("%{ operator", function() {
    testSupport.AssertContentExists("operator", "%{");
  });
  it(":: operator", function() {
    testSupport.AssertContentExists("operator", "::");
  });
});
