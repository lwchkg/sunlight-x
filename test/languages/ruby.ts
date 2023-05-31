// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
describe("Ruby tests", function () {
  let testSupport: TestSupportForFile;
  beforeAll(function () {
    testSupport = new TestSupportForFile("ruby.rb", "ruby");
  });
  it("default heredoc declaration", function () {
    testSupport.AssertContentExists("heredocDeclaration", "<<HEREDOC");
  });
  it("double quoted heredoc declaration", function () {
    testSupport.AssertContentExists("heredocDeclaration", '<<"QUOTEDHEREDOC"');
  });
  it("back quoted heredoc declaration", function () {
    testSupport.AssertContentExists("heredocDeclaration", "<<`BACKQUOTEDHEREDOC`");
  });
  it("single quoted heredoc declaration", function () {
    testSupport.AssertContentExists("heredocDeclaration", "<<'SINGLEQUOTEDHEREDOC'");
  });
  it("stacked heredoc declaration", function () {
    testSupport.AssertContentExists("heredocDeclaration", '<<"stacked1"');
  });
  it("stacked heredoc declaration", function () {
    testSupport.AssertContentExists("heredocDeclaration", '<<"stacked2"');
  });
  it("indented heredoc declaration", function () {
    testSupport.AssertContentExists("heredocDeclaration", "<<-INDENTED");
  });
  it("heredoc declaration that starts with a number", function () {
    testSupport.AssertContentExists("heredocDeclaration", "<<1_a2");
  });
  it("heredoc declaration after ident", function () {
    testSupport.AssertContentExists("heredocDeclaration", "<<afterIdent");
  });
  it("default heredoc body", function () {
    testSupport.AssertContentExists("heredoc", "Default heredoc body\nHEREDOC\n");
  });
  it("double quoted heredoc body", function () {
    testSupport.AssertContentExists("heredoc", "Quoted heredoc body\nQUOTEDHEREDOC\n");
  });
  it("back quoted heredoc body", function () {
    testSupport.AssertContentExists("heredoc", "echo back quoted heredoc body\nBACKQUOTEDHEREDOC\n");
  });
  it("single quoted heredoc body", function () {
    testSupport.AssertContentExists("heredoc", "single quoted heredoc body\nSINGLEQUOTEDHEREDOC\n");
  });
  it("stacked heredoc body", function () {
    testSupport.AssertContentExists("heredoc", "stacked heredoc #1\nstacked1\n");
  });
  it("stacked heredoc body", function () {
    testSupport.AssertContentExists("heredoc", "stacked heredoc #2\nstacked2\n");
  });
  it("comment", function () {
    testSupport.AssertContentExists("comment", "#single line comment");
  });
  it("comment after heredoc declaration", function () {
    testSupport.AssertContentExists("comment", "# delimiters can be indented");
  });
  it("docComment", function () {
    testSupport.AssertContentExists("docComment", '=begin This is a "comment" that begins with\n=begin and apparently doesn\'t end until\nyou get to a line that starts with =end\n=end this is also ignored by the interpreter');
  });
  it("def keyword", function () {
    testSupport.AssertContentExists("keyword", "def");
  });
  it("if keyword", function () {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("else keyword", function () {
    testSupport.AssertContentExists("keyword", "else");
  });
  it("end keyword", function () {
    testSupport.AssertContentExists("keyword", "end");
  });
  it("not keyword", function () {
    testSupport.AssertContentExists("keyword", "not");
  });
  it("case keyword", function () {
    testSupport.AssertContentExists("keyword", "case");
  });
  it("when keyword", function () {
    testSupport.AssertContentExists("keyword", "when");
  });
  it("begin keyword", function () {
    testSupport.AssertContentExists("keyword", "begin");
  });
  it("rescue keyword", function () {
    testSupport.AssertContentExists("keyword", "rescue");
  });
  it("ensure keyword", function () {
    testSupport.AssertContentExists("keyword", "ensure");
  });
  it("BEGIN keyword", function () {
    testSupport.AssertContentExists("keyword", "BEGIN");
  });
  it("END keyword", function () {
    testSupport.AssertContentExists("keyword", "END");
  });
  it("regex literal", function () {
    testSupport.AssertContentExists("regexLiteral", "/regextest1/");
  });
  it("regex literal with modifiers", function () {
    testSupport.AssertContentExists("regexLiteral", "/regextest2/i");
  });
  it("not a regex literal", function () {
    testSupport.AssertContentExists("ident", "regextest3");
  });
  it("raw regex literal with modifiers", function () {
    testSupport.AssertContentExists("regexLiteral", "%r[regextest4]xm");
  });
  it("raw regex literal", function () {
    testSupport.AssertContentExists("regexLiteral", "%r|regextest5|");
  });
  it("regex literal with escaped backslash and forward slash", function () {
    testSupport.AssertContentExists("regexLiteral", "/\\/\\\\/");
  });
  it("%= operator", function () {
    testSupport.AssertContentExists("operator", "%=");
  });
  it("&& operator", function () {
    testSupport.AssertContentExists("operator", "&&");
  });
  it(".. operator", function () {
    testSupport.AssertContentExists("operator", "..");
  });
  it("defined? operator", function () {
    testSupport.AssertContentExists("specialOperator", "defined?");
  });
  it("eql? operator", function () {
    testSupport.AssertContentExists("specialOperator", "eql?");
  });
  it("equal? operator", function () {
    testSupport.AssertContentExists("specialOperator", "equal?");
  });
  it("function name", function () {
    testSupport.AssertContentExists("named-ident", "factorial");
  });
  it("static variable access", function () {
    testSupport.AssertContentExists("named-ident", "StaticVariableAccess");
  });
  it("extended class name", function () {
    testSupport.AssertContentExists("named-ident", "ExtendedException");
  });
  it("class name before new() invocation", function () {
    testSupport.AssertContentExists("named-ident", "IdentBeforeNew");
  });
  it("user-defined function call", function () {
    testSupport.AssertContentExists("ident", "factorial");
  });
  it("second argument of ternary operator", function () {
    testSupport.AssertContentExists("ident", "not_a_symbol1");
  });
  it("second argument of ternary operator after nested ternary operator", function () {
    testSupport.AssertContentExists("ident", "not_a_symbol2");
  });
  it("symbol as first argument of ternary operator", function () {
    testSupport.AssertContentExists("symbol", ":symbol1");
  });
  it("symbol as first argument of nested ternary operator", function () {
    testSupport.AssertContentExists("symbol", ":symbol2");
  });
  it("symbol as second argument of nested ternary operator", function () {
    testSupport.AssertContentExists("symbol", ":symbol3");
  });
  it("puts function", function () {
    testSupport.AssertContentExists("function", "puts");
  });
  it("chomp function", function () {
    testSupport.AssertContentExists("function", "chomp");
  });
  it("chomp! function", function () {
    testSupport.AssertContentExists("function", "chomp!");
  });
  it("single quoted string", function () {
    testSupport.AssertContentExists("string", "'Hello world!'");
  });
  it("double quoted string", function () {
    testSupport.AssertContentExists("string", '"Hello world!"');
  });
  it("double quoted string", function () {
    testSupport.AssertContentExists("string", '"stringToChomp1"');
  });
  it("double quoted string", function () {
    testSupport.AssertContentExists("string", '"stringToChomp2"');
  });
  it("string after heredocs", function () {
    testSupport.AssertContentExists("string", '"we\'re still good"');
  });
  it("raw string", function () {
    testSupport.AssertContentExists("rawString", "%q(raw string 1)");
  });
  it("raw string", function () {
    testSupport.AssertContentExists("rawString", "%Q[raw string 2]");
  });
  it("raw string", function () {
    testSupport.AssertContentExists("rawString", "%{raw string 3}");
  });
  it("raw string", function () {
    testSupport.AssertContentExists("rawString", "%!raw string\\\\\\! 4!");
  });
  it("subshell command", function () {
    testSupport.AssertContentExists("subshellCommand", "`ls -l`");
  });
  it("integer", function () {
    testSupport.AssertContentExists("number", "10");
  });
  it("float", function () {
    testSupport.AssertContentExists("number", "10.0");
  });
});