// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupportForFile } from "../fixtures/testsupport.js";

describe("Bash tests", function() {
  let testSupport: TestSupportForFile;
  beforeAll(function() {
    testSupport = new TestSupportForFile("bash.sh", "bash");
  });
  it("hashbang", function() {
    testSupport.AssertContentExists("hashBang", "#!/bin/bash");
  });

  it("comment", function() {
    testSupport.AssertContentExists("comment", "#this is a comment");
  });
  it("comment", function() {
    testSupport.AssertContentExists("comment", "#exit");
  });

  it("echo command", function() {
    testSupport.AssertContentExists("command", "echo");
  });
  it("cd command", function() {
    testSupport.AssertContentExists("command", "cd");
  });
  it("exit command", function() {
    testSupport.AssertContentExists("command", "exit");
  });
  it("return command", function() {
    testSupport.AssertContentExists("command", "return");
  });
  it("rm command", function() {
    testSupport.AssertContentExists("command", "rm");
  });
  it("let command", function() {
    testSupport.AssertContentExists("command", "let");
  });
  it("read command", function() {
    testSupport.AssertContentExists("command", "read");
  });

  it("for keyword", function() {
    testSupport.AssertContentExists("keyword", "for");
  });
  it("in keyword", function() {
    testSupport.AssertContentExists("keyword", "in");
  });
  it("do keyword", function() {
    testSupport.AssertContentExists("keyword", "do");
  });
  it("done keyword", function() {
    testSupport.AssertContentExists("keyword", "done");
  });
  it("if keyword", function() {
    testSupport.AssertContentExists("keyword", "if");
  });
  it("fi keyword", function() {
    testSupport.AssertContentExists("keyword", "fi");
  });
  it("then keyword", function() {
    testSupport.AssertContentExists("keyword", "then");
  });
  it("while keyword", function() {
    testSupport.AssertContentExists("keyword", "while");
  });
  it("case keyword", function() {
    testSupport.AssertContentExists("keyword", "case");
  });
  it("esac keyword", function() {
    testSupport.AssertContentExists("keyword", "esac");
  });

  it("DIR ident", function() {
    testSupport.AssertContentExists("ident", "DIR");
  });
  it("count ident", function() {
    testSupport.AssertContentExists("ident", "count");
  });
  it("planet ident", function() {
    testSupport.AssertContentExists("ident", "planet");
  });
  it("Mercury ident", function() {
    testSupport.AssertContentExists("ident", "Mercury");
  });
  it("Jupiter ident", function() {
    testSupport.AssertContentExists("ident", "Jupiter");
  });

  it("function", function() {
    testSupport.AssertContentExists("named-ident", "my_function");
  });

  it("!= operator", function() {
    testSupport.AssertContentExists("operator", "!=");
  });
  it(";; operator", function() {
    testSupport.AssertContentExists("operator", ";;");
  });

  it.skip("-rf switch", function() {
    testSupport.AssertContentExists("switch", "-rf");
  });

  it("verbatim command", function() {
    testSupport.AssertContentExists(
      "verbatimCommand",
      "`echo running a command`"
    );
  });

  it("$DIR variable", function() {
    testSupport.AssertContentExists("variable", "$DIR");
  });

  it("$? special variable", function() {
    testSupport.AssertContentExists("specialVariable", "$?");
  });
  it("$# special variable", function() {
    testSupport.AssertContentExists("specialVariable", "$#");
  });

  it("double quoted string", function() {
    testSupport.AssertContentExists("string", '"Starting the script, yo"');
  });
});
