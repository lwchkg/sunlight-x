// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
describe("Brainfuck tests", function () {
  let testSupport: TestSupportForFile;
  beforeAll(function () {
    testSupport = new TestSupportForFile("brainfuck.bf", "brainfuck");
  });
  it("increment", function () {
    testSupport.AssertContentExists("increment", ">");
  });
  it("decrement", function () {
    testSupport.AssertContentExists("decrement", "<");
  });
  it("increment pointer", function () {
    testSupport.AssertContentExists("incrementPointer", "+");
  });
  it("decrement pointer", function () {
    testSupport.AssertContentExists("decrementPointer", "-");
  });
  it("read", function () {
    testSupport.AssertContentExists("read", ",");
  });
  it("write", function () {
    testSupport.AssertContentExists("write", ".");
  });
  it("open loop", function () {
    testSupport.AssertContentExists("openLoop", "[");
  });
  it("close loop", function () {
    testSupport.AssertContentExists("closeLoop", "]");
  });
});