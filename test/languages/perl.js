// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "../fixtures/testsupport.js";

describe("Perl tests", function() {
  let testSupport: TestSupportForFile;
  beforeAll(function() {
    testSupport = new TestSupportForFile("perl.pl", "perl");
  });
  it("comment", function() {
    testSupport.AssertContentExists("comment", "#!/usr/bin/perl");
  });

  it("use keyword", function() {
    testSupport.AssertContentExists("keyword", "use");
  });
  it("my keyword", function() {
    testSupport.AssertContentExists("keyword", "my");
  });
  it("exit keyword", function() {
    testSupport.AssertContentExists("keyword", "exit");
  });
  it("local keyword", function() {
    testSupport.AssertContentExists("keyword", "local");
  });
  it("die keyword", function() {
    testSupport.AssertContentExists("keyword", "die");
  });
  it("or keyword", function() {
    testSupport.AssertContentExists("keyword", "or");
  });
  it("sub keyword", function() {
    testSupport.AssertContentExists("keyword", "sub");
  });
  it("given keyword", function() {
    testSupport.AssertContentExists("keyword", "given");
  });
  it("when keyword", function() {
    testSupport.AssertContentExists("keyword", "when");
  });
  it("default keyword", function() {
    testSupport.AssertContentExists("keyword", "default");
  });
  it("if keyword", function() {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("elsif keyword", function() {
    testSupport.AssertContentExists("keyword", "elsif");
  });
  it("else keyword", function() {
    testSupport.AssertContentExists("keyword", "else");
  });
  it("until keyword", function() {
    testSupport.AssertContentExists("keyword", "until");
  });
  it("foreach keyword", function() {
    testSupport.AssertContentExists("keyword", "foreach");
  });

  it("print function", function() {
    testSupport.AssertContentExists("function", "print");
  });
  it("open function", function() {
    testSupport.AssertContentExists("function", "open");
  });
  it("close function", function() {
    testSupport.AssertContentExists("function", "close");
  });
  it("eval function", function() {
    testSupport.AssertContentExists("function", "eval");
  });
  it("keys function", function() {
    testSupport.AssertContentExists("function", "keys");
  });
  it("values function", function() {
    testSupport.AssertContentExists("function", "values");
  });
  it("undef function", function() {
    testSupport.AssertContentExists("function", "undef");
  });
  it("say function", function() {
    testSupport.AssertContentExists("function", "say");
  });
  it("say function", function() {
    testSupport.AssertContentExists("function", "reset");
  });
  it("say function", function() {
    testSupport.AssertContentExists("function", "eof");
  });

  it("variable prepended by $", function() {
    testSupport.AssertContentExists("variable", "$animal");
  });
  it("variable prepended by $", function() {
    testSupport.AssertContentExists("variable", "$content");
  });
  it("variable prepended by $", function() {
    testSupport.AssertContentExists("variable", "$fh");
  });
  it("variable prepended by $", function() {
    testSupport.AssertContentExists("variable", "$sig");
  });
  it("variable prepended by @", function() {
    testSupport.AssertContentExists("variable", "@mixed");
  });
  it("variable prepended by @", function() {
    testSupport.AssertContentExists("variable", "@animals");
  });
  it("variable prepended by $#", function() {
    testSupport.AssertContentExists("variable", "$#mixed");
  });
  it("variable prepended by $#", function() {
    testSupport.AssertContentExists("variable", "$#animals");
  });
  it("variable prepended by %", function() {
    testSupport.AssertContentExists("variable", "%fruit_color");
  });

  it("special variable $!", function() {
    testSupport.AssertContentExists("specialVariable", "$!");
  });
  it("special variable @_", function() {
    testSupport.AssertContentExists("specialVariable", "@_");
  });
  it("special variable $_", function() {
    testSupport.AssertContentExists("specialVariable", "$_");
  });
  it("special variable $SIG", function() {
    testSupport.AssertContentExists("specialVariable", "$SIG");
  });

  it("subroutine name after \\&", function() {
    testSupport.AssertContentExists(
      "named-ident",
      "referenceOrSomethingIGuess"
    );
  });
  it("subroutine name", function() {
    testSupport.AssertContentExists("named-ident", "handler");
  });

  it("LOG ident", function() {
    testSupport.AssertContentExists("ident", "LOG");
  });
  it("apple ident", function() {
    testSupport.AssertContentExists("ident", "apple");
  });

  it("integer", function() {
    testSupport.AssertContentExists("number", "42");
  });
  it("float", function() {
    testSupport.AssertContentExists("number", "101.23");
  });

  it("double quoted string with escapes", function() {
    testSupport.AssertContentExists("string", '"Hello \\"world\\\\\\""');
  });
  it("single quoted string with escapes", function() {
    testSupport.AssertContentExists("string", "'Hello \\'world\\\\\\'s best'");
  });
  it("double quoted string", function() {
    testSupport.AssertContentExists("string", '"camel"');
  });
  it("empty single quoted string", function() {
    testSupport.AssertContentExists("string", "''");
  });

  it("raw q string with nested () delimiters", function() {
    testSupport.AssertContentExists(
      "rawString",
      "q(I don't know what to do (with) $foo)"
    );
  });

  it("semicolon", function() {
    testSupport.AssertContentExists("punctuation", ";");
  });

  it("\\& operator", function() {
    testSupport.AssertContentExists("operator", "\\&");
  });
  it(".. operator", function() {
    testSupport.AssertContentExists("operator", "..");
  });
  it("=> operator", function() {
    testSupport.AssertContentExists("operator", "=>");
  });
  it("=~ operator", function() {
    testSupport.AssertContentExists("operator", "=~");
  });

  it("pod", function() {
    testSupport.AssertContentExists(
      "docComment",
      "=pod\n=head1 Heading Text\n=cut this should not be parsed"
    );
  });

  it("default heredoc declaration", function() {
    testSupport.AssertContentExists("heredocDeclaration", "<<HEREDOC");
  });
  it("double quoted heredoc declaration", function() {
    testSupport.AssertContentExists("heredocDeclaration", '<<"QUOTEDHEREDOC"');
  });
  it("back quoted heredoc declaration", function() {
    testSupport.AssertContentExists(
      "heredocDeclaration",
      "<<`BACKQUOTEDHEREDOC`"
    );
  });
  it("single quoted heredoc declaration", function() {
    testSupport.AssertContentExists(
      "heredocDeclaration",
      "<<'SINGLEQUOTEDHEREDOC'"
    );
  });
  it("stacked heredoc declaration", function() {
    testSupport.AssertContentExists("heredocDeclaration", '<<"stacked1"');
  });
  it("stacked heredoc declaration", function() {
    testSupport.AssertContentExists("heredocDeclaration", '<<"stacked2"');
  });

  it("default heredoc body", function() {
    testSupport.AssertContentExists(
      "heredoc",
      "Default heredoc body\nHEREDOC\n"
    );
  });
  it("double quoted heredoc body", function() {
    testSupport.AssertContentExists(
      "heredoc",
      "Quoted heredoc body\nQUOTEDHEREDOC\n"
    );
  });
  it("back quoted heredoc body", function() {
    testSupport.AssertContentExists(
      "heredoc",
      "echo back quoted heredoc body\nBACKQUOTEDHEREDOC\n"
    );
  });
  it("single quoted heredoc body", function() {
    testSupport.AssertContentExists(
      "heredoc",
      "single quoted heredoc body\nSINGLEQUOTEDHEREDOC\n"
    );
  });
  it("stacked heredoc body", function() {
    testSupport.AssertContentExists(
      "heredoc",
      "stacked heredoc #1\nstacked1\n"
    );
  });
  it("stacked heredoc body", function() {
    testSupport.AssertContentExists(
      "heredoc",
      "stacked heredoc #2\nstacked2\n"
    );
  });

  it("regex literal delimited by ?", function() {
    testSupport.AssertContentExists("regexLiteral", "?^$?");
  });
  it("empty regex literal //", function() {
    testSupport.AssertContentExists("regexLiteral", "//");
  });
  it("empty regex literal ??", function() {
    testSupport.AssertContentExists("regexLiteral", "??");
  });
  it("regex literal prepended by qr with no modifiers", function() {
    testSupport.AssertContentExists("regexLiteral", "qr/$pattern/");
  });
  it("regex literal delimited by / with no modifiers", function() {
    testSupport.AssertContentExists("regexLiteral", "/$re/");
  });
  it("regex literal prepended by s delimited by / with modifiers", function() {
    testSupport.AssertContentExists("regexLiteral", "s/Mister\\b/Mr./g");
  });
  it("regex literal prepended by s delimited by { and [ with modifiers", function() {
    testSupport.AssertContentExists(
      "regexLiteral",
      "s {\n\t/\\* # Match the opening delimiter.\n\t.*? # Match a minimal number of characters.\n\t\\*/ # Match the closing delimiter.\n} []gsx"
    );
  });
  it("regex literal prepended by y delimited by / with modifiers", function() {
    testSupport.AssertContentExists("regexLiteral", "y/i/hate/perl");
  });
  it("regex literal prepended by tr delimited by [ with whitespace", function() {
    testSupport.AssertContentExists(
      "regexLiteral",
      "tr [\\200-\\377]\n\t[\\000-\\177]"
    );
  });
  it("regex literal prepended by tr delimited by / with no modifiers", function() {
    testSupport.AssertContentExists("regexLiteral", "tr/A-Z/a-z/");
  });
  it("regex literal prepended by tr delimited by / with no modifiers and empty replacement", function() {
    testSupport.AssertContentExists("regexLiteral", "tr/0-9//");
  });
});
