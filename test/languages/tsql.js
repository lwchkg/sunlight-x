// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "../fixtures/testsupport.js";

describe("Transact-SQL tests", function() {
  let testSupport: TestSupportForFile;
  beforeAll(function() {
    testSupport = new TestSupportForFile("tsql.tsql", "tsql");
  });
  it("-- comment", function() {
    testSupport.AssertContentExists("comment", "--comment 1");
  });
  it("multi line comment", function() {
    testSupport.AssertContentExists("comment", "/* multi\nline comment */");
  });

  it("quoted ident", function() {
    testSupport.AssertContentExists("quotedIdent", "[foo]");
  });
  it("quoted ident", function() {
    testSupport.AssertContentExists("quotedIdent", "[foo.name]");
  });

  it("select keyword", function() {
    testSupport.AssertContentExists("keyword", "select");
  });
  it("SELECT keyword", function() {
    testSupport.AssertContentExists("keyword", "SELECT");
  });
  it("from keyword", function() {
    testSupport.AssertContentExists("keyword", "from");
  });
  it("where keyword", function() {
    testSupport.AssertContentExists("keyword", "where");
  });
  it("JOIN keyword", function() {
    testSupport.AssertContentExists("keyword", "JOIN");
  });
  it("LEFT keyword", function() {
    testSupport.AssertContentExists("keyword", "LEFT");
  });
  it("GROUP keyword", function() {
    testSupport.AssertContentExists("keyword", "GROUP");
  });
  it("BY keyword", function() {
    testSupport.AssertContentExists("keyword", "BY");
  });
  it("HAVING keyword", function() {
    testSupport.AssertContentExists("keyword", "HAVING");
  });
  it("AND keyword", function() {
    testSupport.AssertContentExists("keyword", "AND");
  });
  it("TOP keyword", function() {
    testSupport.AssertContentExists("keyword", "TOP");
  });
  it("OUTER keyword", function() {
    testSupport.AssertContentExists("keyword", "OUTER");
  });
  it("INNER keyword", function() {
    testSupport.AssertContentExists("keyword", "INNER");
  });

  it("LEFT function", function() {
    testSupport.AssertContentExists("function", "LEFT");
  });
  it("LEN function", function() {
    testSupport.AssertContentExists("function", "LEN");
  });
  it("COUNT function", function() {
    testSupport.AssertContentExists("function", "COUNT");
  });

  it("@@IDENTITY constant", function() {
    testSupport.AssertContentExists("constant", "@@IDENTITY");
  });
  it("@@ROWCOUNT constant", function() {
    testSupport.AssertContentExists("constant", "@@ROWCOUNT");
  });

  it("> operator", function() {
    testSupport.AssertContentExists("operator", ">");
  });
  it("table name named ident", function() {
    testSupport.AssertContentExists("named-ident", "my_table");
  });
  it("database name named ident", function() {
    testSupport.AssertContentExists("named-ident", "db");
  });
  it("number", function() {
    testSupport.AssertContentExists("number", "10");
  });

  it("single quoted string", function() {
    testSupport.AssertContentExists("string", "'f'");
  });
  it("double quoted string with escapes", function() {
    testSupport.AssertContentExists("string", '"escaped\\\\\\""');
  });
  it("single quoted string with escapes", function() {
    testSupport.AssertContentExists("string", "'escaped\\\\\\''");
  });
});
