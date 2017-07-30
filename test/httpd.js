// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { TestSupport } from "./fixtures/testsupport.js";

describe("Apache httpd config tests", function() {
  let testSupport: TestSupport;
  beforeAll(function() {
    testSupport = new TestSupport("httpd.httpdconf", "httpd");
  });
  it("comment", function() {
    testSupport.AssertContentExists("comment", "#LockFile logs/accept.lock");
  });
  it("comment", function() {
    testSupport.AssertContentExists("comment", "#1.3 legacy style");
  });

  it("ServerType keyword", function() {
    testSupport.AssertContentExists("keyword", "ServerType");
  });
  it("Timeout keyword (case insensitive)", function() {
    testSupport.AssertContentExists("keyword", "Timeout");
  });
  it("Listen keyword", function() {
    testSupport.AssertContentExists("keyword", "Listen");
  });
  it("MaxClients keyword", function() {
    testSupport.AssertContentExists("keyword", "MaxClients");
  });
  it("RewriteEngine keyword", function() {
    testSupport.AssertContentExists("keyword", "RewriteEngine");
  });
  it("RewriteRule keyword", function() {
    testSupport.AssertContentExists("keyword", "RewriteRule");
  });
  it("Options keyword", function() {
    testSupport.AssertContentExists("keyword", "Options");
  });
  it("AllowOverride keyword", function() {
    testSupport.AssertContentExists("keyword", "AllowOverride");
  });
  it("LogFormat keyword", function() {
    testSupport.AssertContentExists("keyword", "LogFormat");
  });
  it("AddIcon keyword", function() {
    testSupport.AssertContentExists("keyword", "AddIcon");
  });
  it("AddIconByType keyword", function() {
    testSupport.AssertContentExists("keyword", "AddIconByType");
  });
  it("AddIconByEncoding keyword", function() {
    testSupport.AssertContentExists("keyword", "AddIconByEncoding");
  });
  it("NameVirtualHost keyword", function() {
    testSupport.AssertContentExists("keyword", "NameVirtualHost");
  });
  it("NameVirtualHost keyword", function() {
    testSupport.AssertContentExists("keyword", "DocumentRoot");
  });
  it("ServerName keyword", function() {
    testSupport.AssertContentExists("keyword", "ServerName");
  });
  it("ServerAlias keyword", function() {
    testSupport.AssertContentExists("keyword", "ServerAlias");
  });

  it("keyword out of context", function() {
    testSupport.AssertContentExists("ident", "RewriteRule");
  });
  it("directive value", function() {
    testSupport.AssertContentExists("ident", "None");
  });
  it("directive value", function() {
    testSupport.AssertContentExists("ident", "Deny");
  });
  it("directive value", function() {
    testSupport.AssertContentExists("ident", "Allow");
  });

  it("legacy context", function() {
    testSupport.AssertContentExists("context", "IfDefine");
  });
  it("IfModule context", function() {
    testSupport.AssertContentExists("context", "IfModule");
  });
  it("Directory context", function() {
    testSupport.AssertContentExists("context", "Directory");
  });
  it("Limit context", function() {
    testSupport.AssertContentExists("context", "Limit");
  });
  it("Files context", function() {
    testSupport.AssertContentExists("context", "Files");
  });
  it("Files context", function() {
    testSupport.AssertContentExists("context", "VirtualHost");
  });

  it("regex literal as 2nd argument to RewriteCond", function() {
    testSupport.AssertContentExists("regexLiteral", "^Mozilla");
  });
  it("regex literal after RewriteRule", function() {
    testSupport.AssertContentExists("regexLiteral", "^/ex/(.*)");
  });

  it("string", function() {
    testSupport.AssertContentExists("string", '"/var/www"');
  });
  it("string inside <>", function() {
    testSupport.AssertContentExists("string", '"/var/www/htdocs"');
  });

  it("integer", function() {
    testSupport.AssertContentExists("number", "8080");
  });
  it("float", function() {
    testSupport.AssertContentExists("number", "12.34");
  });

  it("< operator", function() {
    testSupport.AssertContentExists("operator", "<");
  });
  it("> operator", function() {
    testSupport.AssertContentExists("operator", ">");
  });
  it("</ operator", function() {
    testSupport.AssertContentExists("operator", "</");
  });

  it("variable prepended by %", function() {
    testSupport.AssertContentExists(
      "environmentVariable",
      "%{HTTP_USER_AGENT}"
    );
  });
  it("variable prepended by $", function() {
    testSupport.AssertContentExists("environmentVariable", "${examplemap:$1}");
  });
});
