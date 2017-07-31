// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "./fixtures/testsupport.js";

describe("XML tests", function() {
  let testSupport: TestSupportForFile;
  beforeAll(function() {
    testSupport = new TestSupportForFile("xml.xml", "xml");
  });
  it("xml open tag", function() {
    testSupport.AssertContentExists("xmlOpenTag", "<?xml");
  });
  it("xml close tag", function() {
    testSupport.AssertContentExists("xmlCloseTag", "?>");
  });

  it("config tag", function() {
    testSupport.AssertContentExists("tagName", "config");
  });
  it("section tag", function() {
    testSupport.AssertContentExists("tagName", "section");
  });
  it("_self-closing tag", function() {
    testSupport.AssertContentExists("tagName", "_self-closing");
  });
  it("nested tag", function() {
    testSupport.AssertContentExists("tagName", "nested");
  });
  it("tag name with period", function() {
    testSupport.AssertContentExists("tagName", "System.Net");
  });

  it("id attribute", function() {
    testSupport.AssertContentExists("attribute", "id");
  });
  it("xmlns attribute", function() {
    testSupport.AssertContentExists("attribute", "xmlns");
  });
  it("name attribute", function() {
    testSupport.AssertContentExists("attribute", "name");
  });
  it("version attribute", function() {
    testSupport.AssertContentExists("attribute", "version");
  });
  it("foo attribute", function() {
    testSupport.AssertContentExists("attribute", "foo");
  });
  it("lulz attribute", function() {
    testSupport.AssertContentExists("attribute", "lulz");
  });

  it("string", function() {
    testSupport.AssertContentExists("string", '"1.0"');
  });
  it("string", function() {
    testSupport.AssertContentExists("string", '"http://example.com"');
  });

  it("comment", function() {
    testSupport.AssertContentExists("comment", "<!-- cdata -->");
  });
  it("cdata", function() {
    testSupport.AssertContentExists(
      "cdata",
      "<![CDATA[I can put whatever I want here HAHAHA!\n<tags> that shouldn't be tags</tags>\n<?xml lol! ?>]]>"
    );
  });

  it("entity in content", function() {
    testSupport.AssertContentExists("entity", "&hellip;");
  });
  it("entity before open tag", function() {
    testSupport.AssertContentExists("entity", "&beforeopentag;");
  });

  it("self closing operator", function() {
    testSupport.AssertContentExists("operator", "/>");
  });
  it("opening operator", function() {
    testSupport.AssertContentExists("operator", "<");
  });
  it("closing operator", function() {
    testSupport.AssertContentExists("operator", ">");
  });
  it("</ operator", function() {
    testSupport.AssertContentExists("operator", "/>");
  });
  it("namespace operator", function() {
    testSupport.AssertContentExists("operator", ":");
  });
  it("= operator", function() {
    testSupport.AssertContentExists("operator", "=");
  });
});
