// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "./fixtures/testsupport.js";

let testSupport: TestSupportForFile;
describe("CSharp tests", function() {
  describe("file #1", function() {
    beforeAll(function() {
      testSupport = new TestSupportForFile("csharp1.cs", "csharp");
    });
    it("using keyword", function() {
      testSupport.AssertContentExists("keyword", "using");
    });
    it("class keyword", function() {
      testSupport.AssertContentExists("keyword", "class");
    });
    it("in keyword", function() {
      testSupport.AssertContentExists("keyword", "in");
    });
    it("const keyword", function() {
      testSupport.AssertContentExists("keyword", "const");
    });
    it("readonly keyword", function() {
      testSupport.AssertContentExists("keyword", "readonly");
    });
    it("internal keyword", function() {
      testSupport.AssertContentExists("keyword", "internal");
    });
    it("event keyword", function() {
      testSupport.AssertContentExists("keyword", "event");
    });
    it("set contextual keyword", function() {
      testSupport.AssertContentExists("keyword", "set");
    });
    it("get contextual keyword", function() {
      testSupport.AssertContentExists("keyword", "get");
    });
    it("value contextual keyword", function() {
      testSupport.AssertContentExists("keyword", "value");
    });
    it("yield return", function() {
      testSupport.AssertContentExists("keyword", "yield return");
    });
    it("extern alias", function() {
      testSupport.AssertContentExists("keyword", "extern alias");
    });
    it("is keyword", function() {
      testSupport.AssertContentExists("keyword", "is");
    });

    it("using alias", function() {
      testSupport.AssertContentExists("named-ident", "UsingAlias");
    });
    it("class name", function() {
      testSupport.AssertContentExists("named-ident", "ValueHandlerFactoryBase");
    });
    it("base class name", function() {
      testSupport.AssertContentExists("named-ident", "MarshalByRefObject");
    });
    it("implemented interface", function() {
      testSupport.AssertContentExists("named-ident", "IValueHandlerFactory");
    });
    it("implemented interface", function() {
      testSupport.AssertContentExists("named-ident", "IAmAnInterface");
    });
    it("type constraint name", function() {
      testSupport.AssertContentExists("named-ident", "IAmATypeConstraint");
    });
    it("type constraint name after class", function() {
      testSupport.AssertContentExists("named-ident", "IAfterClassConstraint");
    });
    it("second type constraint name after class", function() {
      testSupport.AssertContentExists("named-ident", "ISecondConstraint");
    });
    it("attribute on field on same line", function() {
      testSupport.AssertContentExists("named-ident", "Obsolete");
    });
    it("attribute on field on same line", function() {
      testSupport.AssertContentExists("named-ident", "Obsolete");
    });
    it("Object name", function() {
      testSupport.AssertContentExists("named-ident", "Object");
    });
    it("ident before generic return value", function() {
      testSupport.AssertContentExists("named-ident", "Func");
    });
    it("class name after new", function() {
      testSupport.AssertContentExists("named-ident", "ArgumentException");
    });
    it("attribute", function() {
      testSupport.AssertContentExists("named-ident", "Pure");
    });
    it("attribute", function() {
      testSupport.AssertContentExists("named-ident", "OutOfThisWorld");
    });
    it("attribute", function() {
      testSupport.AssertContentExists("named-ident", "Another");
    });
    it("attribute", function() {
      testSupport.AssertContentExists("named-ident", "AnAttribute");
    });
    it("attribute", function() {
      testSupport.AssertContentExists("named-ident", "FirstAttribute");
    });
    it("attribute", function() {
      testSupport.AssertContentExists("named-ident", "ThirdAttribute");
    });
    it("fully qualified attribute", function() {
      testSupport.AssertContentExists("named-ident", "FullyQualifiedAttribute");
    });
    it("second generic argument", function() {
      testSupport.AssertContentExists("named-ident", "SecondGeneric");
    });
    it("class name before []", function() {
      testSupport.AssertContentExists("named-ident", "ArrayOfSomething");
    });
    it("class name before []", function() {
      testSupport.AssertContentExists("named-ident", "AnotherArrayOfSomething");
    });
    it("fully qualified class naming", function() {
      testSupport.AssertContentExists("named-ident", "FullyQualifiedClass1");
    });
    it("fully qualified class naming", function() {
      testSupport.AssertContentExists("named-ident", "FullyQualifiedClass2");
    });
    it("class that starts with T", function() {
      testSupport.AssertContentExists("named-ident", "TanningBooth");
    });
    it("new()'d class", function() {
      testSupport.AssertContentExists(
        "named-ident",
        "InvalidOperationException"
      );
    });
    it("generic method definition during invocation", function() {
      testSupport.AssertContentExists("named-ident", "GenericMethodDefinition");
    });
    it("type name after is keyword", function() {
      testSupport.AssertContentExists("named-ident", "TypeAfterIs");
    });
    it("type name that is being used in a using alias", function() {
      testSupport.AssertContentExists("named-ident", "UsingThisClass");
    });

    it("#if pragma", function() {
      testSupport.AssertContentExists("pragma", "#if NET_20");
    });
    it("#endif pragma", function() {
      testSupport.AssertContentExists("pragma", "#endif");
    });
    it("#region pragma", function() {
      testSupport.AssertContentExists(
        "pragma",
        "#region verify that casts are properly colored"
      );
    });
    it("#endregion pragma", function() {
      testSupport.AssertContentExists("pragma", "#endregion");
    });

    it("method name", function() {
      testSupport.AssertContentExists("ident", "Iterate");
    });
    it("non-keyword set", function() {
      testSupport.AssertContentExists("ident", "set");
    });
    it("non-keyword get", function() {
      testSupport.AssertContentExists("ident", "get");
    });
    it("non-keyword value", function() {
      testSupport.AssertContentExists("ident", "value");
    });
    it("named parameter in attribute", function() {
      testSupport.AssertContentExists("ident", "AttributeNamedParameter");
    });
    it("method name", function() {
      testSupport.AssertContentExists("ident", "Meh");
    });
    it("method name", function() {
      testSupport.AssertContentExists("ident", "DoStuff");
    });
    it("method name", function() {
      testSupport.AssertContentExists("ident", "DoOtherStuff");
    });
    it("parameter name after generic", function() {
      testSupport.AssertContentExists("ident", "fooEnumerable");
    });
    it("@ syntax for idents", function() {
      testSupport.AssertContentExists("ident", "@class");
    });
    it("parameter name", function() {
      testSupport.AssertContentExists("ident", "criterionFieldName");
    });
    it("array length initializer between []", function() {
      testSupport.AssertContentExists("ident", "initialArrayLength");
    });
    it("generic method invocation", function() {
      testSupport.AssertContentExists("ident", "GenericMethodInvocation");
    });
    it("accessing specific array index", function() {
      testSupport.AssertContentExists("ident", "ArrayAccess");
    });
    it("fully qualified class naming", function() {
      testSupport.AssertContentExists("ident", "Fully1");
    });
    it("fully qualified class naming", function() {
      testSupport.AssertContentExists("ident", "Fully2");
    });
    it("fully qualified class naming", function() {
      testSupport.AssertContentExists("ident", "Qualified1");
    });
    it("fully qualified class naming", function() {
      testSupport.AssertContentExists("ident", "Qualified2");
    });
    it("property name", function() {
      testSupport.AssertContentExists("ident", "PropertyAccessor");
    });
    it("parameter in generic method", function() {
      testSupport.AssertContentExists("ident", "shouldNotBeNamed");
    });
    it("generic method name", function() {
      testSupport.AssertContentExists("ident", "GenericMethod");
    });
    it("type definition on class", function() {
      testSupport.AssertContentExists("ident", "TClass1");
    });
    it("type definition on class", function() {
      testSupport.AssertContentExists("ident", "TClass2");
    });
    it("type definition on class", function() {
      testSupport.AssertContentExists("ident", "TClass3");
    });
    it("generic return value definition", function() {
      testSupport.AssertContentExists("ident", "TReturnValue");
    });
    it("generic method definition", function() {
      testSupport.AssertContentExists("ident", "TMethod");
    });
    it("generic parameter definition", function() {
      testSupport.AssertContentExists("ident", "TParameter");
    });
    it("type constraint on class", function() {
      testSupport.AssertContentExists("ident", "TClass1Constraint");
    });
    it("type constraint on class", function() {
      testSupport.AssertContentExists("ident", "TClass2Constraint");
    });
    it("type constraint T", function() {
      testSupport.AssertContentExists("ident", "T");
    });
    it("type constraint T1", function() {
      testSupport.AssertContentExists("ident", "T1");
    });
    it("type definition as return value", function() {
      testSupport.AssertContentExists("ident", "TNotNamed");
    });
    it("type definition in default()", function() {
      testSupport.AssertContentExists("ident", "TAlsoNotNamed");
    });
    it("if (notACast) doSomething()", function() {
      testSupport.AssertContentExists("ident", "notACast");
    });
    it("namespace of fully qualified attribute", function() {
      testSupport.AssertContentExists("ident", "NotAnAttribute");
    });
    it("namespace of fully qualified type after is keyword", function() {
      testSupport.AssertContentExists("ident", "MyNamespace");
    });

    it("multi line comment", function() {
      testSupport.AssertContentExists(
        "comment",
        "/* multi\n\t\t\tline comment\n\t\t\t*/"
      );
    });
    it("single line comment", function() {
      testSupport.AssertContentExists(
        "comment",
        "//neither foo below should be a named ident"
      );
    });

    it("string with escaped quote", function() {
      testSupport.AssertContentExists("string", '"this is \\"a\\" string"');
    });
    it("verbatim string with escaped quote", function() {
      testSupport.AssertContentExists(
        "string",
        '@"this is ""another""\nmulti line\nstring"'
      );
    });

    it("char", function() {
      testSupport.AssertContentExists("char", "'c'");
    });
    it("char with escaped single quote", function() {
      testSupport.AssertContentExists("char", "'\\''");
    });
    it("char with escaped backslash", function() {
      testSupport.AssertContentExists("char", "'\\\\'");
    });

    it("number 0", function() {
      testSupport.AssertContentExists("number", "0");
    });
    it("number 1.5", function() {
      testSupport.AssertContentExists("number", "1.5");
    });
    it("number 0x1a", function() {
      testSupport.AssertContentExists("number", "0x1a");
    });
    it("number 1.7f", function() {
      testSupport.AssertContentExists("number", "1.7f");
    });
    it("number 1.2d", function() {
      testSupport.AssertContentExists("number", "1.2d");
    });
    it("number 12", function() {
      testSupport.AssertContentExists("number", "12");
    });
    it("number 0xffffff", function() {
      testSupport.AssertContentExists("number", "0xffffff");
    });

    it("xml doc comment ///", function() {
      testSupport.AssertContentExists("xmlDocCommentMeta", "///");
    });
    it("xml doc comment <summary>", function() {
      testSupport.AssertContentExists("xmlDocCommentMeta", "<summary>");
    });
    it("xml doc comment </summary>", function() {
      testSupport.AssertContentExists("xmlDocCommentMeta", "</summary>");
    });
    it("xml doc comment <c cref>", function() {
      testSupport.AssertContentExists("xmlDocCommentMeta", '<c cref="Foo">');
    });
    it("xml doc comment <c/c>", function() {
      testSupport.AssertContentExists("xmlDocCommentMeta", "</c>");
    });
    it("xml doc comment content between tags", function() {
      testSupport.AssertContentExists(
        "xmlDocCommentContent",
        "generic parameters"
      );
    });
    it("xml doc comment content", function() {
      testSupport.AssertContentExists(
        "xmlDocCommentContent",
        " Tests the coloring of generic method definitions and"
      );
    });
  });

  describe("file #2", function() {
    beforeAll(function() {
      testSupport = new TestSupportForFile("csharp2.cs", "csharp");
    });
    // undefined token when ident is the first token
    it("undefined token fix", function() {
      testSupport.AssertContentExists("named-ident", "UndefinedTokenFix");
    });
    it("undefined token fix", function() {
      testSupport.AssertContentExists("ident", "undefinedTokenFix");
    });
  });

  describe("file #3", function() {
    beforeAll(function() {
      testSupport = new TestSupportForFile("csharp3.cs", "csharp");
    });
    // when attribute is first token
    it("attribute as first token", function() {
      testSupport.AssertContentExists("named-ident", "FirstToken");
    });
  });
});
