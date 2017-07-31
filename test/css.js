// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "./fixtures/testsupport.js";

describe("CSS tests", function() {
  let testSupport: TestSupportForFile;
  beforeAll(function() {
    testSupport = new TestSupportForFile("css.css", "css");
  });
  it("css rule declaration", function() {
    testSupport.AssertContentExists("rule", "@import");
  });

  it("font-family string", function() {
    testSupport.AssertContentExists("string", '"Courier New"');
  });
  it("string with escaped quote", function() {
    testSupport.AssertContentExists("string", '"Print style\\"s"');
  });
  it("single quoted string with escaped quote", function() {
    testSupport.AssertContentExists("string", "'Arialola\\'s'");
  });

  it("html element selector", function() {
    testSupport.AssertContentExists("element", "html");
  });
  it("element selector after :pseudoclass+", function() {
    testSupport.AssertContentExists("element", "shouldBeNamed");
  });
  it("element selector before pseudoclass+", function() {
    testSupport.AssertContentExists("element", "pseudotest1");
  });
  it("element selector after pseudoclass+", function() {
    testSupport.AssertContentExists("element", "pseudotest2");
  });

  it("css extension", function() {
    testSupport.AssertContentExists("ident", "css");
  });
  it("non existent pseudo class", function() {
    testSupport.AssertContentExists("ident", "fake-pseudo-class");
  });
  it("property value -moz-initial", function() {
    testSupport.AssertContentExists("ident", "-moz-initial");
  });
  it("property value fixed", function() {
    testSupport.AssertContentExists("ident", "fixed");
  });
  it("property value solid", function() {
    testSupport.AssertContentExists("ident", "solid");
  });

  it("!important", function() {
    testSupport.AssertContentExists("importantFlag", "!important");
  });

  it("class selector", function() {
    testSupport.AssertContentExists("class", "warning");
  });
  it("class selector", function() {
    testSupport.AssertContentExists("class", "myClass");
  });
  it("class selector", function() {
    testSupport.AssertContentExists("class", "shouldBeNamed");
  });

  it("number with %", function() {
    testSupport.AssertContentExists("number", "100%");
  });
  it("number with px suffix", function() {
    testSupport.AssertContentExists("number", "2px");
  });
  it("number with deg suffix", function() {
    testSupport.AssertContentExists("number", "5deg");
  });

  it("decimal number", function() {
    testSupport.AssertContentExists("number", "0.0");
  });
  it("hex color #12345678", function() {
    testSupport.AssertContentExists("hexColor", "#12345678");
  });
  it("hex color #FF0000", function() {
    testSupport.AssertContentExists("hexColor", "#FF0000");
  });
  it("hex color #def", function() {
    testSupport.AssertContentExists("hexColor", "#def");
  });
  it("id selector #wrapper", function() {
    testSupport.AssertContentExists("id", "#wrapper");
  });
  it("id selector #abc", function() {
    testSupport.AssertContentExists("id", "#abc");
  });

  it("attribute operator", function() {
    testSupport.AssertContentExists("operator", "~=");
  });
  it("dot operator", function() {
    testSupport.AssertContentExists("operator", ".");
  });
  it("child operator", function() {
    testSupport.AssertContentExists("operator", ">");
  });
  it("catchall operator", function() {
    testSupport.AssertContentExists("operator", "*");
  });
  it("sibling operator", function() {
    testSupport.AssertContentExists("operator", "+");
  });

  it("pseudo element", function() {
    testSupport.AssertContentExists("pseudoElement", "before");
  });
  it("pseudo class", function() {
    testSupport.AssertContentExists("pseudoClass", "first-child");
  });

  it("url function", function() {
    testSupport.AssertContentExists("function", "url");
  });
  it("rotate function", function() {
    testSupport.AssertContentExists("function", "rotate");
  });
  it("alpha function", function() {
    testSupport.AssertContentExists("function", "alpha");
  });
  it("capitalized alpha function", function() {
    testSupport.AssertContentExists("function", "Alpha");
  });

  it("background-color property", function() {
    testSupport.AssertContentExists("keyword", "background-color");
  });
  it("background property", function() {
    testSupport.AssertContentExists("keyword", "background");
  });
  it("border property", function() {
    testSupport.AssertContentExists("keyword", "border");
  });
  it("border-top property", function() {
    testSupport.AssertContentExists("keyword", "border-top");
  });
  it("border-top-color property", function() {
    testSupport.AssertContentExists("keyword", "border-top-color");
  });
  it("vertical-align property", function() {
    testSupport.AssertContentExists("keyword", "vertical-align");
  });
  it("width property", function() {
    testSupport.AssertContentExists("keyword", "width");
  });
  it("position property", function() {
    testSupport.AssertContentExists("keyword", "position");
  });
  it("color property", function() {
    testSupport.AssertContentExists("keyword", "color");
  });
  it("filter property", function() {
    testSupport.AssertContentExists("keyword", "filter");
  });
  it("mozilla specific property", function() {
    testSupport.AssertContentExists("keyword", "-moz-background-inline-policy");
  });
  it("opera specific property", function() {
    testSupport.AssertContentExists("keyword", "-o-device-pixel-ratio");
  });
  it("ie specific property", function() {
    testSupport.AssertContentExists("keyword", "-ms-accelerator");
  });
  it("webkit specific property", function() {
    testSupport.AssertContentExists("keyword", "-webkit-background-origin");
  });

  it("Microsoft filter prefix", function() {
    testSupport.AssertContentExists(
      "microsoftFilterPrefix",
      "progid:DXImageTransform.Microsoft"
    );
  });
});
