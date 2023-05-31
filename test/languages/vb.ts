// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
let testSupport: TestSupportForFile;
describe("VB tests", function () {
  describe("File #1", function () {
    beforeAll(function () {
      testSupport = new TestSupportForFile("vb1.vb", "vb");
    });
    it("'comment", function () {
      testSupport.AssertContentExists("comment", "'comment");
    });
    it("Public keyword", function () {
      testSupport.AssertContentExists("keyword", "Public");
    });
    it("Class keyword", function () {
      testSupport.AssertContentExists("keyword", "Class");
    });
    it("Of keyword", function () {
      testSupport.AssertContentExists("keyword", "Of");
    });
    it("As keyword", function () {
      testSupport.AssertContentExists("keyword", "As");
    });
    it("End keyword", function () {
      testSupport.AssertContentExists("keyword", "End");
    });
    it("Sub keyword", function () {
      testSupport.AssertContentExists("keyword", "Sub");
    });
    it("Get keyword", function () {
      testSupport.AssertContentExists("keyword", "Get");
    });
    it("Set keyword", function () {
      testSupport.AssertContentExists("keyword", "Set");
    });
    it("Public keyword", function () {
      testSupport.AssertContentExists("keyword", "Public");
    });
    it("ByVal keyword", function () {
      testSupport.AssertContentExists("keyword", "ByVal");
    });
    it("Long keyword", function () {
      testSupport.AssertContentExists("keyword", "Long");
    });
    it("Integer keyword", function () {
      testSupport.AssertContentExists("keyword", "Integer");
    });
    it("String keyword", function () {
      testSupport.AssertContentExists("keyword", "String");
    });
    it("Structure keyword", function () {
      testSupport.AssertContentExists("keyword", "Structure");
    });
    it("Event keyword", function () {
      testSupport.AssertContentExists("keyword", "Event");
    });
    it("Single keyword", function () {
      testSupport.AssertContentExists("keyword", "Single");
    });
    it("Const keyword", function () {
      testSupport.AssertContentExists("keyword", "Const");
    });
    it("Char keyword", function () {
      testSupport.AssertContentExists("keyword", "Char");
    });
    it("Return keyword", function () {
      testSupport.AssertContentExists("keyword", "Return");
    });
    it("Function keyword", function () {
      testSupport.AssertContentExists("keyword", "Function");
    });
    it("Me keyword", function () {
      testSupport.AssertContentExists("keyword", "Me");
    });
    it("True keyword", function () {
      testSupport.AssertContentExists("keyword", "True");
    });
    it("False keyword", function () {
      testSupport.AssertContentExists("keyword", "False");
    });
    it("New keyword", function () {
      testSupport.AssertContentExists("keyword", "New");
    });
    it("class name after Class keyword", function () {
      testSupport.AssertContentExists("named-ident", "thisClass");
    });
    it("generic constraint", function () {
      testSupport.AssertContentExists("named-ident", "GenericConstraint1");
    });
    it("generic constraint", function () {
      testSupport.AssertContentExists("named-ident", "GenericConstraint2");
    });
    it("implemented interface name", function () {
      testSupport.AssertContentExists("named-ident", "IInterface1");
    });
    it("implemented interface name", function () {
      testSupport.AssertContentExists("named-ident", "IInterface2");
    });
    it("implemented interface name", function () {
      testSupport.AssertContentExists("named-ident", "IInterface3");
    });
    it("enum name", function () {
      testSupport.AssertContentExists("named-ident", "InterfaceColors");
    });
    it("module name", function () {
      testSupport.AssertContentExists("named-ident", "thisModule");
    });
    it("interface name", function () {
      testSupport.AssertContentExists("named-ident", "thisInterface");
    });
    it("event name", function () {
      testSupport.AssertContentExists("named-ident", "changedWorkPhone");
    });
    it("structure name", function () {
      testSupport.AssertContentExists("named-ident", "employee");
    });
    it("ident after As", function () {
      testSupport.AssertContentExists("named-ident", "MathOperator");
    });
    it("ident after New", function () {
      testSupport.AssertContentExists("named-ident", "ObjectDisposedException");
    });
    it("ident after Inherits", function () {
      testSupport.AssertContentExists("named-ident", "BaseClass");
    });
    it("ident after AddressOf", function () {
      testSupport.AssertContentExists("named-ident", "SubtractNumbers");
    });
    it("ident after Of", function () {
      testSupport.AssertContentExists("named-ident", "entryType");
    });
    it("nested cast", function () {
      testSupport.AssertContentExists("named-ident", "OohNestedCast");
    });
    it("CType cast", function () {
      testSupport.AssertContentExists("named-ident", "CastToThisType");
    });
    it("DirectCast cast", function () {
      testSupport.AssertContentExists("named-ident", "NoCastToThisType");
    });
    it("TryCast cast", function () {
      testSupport.AssertContentExists("named-ident", "TryToCastToThisType");
    });
    it("cast to array", function () {
      testSupport.AssertContentExists("named-ident", "CastToArray");
    });
    it("type name inside GetType operator", function () {
      testSupport.AssertContentExists("named-ident", "GetTypeTest");
    });
    it("class attribute", function () {
      testSupport.AssertContentExists("named-ident", "Attribute1");
    });
    it("class attribute", function () {
      testSupport.AssertContentExists("named-ident", "Attribute2");
    });
    it("class attribute", function () {
      testSupport.AssertContentExists("named-ident", "DllImport");
    });
    it("parameter attribute", function () {
      testSupport.AssertContentExists("named-ident", "ICanHazAttribute");
    });
    it("New subprocedure", function () {
      testSupport.AssertContentExists("ident", "New");
    });
    it("GetType method call", function () {
      testSupport.AssertContentExists("ident", "GetType");
    });
    it("first argument to cast function", function () {
      testSupport.AssertContentExists("ident", "castVar1");
    });
    it("first argument to cast function", function () {
      testSupport.AssertContentExists("ident", "castVar2");
    });
    it("first argument to cast function", function () {
      testSupport.AssertContentExists("ident", "castVar3");
    });
    it("first argument to cast function", function () {
      testSupport.AssertContentExists("ident", "castVar4");
    });
    it("escaped keyword", function () {
      testSupport.AssertContentExists("escapedKeyword", "[True]");
    });
    it("double quoted string", function () {
      testSupport.AssertContentExists("string", '"ThisClass is initializing with Sub New."');
    });
    it("char", function () {
      testSupport.AssertContentExists("string", '"%"');
    });
    it("hex number", function () {
      testSupport.AssertContentExists("number", "&HE1E4FF");
    });
    it("integer", function () {
      testSupport.AssertContentExists("number", "459");
    });
    it("& operator", function () {
      testSupport.AssertContentExists("operator", "&");
    });
  });
  describe("File #2 (VB2017 number literals)", function () {
    beforeAll(function () {
      testSupport = new TestSupportForFile("vb2.vb", "vb");
    });
    it("number 12_34_5%", function () {
      testSupport.AssertContentExists("number", "12_34_5%");
    });
    it("number &ha_BC_d23_8&", function () {
      testSupport.AssertContentExists("number", "&ha_BC_d23_8&");
    });
    it("number &O42_7i", function () {
      testSupport.AssertContentExists("number", "&O42_7i");
    });
    it("number &B01_1_0l", function () {
      testSupport.AssertContentExists("number", "&B01_1_0l");
    });
    it("number 123S", function () {
      testSupport.AssertContentExists("number", "123S");
    });
    it("number 123UI", function () {
      testSupport.AssertContentExists("number", "123UI");
    });
    it("number 123uL", function () {
      testSupport.AssertContentExists("number", "123uL");
    });
    it("number 123us", function () {
      testSupport.AssertContentExists("number", "123us");
    });
    it("number 2398", function () {
      testSupport.AssertContentExists("number", "2398");
    });
    it("ident _123", function () {
      testSupport.AssertContentExists("ident", "_123");
    });
    it("number 123", function () {
      testSupport.AssertContentExists("number", "123");
    });
    it("ident _", function () {
      testSupport.AssertContentExists("ident", "_");
    });
    it("number 1F", function () {
      testSupport.AssertContentExists("number", "1F");
    });
    it("number 2.0E3R", function () {
      testSupport.AssertContentExists("number", "2.0E3R");
    });
    it("number .3E+8D", function () {
      testSupport.AssertContentExists("number", ".3E+8D");
    });
    it("number 4E-9", function () {
      testSupport.AssertContentExists("number", "4E-9");
    });
    it("number 5___2.3_1_3e-4_6_4!", function () {
      testSupport.AssertContentExists("number", "5___2.3_1_3e-4_6_4!");
    });
    it("number 6#", function () {
      testSupport.AssertContentExists("number", "6.2#");
    });
    it("number 7@", function () {
      testSupport.AssertContentExists("number", "7@");
    });
  });
});