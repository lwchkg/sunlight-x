// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
describe("nginx config tests", function () {
  let testSupport: TestSupportForFile;
  beforeAll(function () {
    testSupport = new TestSupportForFile("nginx.nginxconf", "nginx");
  });
  it("comment", function () {
    testSupport.AssertContentExists("comment", "#nginx test");
  });
  it("http context", function () {
    testSupport.AssertContentExists("context", "http");
  });
  it("location context", function () {
    testSupport.AssertContentExists("context", "location");
  });
  it("server context", function () {
    testSupport.AssertContentExists("context", "server");
  });
  it("upstream context", function () {
    testSupport.AssertContentExists("context", "upstream");
  });
  it("map context", function () {
    testSupport.AssertContentExists("context", "map");
  });
  it("geo context", function () {
    testSupport.AssertContentExists("context", "geo");
  });
  it("split-clients context", function () {
    testSupport.AssertContentExists("context", "split-clients");
  });
  it("mail context", function () {
    testSupport.AssertContentExists("context", "mail");
  });
  it("types context", function () {
    testSupport.AssertContentExists("context", "types");
  });
  it("limit_except context", function () {
    testSupport.AssertContentExists("context", "limit_except");
  });
  it("ssi command", function () {
    testSupport.AssertContentExists("ssiCommand", '<!--# echo var="name" default="no" -->');
  });
  it("$geo variable", function () {
    testSupport.AssertContentExists("variable", "$geo");
  });
  it("$variant variable", function () {
    testSupport.AssertContentExists("variable", "$variant");
  });
  it("$secure_link variable", function () {
    testSupport.AssertContentExists("variable", "$secure_link");
  });
  it("server keyword", function () {
    testSupport.AssertContentExists("keyword", "server");
  });
  it("default keyword", function () {
    testSupport.AssertContentExists("keyword", "default");
  });
  it("listen keyword", function () {
    testSupport.AssertContentExists("keyword", "listen");
  });
  it("server_name keyword", function () {
    testSupport.AssertContentExists("keyword", "server_name");
  });
  it("root keyword", function () {
    testSupport.AssertContentExists("keyword", "root");
  });
  it("ssl keyword", function () {
    testSupport.AssertContentExists("keyword", "ssl");
  });
  it("ssl_certificate_key keyword", function () {
    testSupport.AssertContentExists("keyword", "ssl_certificate_key");
  });
  it("allow keyword", function () {
    testSupport.AssertContentExists("keyword", "allow");
  });
  it("internal keyword", function () {
    testSupport.AssertContentExists("keyword", "internal");
  });
  it("imap_capabilities keyword", function () {
    testSupport.AssertContentExists("keyword", "imap_capabilities");
  });
  it("echo keyword", function () {
    testSupport.AssertContentExists("keyword", "echo");
  });
  it("echo_after_body keyword", function () {
    testSupport.AssertContentExists("keyword", "echo_after_body");
  });
  it("default_type keyword", function () {
    testSupport.AssertContentExists("keyword", "default_type");
  });
  it("non-contextual keyword default", function () {
    testSupport.AssertContentExists("ident", "default");
  });
  it("non-contextual keyword server_name", function () {
    testSupport.AssertContentExists("ident", "server_name");
  });
  it("non-contextual keyword index", function () {
    testSupport.AssertContentExists("ident", "index");
  });
  it("directive value", function () {
    testSupport.AssertContentExists("ident", "all");
  });
  it("directive value", function () {
    testSupport.AssertContentExists("ident", "on");
  });
  it("limit_except name", function () {
    testSupport.AssertContentExists("ident", "GET");
  });
  it("label", function () {
    testSupport.AssertContentExists("label", "@fallback");
  });
  it("integer", function () {
    testSupport.AssertContentExists("number", "404");
  });
  it("float", function () {
    testSupport.AssertContentExists("number", "0.5");
  });
  it("1000m", function () {
    testSupport.AssertContentExists("number", "1000m");
  });
  it("4k", function () {
    testSupport.AssertContentExists("number", "4k");
  });
  it("regex literal after location ~*", function () {
    testSupport.AssertContentExists("regexLiteral", "\\.(gif|jpg|jpeg)$");
  });
  it("regex literal after location ^~", function () {
    testSupport.AssertContentExists("regexLiteral", "/images/");
  });
  it("regex literal after server_name ~", function () {
    testSupport.AssertContentExists("regexLiteral", "~^(www\\.)?(?P<domain>.+)$");
  });
  it("regex literal after location ~", function () {
    testSupport.AssertContentExists("regexLiteral", "^/download/(.*)$");
  });
  it(":: operator", function () {
    testSupport.AssertContentExists("operator", "::");
  });
  it("~* operator", function () {
    testSupport.AssertContentExists("operator", "~*");
  });
  it("~ operator", function () {
    testSupport.AssertContentExists("operator", "~");
  });
  it("^~ operator", function () {
    testSupport.AssertContentExists("operator", "^~");
  });
  it("; punctuation", function () {
    testSupport.AssertContentExists("punctuation", ";");
  });
  it("{ punctuation", function () {
    testSupport.AssertContentExists("punctuation", "{");
  });
  it("} punctuation", function () {
    testSupport.AssertContentExists("punctuation", "}");
  });
  it("double quoted string", function () {
    testSupport.AssertContentExists("string", '"MSIE [1-6]\\."');
  });
  it("single quoted string", function () {
    testSupport.AssertContentExists("string", "'${remote-addr}AAA'");
  });
});