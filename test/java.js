// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "./fixtures/testsupport.js";

let testSupport: TestSupportForFile;
describe("Javascript tests", function() {
  beforeAll(function() {
    testSupport = new TestSupportForFile("java.java", "java");
  });
  it("extends keyword", function() {
    testSupport.AssertContentExists("keyword", "extends");
  });
  it("implements keyword", function() {
    testSupport.AssertContentExists("keyword", "implements");
  });
  it("package keyword", function() {
    testSupport.AssertContentExists("keyword", "package");
  });
  it("import keyword", function() {
    testSupport.AssertContentExists("keyword", "import");
  });
  it("private keyword", function() {
    testSupport.AssertContentExists("keyword", "private");
  });
  it("int keyword", function() {
    testSupport.AssertContentExists("keyword", "int");
  });
  it("public keyword", function() {
    testSupport.AssertContentExists("keyword", "public");
  });
  it("super keyword", function() {
    testSupport.AssertContentExists("keyword", "super");
  });
  it("protected keyword", function() {
    testSupport.AssertContentExists("keyword", "protected");
  });
  it("abstract keyword", function() {
    testSupport.AssertContentExists("keyword", "abstract");
  });
  it("char keyword", function() {
    testSupport.AssertContentExists("keyword", "char");
  });
  it("void keyword", function() {
    testSupport.AssertContentExists("keyword", "void");
  });
  it("null keyword", function() {
    testSupport.AssertContentExists("keyword", "null");
  });
  it("this keyword", function() {
    testSupport.AssertContentExists("keyword", "this");
  });
  it("false keyword", function() {
    testSupport.AssertContentExists("keyword", "false");
  });
  it("true keyword", function() {
    testSupport.AssertContentExists("keyword", "true");
  });
  it("true keyword", function() {
    testSupport.AssertContentExists("keyword", "enum");
  });
  it("while keyword", function() {
    testSupport.AssertContentExists("keyword", "while");
  });
  it("throws keyword", function() {
    testSupport.AssertContentExists("keyword", "throws");
  });

  it("cast", function() {
    testSupport.AssertContentExists("named-ident", "CastingTest1");
  });
  it("cast", function() {
    testSupport.AssertContentExists("named-ident", "CastingTest2");
  });
  it("class name", function() {
    testSupport.AssertContentExists("named-ident", "MyClass");
  });
  it("class name", function() {
    testSupport.AssertContentExists("named-ident", "ExtendedClass");
  });
  it("interface name", function() {
    testSupport.AssertContentExists("named-ident", "Interfacable1");
  });
  it("interface name", function() {
    testSupport.AssertContentExists("named-ident", "Interfacable2");
  });
  it("interface name", function() {
    testSupport.AssertContentExists("named-ident", "Interfacable3");
  });
  it("array parameter", function() {
    testSupport.AssertContentExists("named-ident", "ArrayParameter");
  });
  it("type constraint for generic", function() {
    testSupport.AssertContentExists("named-ident", "GenericExtended");
  });
  it("type constraint for generic after &", function() {
    testSupport.AssertContentExists("named-ident", "GenericImplemented");
  });
  it("generic parameter", function() {
    testSupport.AssertContentExists("named-ident", "GenericParam");
  });
  it("fully qualified class name", function() {
    testSupport.AssertContentExists("named-ident", "ClassName1");
  });
  it("fully qualified class name after new", function() {
    testSupport.AssertContentExists("named-ident", "ClassName2");
  });
  it("generic parameter", function() {
    testSupport.AssertContentExists("named-ident", "AnotherGeneric");
  });
  it("generic parameter", function() {
    testSupport.AssertContentExists("named-ident", "FirstGeneric");
  });
  it("generic parameter", function() {
    testSupport.AssertContentExists("named-ident", "SecondGeneric");
  });
  it("generic class name", function() {
    testSupport.AssertContentExists("named-ident", "MyCustomMap1");
  });
  it("generic class name", function() {
    testSupport.AssertContentExists("named-ident", "MyCustomMap2");
  });
  it("array declaration", function() {
    testSupport.AssertContentExists("named-ident", "ArrayTest1");
  });
  it("array instantiation with variable", function() {
    testSupport.AssertContentExists("named-ident", "ArrayTest2");
  });
  it("array instantiation with integer", function() {
    testSupport.AssertContentExists("named-ident", "ArrayTest3");
  });
  it("enum name", function() {
    testSupport.AssertContentExists("named-ident", "Planet");
  });
  it("caught exception name", function() {
    testSupport.AssertContentExists("named-ident", "InterruptedException");
  });
  it("checked exception 1", function() {
    testSupport.AssertContentExists("named-ident", "CheckedException1");
  });
  it("checked exception 2", function() {
    testSupport.AssertContentExists("named-ident", "CheckedException2");
  });
  it("checked exception 3", function() {
    testSupport.AssertContentExists("named-ident", "CheckedException3");
  });
  it("fully qualified type name after instanceof", function() {
    testSupport.AssertContentExists("named-ident", "CharSequence");
  });
  it("fully qualified type name after import", function() {
    testSupport.AssertContentExists("named-ident", "StackTraceElement");
  });

  it("method parameter", function() {
    testSupport.AssertContentExists("ident", "parameter1");
  });
  it("method parameter", function() {
    testSupport.AssertContentExists("ident", "arrayParameter");
  });
  it("abstract method name", function() {
    testSupport.AssertContentExists("ident", "abstractMethod");
  });
  it("generic method name", function() {
    testSupport.AssertContentExists("ident", "genericMethod");
  });
  it("generic parameter", function() {
    testSupport.AssertContentExists("ident", "genericParam");
  });
  it("fully qualified package name", function() {
    testSupport.AssertContentExists("ident", "fully1");
  });
  it("fully qualified package name", function() {
    testSupport.AssertContentExists("ident", "fully2");
  });
  it("fully qualified package name", function() {
    testSupport.AssertContentExists("ident", "qualified1");
  });
  it("fully qualified package name", function() {
    testSupport.AssertContentExists("ident", "qualified2");
  });
  it("variable name", function() {
    testSupport.AssertContentExists("ident", "myVector");
  });
  it("if (notACast) methodCall()", function() {
    testSupport.AssertContentExists("ident", "notACast");
  });

  it("Documented annotation", function() {
    testSupport.AssertContentExists("annotation", "@Documented");
  });
  it("AnnotationWithArguments annotation", function() {
    testSupport.AssertContentExists("annotation", "@AnnotationWithArguments");
  });
  it("annotation", function() {
    testSupport.AssertContentExists("annotation", "@Override");
  });

  it("single line comment", function() {
    testSupport.AssertContentExists(
      "comment",
      "//wait, so Java seriously uses the ampersand for interfaces in generics?"
    );
  });
  it("multi line comment", function() {
    testSupport.AssertContentExists(
      "comment",
      "/*\n\tmulti line\n\tcomment\n\t*/"
    );
  });

  it("string with escapes", function() {
    testSupport.AssertContentExists("string", '"this \\"is\\" a string\\\\"');
  });
});
