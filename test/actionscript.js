// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupport } from "./fixtures/testsupport.js";

describe("ActionScript tests", function() {
  let testSupport: TestSupport;
  beforeAll(function() {
    testSupport = new TestSupport("actionscript.as", "actionscript");
  });
  it("single line comment", function() {
    testSupport.AssertContentExists(
      "comment",
      "// Copyright: Hiroshi Ichikawa <http://gimite.net/en/>"
    );
  });
  it("multi line comment", function() {
    testSupport.AssertContentExists(
      "comment",
      "/**\n   * @return  This WebSocket's ID.\n   */"
    );
  });

  it("package keyword", function() {
    testSupport.AssertContentExists("keyword", "package");
  });
  it("private keyword", function() {
    testSupport.AssertContentExists("keyword", "private");
  });
  it("function keyword", function() {
    testSupport.AssertContentExists("keyword", "function");
  });
  it("for keyword", function() {
    testSupport.AssertContentExists("keyword", "for");
  });
  it("return keyword", function() {
    testSupport.AssertContentExists("keyword", "return");
  });
  it("class keyword", function() {
    testSupport.AssertContentExists("keyword", "class");
  });
  it("extends keyword", function() {
    testSupport.AssertContentExists("keyword", "extends");
  });
  it("implements keyword", function() {
    testSupport.AssertContentExists("keyword", "implements");
  });
  it("void keyword", function() {
    testSupport.AssertContentExists("keyword", "void");
  });
  it("else keyword", function() {
    testSupport.AssertContentExists("keyword", "else");
  });
  it("false keyword", function() {
    testSupport.AssertContentExists("keyword", "false");
  });
  it("null keyword", function() {
    testSupport.AssertContentExists("keyword", "null");
  });
  it("import keyword", function() {
    testSupport.AssertContentExists("keyword", "import");
  });
  it("static keyword", function() {
    testSupport.AssertContentExists("keyword", "static");
  });
  it("var keyword", function() {
    testSupport.AssertContentExists("keyword", "var");
  });

  it("interface name after implements", function() {
    testSupport.AssertContentExists("named-ident", "IInterface1");
  });
  it("interface name after implements", function() {
    testSupport.AssertContentExists("named-ident", "IInterface2");
  });
  it("interface name after implements", function() {
    testSupport.AssertContentExists("named-ident", "IInterface3");
  });
  it("ident after :", function() {
    testSupport.AssertContentExists("named-ident", "ByteArray");
  });
  it("ident after :", function() {
    testSupport.AssertContentExists("named-ident", "IWebSocketLogger");
  });
  it("ident after new", function() {
    testSupport.AssertContentExists("named-ident", "WebSocketEvent");
  });
  it("ident after import", function() {
    testSupport.AssertContentExists("named-ident", "TLSSecurityParameters");
  });

  it("uint global object", function() {
    testSupport.AssertContentExists("globalObject", "uint");
  });
  it("String global object", function() {
    testSupport.AssertContentExists("globalObject", "String");
  });
  it("Math global object", function() {
    testSupport.AssertContentExists("globalObject", "Math");
  });

  it("string", function() {
    testSupport.AssertContentExists("string", '"\\x00"');
  });

  it("hex number", function() {
    testSupport.AssertContentExists("number", "0x7a");
  });
  it("integer", function() {
    testSupport.AssertContentExists("number", "0");
  });

  it("Number function", function() {
    testSupport.AssertContentExists("globalFunction", "Number");
  });
  it("parseInt function", function() {
    testSupport.AssertContentExists("globalFunction", "parseInt");
  });
  it("encodeURIComponent function", function() {
    testSupport.AssertContentExists("globalFunction", "encodeURIComponent");
  });
  it("decodeURIComponent function", function() {
    testSupport.AssertContentExists("globalFunction", "decodeURIComponent");
  });

  it("regex literal with modifiers", function() {
    testSupport.AssertContentExists("regexLiteral", "/[^\\d]/g");
  });
});
