// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "../fixtures/testsupport.js";

describe("Erlang tests", function() {
  let testSupport: TestSupportForFile;
  describe("file #1", function() {
    beforeAll(function() {
      testSupport = new TestSupportForFile("erlang1.erl", "erlang");
    });
    it("-module module attribute", function() {
      testSupport.AssertContentExists("moduleAttribute", "-module");
    });
    it("-compile module attribute", function() {
      testSupport.AssertContentExists("moduleAttribute", "-compile");
    });

    it("user defined function", function() {
      testSupport.AssertContentExists("userDefinedFunction", "start");
    });
    it("user defined function", function() {
      testSupport.AssertContentExists("userDefinedFunction", "clean");
    });
    it("user defined function", function() {
      testSupport.AssertContentExists("userDefinedFunction", "sender");
    });

    it("atom surrounded by single quotes", function() {
      testSupport.AssertContentExists("quotedAtom", "'What node? '");
    });

    it("function", function() {
      testSupport.AssertContentExists("function", "clean");
    });
    it("function", function() {
      testSupport.AssertContentExists("function", "format");
    });
    it("function after :", function() {
      testSupport.AssertContentExists("function", "call");
    });

    it("fully qualified module name", function() {
      testSupport.AssertContentExists("named-ident", "rpc");
    });
    it("fully qualified module name", function() {
      testSupport.AssertContentExists("named-ident", "io");
    });
    it("fully qualified module name", function() {
      testSupport.AssertContentExists("named-ident", "string");
    });
    it("user defined function reference", function() {
      testSupport.AssertContentExists("named-ident", "receiver");
    });
    it("user defined function reference", function() {
      testSupport.AssertContentExists("named-ident", "sender");
    });
    it("user defined function reference", function() {
      testSupport.AssertContentExists("named-ident", "send_message");
    });

    it("ident", function() {
      testSupport.AssertContentExists("ident", "talk2");
    });
    it("atom", function() {
      testSupport.AssertContentExists("ident", "OtherNode");
    });
    it("atom", function() {
      testSupport.AssertContentExists("ident", "FullNode");
    });
    it("atom", function() {
      testSupport.AssertContentExists("ident", "Message");
    });

    it("of keyword", function() {
      testSupport.AssertContentExists("keyword", "of");
    });
    it("case keyword", function() {
      testSupport.AssertContentExists("keyword", "case");
    });
    it("true keyword", function() {
      testSupport.AssertContentExists("keyword", "true");
    });
    it("false keyword", function() {
      testSupport.AssertContentExists("keyword", "false");
    });
    it("receive keyword", function() {
      testSupport.AssertContentExists("keyword", "receive");
    });
    it("end keyword", function() {
      testSupport.AssertContentExists("keyword", "end");
    });

    it("string", function() {
      testSupport.AssertContentExists("string", '"@localhost"');
    });

    it("char", function() {
      testSupport.AssertContentExists("char", "$\\n");
    });

    it(": operator", function() {
      testSupport.AssertContentExists("operator", ":");
    });
    it("-> operator", function() {
      testSupport.AssertContentExists("operator", "->");
    });

    it("macro", function() {
      testSupport.AssertContentExists("macro", "?MODULE");
    });
  });

  describe("file #2", function() {
    beforeAll(function() {
      testSupport = new TestSupportForFile("erlang2.erl", "erlang");
    });
  });
});
