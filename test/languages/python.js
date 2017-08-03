// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "../fixtures/testsupport.js";

describe("Python tests", function() {
  let testSupport: TestSupportForFile;
  beforeAll(function() {
    testSupport = new TestSupportForFile("python.py", "python");
  });
  it("comment", function() {
    testSupport.AssertContentExists("comment", "#normal strings");
  });
  it("comment", function() {
    testSupport.AssertContentExists("comment", "#raw strings");
  });
  it("comment", function() {
    testSupport.AssertContentExists("comment", "#binary strings");
  });

  it("single quoted string", function() {
    testSupport.AssertContentExists("string", "'Hello, world!'");
  });
  it("double quoted string", function() {
    testSupport.AssertContentExists("string", '"Hello, world!"');
  });

  it("raw double quoted string", function() {
    testSupport.AssertContentExists("rawString", 'r"hello"');
  });
  it("raw double quoted string", function() {
    testSupport.AssertContentExists("rawString", 'R"hello"');
  });
  it("raw single quoted string", function() {
    testSupport.AssertContentExists("rawString", "r'hello'");
  });
  it("raw single quoted string", function() {
    testSupport.AssertContentExists("rawString", "R'hello'");
  });

  it("raw single quoted string", function() {
    testSupport.AssertContentExists("rawLongString", "R'''hello'''");
  });
  it("raw single quoted string", function() {
    testSupport.AssertContentExists("rawLongString", "r'''hello'''");
  });
  it("raw double quoted string", function() {
    testSupport.AssertContentExists("rawLongString", 'R"""hello"""');
  });
  it("raw double quoted string", function() {
    testSupport.AssertContentExists("rawLongString", 'r"""hello"""');
  });

  it("binary raw double quoted string", function() {
    testSupport.AssertContentExists("binaryString", 'br"hello"');
  });
  it("binary raw single quoted string", function() {
    testSupport.AssertContentExists("binaryString", "br'hello'");
  });
  it("binary raw double quoted string", function() {
    testSupport.AssertContentExists("binaryString", 'bR"hello"');
  });
  it("binary raw single quoted string", function() {
    testSupport.AssertContentExists("binaryString", "bR'hello'");
  });
  it("binary raw double quoted string", function() {
    testSupport.AssertContentExists("binaryString", 'Br"hello"');
  });
  it("binary raw single quoted string", function() {
    testSupport.AssertContentExists("binaryString", "Br'hello'");
  });
  it("binary raw double quoted string", function() {
    testSupport.AssertContentExists("binaryString", 'BR"hello"');
  });
  it("binary raw single quoted string", function() {
    testSupport.AssertContentExists("binaryString", "BR'hello'");
  });

  it("binary raw long double quoted string", function() {
    testSupport.AssertContentExists("binaryLongString", 'br"""hello"""');
  });
  it("binary raw single long quoted string", function() {
    testSupport.AssertContentExists("binaryLongString", "br'''hello'''");
  });
  it("binary raw long double quoted string", function() {
    testSupport.AssertContentExists("binaryLongString", 'bR"""hello"""');
  });
  it("binary raw single long quoted string", function() {
    testSupport.AssertContentExists("binaryLongString", "bR'''hello'''");
  });
  it("binary raw long double quoted string", function() {
    testSupport.AssertContentExists("binaryLongString", 'Br"""hello"""');
  });
  it("binary raw single long quoted string", function() {
    testSupport.AssertContentExists("binaryLongString", "Br'''hello'''");
  });
  it("binary raw long double quoted string", function() {
    testSupport.AssertContentExists("binaryLongString", 'BR"""hello"""');
  });
  it("binary raw single long quoted string", function() {
    testSupport.AssertContentExists("binaryLongString", "BR'''hello'''");
  });

  it("long single quoted string", function() {
    testSupport.AssertContentExists("longString", "'''Hello, world!'''");
  });
  it("long double quoted string", function() {
    testSupport.AssertContentExists("longString", '"""Hello, world!"""');
  });

  it("print function", function() {
    testSupport.AssertContentExists("function", "print");
  });
  it("len function", function() {
    testSupport.AssertContentExists("function", "len");
  });
  it("range function", function() {
    testSupport.AssertContentExists("function", "range");
  });
  it("reversed function", function() {
    testSupport.AssertContentExists("function", "reversed");
  });

  it("class name", function() {
    testSupport.AssertContentExists("named-ident", "BailOut");
  });
  it("function name", function() {
    testSupport.AssertContentExists("named-ident", "validate");
  });
  it("function name", function() {
    testSupport.AssertContentExists("named-ident", "add_queen");
  });
  it("function name", function() {
    testSupport.AssertContentExists("named-ident", "overdrawn");
  });
  it("exception name after except", function() {
    testSupport.AssertContentExists("named-ident", "ValueError");
  });

  it("variable declaration", function() {
    testSupport.AssertContentExists("ident", "BOARD_SIZE");
  });
  it("function parameter", function() {
    testSupport.AssertContentExists("ident", "queens");
  });
  it("variable declaration", function() {
    testSupport.AssertContentExists("ident", "variableName");
  });
  it("variable declaration", function() {
    testSupport.AssertContentExists("ident", "complexNumber");
  });

  it("while keyword", function() {
    testSupport.AssertContentExists("keyword", "while");
  });
  it("import keyword", function() {
    testSupport.AssertContentExists("keyword", "import");
  });
  it("for keyword", function() {
    testSupport.AssertContentExists("keyword", "for");
  });
  it("in keyword", function() {
    testSupport.AssertContentExists("keyword", "in");
  });
  it("else keyword", function() {
    testSupport.AssertContentExists("keyword", "else");
  });
  it("if keyword", function() {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("try keyword", function() {
    testSupport.AssertContentExists("keyword", "try");
  });
  it("def keyword", function() {
    testSupport.AssertContentExists("keyword", "def");
  });
  it("return keyword", function() {
    testSupport.AssertContentExists("keyword", "return");
  });

  it("complex number", function() {
    testSupport.AssertContentExists("number", "4j");
  });
  it("integer", function() {
    testSupport.AssertContentExists("number", "5");
  });

  it("** operator", function() {
    testSupport.AssertContentExists("operator", "**");
  });
  it("+= delimiter", function() {
    testSupport.AssertContentExists("delimiter", "+=");
  });
  it("= delimiter", function() {
    testSupport.AssertContentExists("delimiter", "=");
  });

  it("ellipsis", function() {
    testSupport.AssertContentExists("ellipsis", "...");
  });

  it("None constant", function() {
    testSupport.AssertContentExists("constant", "None");
  });
  it("True constant", function() {
    testSupport.AssertContentExists("constant", "True");
  });
  it("False constant", function() {
    testSupport.AssertContentExists("constant", "False");
  });
  it("__debug__ constant", function() {
    testSupport.AssertContentExists("constant", "__debug__");
  });
  it("Ellipsis constant", function() {
    testSupport.AssertContentExists("constant", "Ellipsis");
  });
  it("NotImplemented constant", function() {
    testSupport.AssertContentExists("constant", "NotImplemented");
  });

  it("__name__ attribute", function() {
    testSupport.AssertContentExists("attribute", "__name__");
  });
});
