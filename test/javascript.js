// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupport } from "./fixtures/testsupport.js";

let testSupport: TestSupport;
describe("Javascript tests", function() {
  before(function() {
    testSupport = new TestSupport("javascript.js", "javascript");
  });
  it("function keyword", function() {
    testSupport.AssertContentExists("keyword", "function");
  });
  it("if keyword", function() {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("throw keyword", function() {
    testSupport.AssertContentExists("keyword", "throw");
  });
  it("var keyword", function() {
    testSupport.AssertContentExists("keyword", "var");
  });
  it("in keyword", function() {
    testSupport.AssertContentExists("keyword", "in");
  });
  it("null keyword", function() {
    testSupport.AssertContentExists("keyword", "null");
  });
  it("finally keyword", function() {
    testSupport.AssertContentExists("keyword", "finally");
  });
  it("reserved word", function() {
    testSupport.AssertContentExists("reservedWord", "abstract");
  });
  it("$$ named ident", function() {
    testSupport.AssertContentExists("named-ident", "$$");
  });
  it("$ named ident", function() {
    testSupport.AssertContentExists("ident", "$");
  });
  it("foo named ident", function() {
    testSupport.AssertContentExists("named-ident", "foo");
  });
  it(": operator", function() {
    testSupport.AssertContentExists("operator", ":");
  });
  it("isNaN global function", function() {
    testSupport.AssertContentExists("globalFunction", "isNaN");
  });
  it("regex literal with escaped forward slash", function() {
    testSupport.AssertContentExists("regexLiteral", "/\\//");
  });
  it("regex literal with escaped backslash", function() {
    testSupport.AssertContentExists("regexLiteral", "/\\\\/");
  });
  it("regex literal with valid modifiers", function() {
    testSupport.AssertContentExists("regexLiteral", "/foo/gim");
  });
  it("regex literal with invalid modifiers", function() {
    testSupport.AssertContentExists("regexLiteral", "/foo/asdfasdf");
  });
  it("regex literal after colon", function() {
    testSupport.AssertContentExists("regexLiteral", "/regexaftercolon/");
  });
  it("regex literal after operator", function() {
    testSupport.AssertContentExists("regexLiteral", "/regexafteroperator/");
  });
  it("regex literal at start of line", function() {
    testSupport.AssertContentExists("regexLiteral", "/regexatstartofline/");
  });
  it("regex literal after a comma", function() {
    testSupport.AssertContentExists("regexLiteral", "/regexaftercomma/");
  });
  it("regex literal after a semicolon", function() {
    testSupport.AssertContentExists("regexLiteral", "/regexaftersemicolon/");
  });
  it("regex literal after curly brace", function() {
    testSupport.AssertContentExists("regexLiteral", "/regexafterbrace/");
  });
  it("regex literal after bracket", function() {
    testSupport.AssertContentExists("regexLiteral", "/regexafterbracket/");
  });
  it("regex literal after paren", function() {
    testSupport.AssertContentExists("regexLiteral", "/regexafterparen/");
  });
  it("regex literal with forward slash in character class", function() {
    testSupport.AssertContentExists("regexLiteral", "/[/]/");
  });
  it("regex literal with escaped forward slash in character class", function() {
    testSupport.AssertContentExists("regexLiteral", "/[\\/]/");
  });
  it("regex literal with escaped closing bracket in character class", function() {
    testSupport.AssertContentExists("regexLiteral", "/[\\]]/");
  });
  it("regex literal with escaped opening bracket in character class", function() {
    testSupport.AssertContentExists("regexLiteral", "/[\\[]/");
  });
  it("regex literal with escaped opening bracket", function() {
    testSupport.AssertContentExists("regexLiteral", "/\\[/");
  });
  it("regex literal with escaped closing bracket", function() {
    testSupport.AssertContentExists("regexLiteral", "/\\]/");
  });
  it("not a regex literal after division operator", function() {
    testSupport.AssertContentExists("ident", "identafterdivision1");
  });
  it("not a regex literal after division operator", function() {
    testSupport.AssertContentExists("ident", "identafterdivision2");
  });
  it("not a regex literal after division operator", function() {
    testSupport.AssertContentExists("ident", "identafterdivision3");
  });
  it("not a regex literal after keyword", function() {
    testSupport.AssertContentExists("ident", "regexafterkeyword");
  });
  it("single line comment", function() {
    testSupport.AssertContentExists("comment", "//should not be a regex");
  });
  it("string with escaped backslash and escaped quote", function() {
    testSupport.AssertContentExists("string", '"he\\\\\\"ad"');
  });
  it("single quoted string with escaped quote", function() {
    testSupport.AssertContentExists(
      "string",
      "'missing jQuery\\'s dependency'"
    );
  });
  it("hex number", function() {
    testSupport.AssertContentExists("number", "0x2");
  });
  it("scientific notation", function() {
    testSupport.AssertContentExists("number", "1e3");
  });
  it("integer", function() {
    testSupport.AssertContentExists("number", "1");
  });
  it("float", function() {
    testSupport.AssertContentExists("number", "0.5");
  });
  it("XMLHttpRequest", function() {
    testSupport.AssertContentExists("globalObject", "XMLHttpRequest");
  });
  it("XDomainRequest", function() {
    testSupport.AssertContentExists("globalObject", "XDomainRequest");
  });
  it("ActiveXObject", function() {
    testSupport.AssertContentExists("globalObject", "ActiveXObject");
  });
  it("Object", function() {
    testSupport.AssertContentExists("globalObject", "Object");
  });
  it("String", function() {
    testSupport.AssertContentExists("globalObject", "String");
  });
  it("JSON", function() {
    testSupport.AssertContentExists("globalObject", "JSON");
  });
  it("Boolean", function() {
    testSupport.AssertContentExists("globalObject", "Boolean");
  });
  it("Infinity", function() {
    testSupport.AssertContentExists("globalVariable", "Infinity");
  });
  it("NaN", function() {
    testSupport.AssertContentExists("globalVariable", "NaN");
  });
});
