// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupport } from "./fixtures/testsupport.js";

describe("PHP tests", function() {
  let testSupport: TestSupport;
  describe("file #1", function() {
    before(function() {
      testSupport = new TestSupport("php1.php", "php");
    });
    it("open tag", function() {
      testSupport.AssertContentExists("openTag", "<?php");
    });
    it("close tag", function() {
      testSupport.AssertContentExists("closeTag", "?>");
    });
    it("short open tag", function() {
      testSupport.AssertContentExists("shortOpenTag", "<?");
    });
    it("short open tag echo", function() {
      testSupport.AssertContentExists("shortOpenTag", "<?=");
    });

    it("namespace keyword", function() {
      testSupport.AssertContentExists("keyword", "namespace");
    });
    it("use keyword", function() {
      testSupport.AssertContentExists("keyword", "use");
    });
    it("class keyword", function() {
      testSupport.AssertContentExists("keyword", "class");
    });
    it("class keyword", function() {
      testSupport.AssertContentExists("keyword", "interface");
    });
    it("public keyword", function() {
      testSupport.AssertContentExists("keyword", "public");
    });
    it("static keyword", function() {
      testSupport.AssertContentExists("keyword", "static");
    });
    it("function keyword", function() {
      testSupport.AssertContentExists("keyword", "function");
    });
    it("parent keyword", function() {
      testSupport.AssertContentExists("keyword", "parent");
    });
    it("self keyword", function() {
      testSupport.AssertContentExists("keyword", "self");
    });
    it("endif keyword", function() {
      testSupport.AssertContentExists("keyword", "endif");
    });
    it("if keyword", function() {
      testSupport.AssertContentExists("keyword", "if");
    });

    it("const ident", function() {
      testSupport.AssertContentExists("ident", "KISS");
    });
    it("namespace name in fully qualified new() 1", function() {
      testSupport.AssertContentExists("ident", "Fully1");
    });
    it("namespace name in fully qualified new() 2", function() {
      testSupport.AssertContentExists("ident", "Fully2");
    });
    it("namespace name in fully qualified new() 1", function() {
      testSupport.AssertContentExists("ident", "Qualified1");
    });
    it("namespace name in fully qualified new() 2", function() {
      testSupport.AssertContentExists("ident", "Qualified2");
    });

    it("named ident after new", function() {
      testSupport.AssertContentExists("named-ident", "OutOfBoundsException");
    });
    it("extended class", function() {
      testSupport.AssertContentExists("named-ident", "ExtendedClass");
    });
    it("implemented interface", function() {
      testSupport.AssertContentExists("named-ident", "ImplementedInterface1");
    });
    it("implemented interface", function() {
      testSupport.AssertContentExists("named-ident", "ImplementedInterface2");
    });
    it("implemented interface", function() {
      testSupport.AssertContentExists("named-ident", "ImplementedInterface3");
    });
    it("named ident for static class method call", function() {
      testSupport.AssertContentExists("named-ident", "StaticClass");
    });
    it("fully qualified class name 1", function() {
      testSupport.AssertContentExists(
        "named-ident",
        "FullyQualifiedClassName1"
      );
    });
    it("fully qualified class name 2", function() {
      testSupport.AssertContentExists(
        "named-ident",
        "FullyQualifiedClassName2"
      );
    });
    it("not fully qualified class name", function() {
      testSupport.AssertContentExists("named-ident", "NotFullyQualified");
    });
    it("class name after new", function() {
      testSupport.AssertContentExists("named-ident", "OutOfBoundsException");
    });
    it("class name after instanceof fully qualified", function() {
      testSupport.AssertContentExists("named-ident", "InstanceOfClassName1");
    });
    it("class name after instanceof not fully qualified", function() {
      testSupport.AssertContentExists("named-ident", "InstanceOfClassName2");
    });
    it("class name in closure use statement", function() {
      testSupport.AssertContentExists("named-ident", "ClassName3");
    });
    it("class name in use statement", function() {
      testSupport.AssertContentExists("named-ident", "UseThisClass");
    });
    it("class name in use statement", function() {
      testSupport.AssertContentExists("named-ident", "AlsoUseThis");
    });
    it("class name in use statement", function() {
      testSupport.AssertContentExists("named-ident", "AndUseThis");
    });
    it("class name in use statement", function() {
      testSupport.AssertContentExists("named-ident", "UseMePlease");
    });
    it("class name in use statement", function() {
      testSupport.AssertContentExists("named-ident", "UseMe");
    });
    it("class name in use statement", function() {
      testSupport.AssertContentExists("named-ident", "NoUseMe");
    });

    it("Perl-style comment", function() {
      testSupport.AssertContentExists(
        "comment",
        "#Perl-style comments are stupid"
      );
    });
    it("Single line comment", function() {
      testSupport.AssertContentExists("comment", "//unset stuff");
    });
    it("multi line comment", function() {
      testSupport.AssertContentExists(
        "comment",
        "/**\n\t\t * This does something\n\t\t */"
      );
    });

    it("array language construct", function() {
      testSupport.AssertContentExists("languageConstruct", "array");
    });
    it("unset language construct", function() {
      testSupport.AssertContentExists("languageConstruct", "unset");
    });
    it("return language construct", function() {
      testSupport.AssertContentExists("languageConstruct", "return");
    });
    it("$this variable", function() {
      testSupport.AssertContentExists("variable", "$this");
    });
    it("$kiss variable", function() {
      testSupport.AssertContentExists("variable", "$kiss");
    });
    it("private member variable", function() {
      testSupport.AssertContentExists("variable", "$myPrivateVar");
    });
    it("single quoted string", function() {
      testSupport.AssertContentExists("string", "'foo'");
    });
    it("double quoted string with escaped quote", function() {
      testSupport.AssertContentExists(
        "string",
        '"this one is my \\"favorite\\""'
      );
    });
    it("is_int function", function() {
      testSupport.AssertContentExists("function", "is_int");
    });
    it(".= operator", function() {
      testSupport.AssertContentExists("operator", ".=");
    });
    it("-> operator", function() {
      testSupport.AssertContentExists("operator", "->");
    });
    it("emptyheredoc", function() {
      testSupport.AssertContentExists(
        "nowdoc",
        "<<<'EMPTYNOWDOC'\nEMPTYNOWDOC"
      );
    });
    it("emptynowdoc", function() {
      testSupport.AssertContentExists(
        "heredoc",
        "<<<EMPTYHEREDOC\nEMPTYHEREDOC"
      );
    });
    it("nowdoc", function() {
      testSupport.AssertContentExists(
        "nowdoc",
        "<<<'LULZ'\noh look\na nowdoc!\nLULZ"
      );
    });
    it("heredoc", function() {
      testSupport.AssertContentExists(
        "heredoc",
        "<<<LOL\noh 'look'\na heredoc!\nLOL"
      );
    });
  });

  describe("file #2", function() {
    before(function() {
      testSupport = new TestSupport("php2.php", "php");
    });
    it("unclosed heredoc", function() {
      testSupport.AssertContentExists(
        "heredoc",
        "<<<HEREDOC\nunclosed heredoc\n"
      );
    });
  });
});
