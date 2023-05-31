// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
describe("Visual Studio .sln files tests", function () {
  let testSupport: TestSupportForFile;
  beforeAll(function () {
    testSupport = new TestSupportForFile("vssolution.sln", "sln");
  });
  it("Project keyword", function () {
    testSupport.AssertContentExists("keyword", "Project");
  });
  it("EndProject keyword", function () {
    testSupport.AssertContentExists("keyword", "EndProject");
  });
  it("Global keyword", function () {
    testSupport.AssertContentExists("keyword", "Global");
  });
  it("EndGlobal keyword", function () {
    testSupport.AssertContentExists("keyword", "EndGlobal");
  });
  it("GlobalSection keyword", function () {
    testSupport.AssertContentExists("keyword", "GlobalSection");
  });
  it("EndGlobalSection keyword", function () {
    testSupport.AssertContentExists("keyword", "EndGlobalSection");
  });
  it("preSolution section name", function () {
    testSupport.AssertContentExists("sectionName", "preSolution");
  });
  it("postSolution section name", function () {
    testSupport.AssertContentExists("sectionName", "postSolution");
  });
  it("string", function () {
    testSupport.AssertContentExists("string", '"{F184B08F-C81C-45F6-A57F-5ABD9991F28F}"');
  });
  it("ident that starts with period", function () {
    testSupport.AssertContentExists("ident", ".Debug.ActiveCfg");
  });
  it("ident with period", function () {
    testSupport.AssertContentExists("ident", "ConfigName.0");
  });
  it("normal ident", function () {
    testSupport.AssertContentExists("ident", "Name1");
  });
  it("= operator", function () {
    testSupport.AssertContentExists("operator", "=");
  });
  it("| operator", function () {
    testSupport.AssertContentExists("operator", "|");
  });
  it("argument to GlobalSection", function () {
    testSupport.AssertContentExists("named-ident", "SolutionNotes");
  });
  it("argument to ProjectDependencies", function () {
    testSupport.AssertContentExists("named-ident", "ProjectDependencies");
  });
  it("guid", function () {
    testSupport.AssertContentExists("guid", "{8CDD8387-B905-44A8-B5D5-07BB50E05BEA}");
  });
  it("comment", function () {
    testSupport.AssertContentExists("comment", "# Visual Studio 2010");
  });
  it("formatDeclaration", function () {
    testSupport.AssertContentExists("formatDeclaration", "Microsoft Visual Studio Solution File, Format Version 11.00");
  });
});