// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForFile } from "../fixtures/testsupport";
describe("6502 ASM tests", function () {
  let testSupport: TestSupportForFile;
  beforeAll(function () {
    testSupport = new TestSupportForFile("6502asm.6502asm", "6502asm");
  });
  it("label at beginning of line", function () {
    testSupport.AssertContentExists("label", "MainKernel");
  });
  it("label at beginning of line", function () {
    testSupport.AssertContentExists("label", "KernelLoopOuter");
  });
  it("label after bcs", function () {
    testSupport.AssertContentExists("label", "DoDraw2");
  });
  it("label after beq", function () {
    testSupport.AssertContentExists("label", "NoSpritesKernelMain");
  });
  it("lda keyword", function () {
    testSupport.AssertContentExists("keyword", "lda");
  });
  it("sta keyword", function () {
    testSupport.AssertContentExists("keyword", "sta");
  });
  it("beq keyword", function () {
    testSupport.AssertContentExists("keyword", "beq");
  });
  it("cpy keyword", function () {
    testSupport.AssertContentExists("keyword", "cpy");
  });
  it("bne keyword", function () {
    testSupport.AssertContentExists("keyword", "bne");
  });
  it("nop keyword", function () {
    testSupport.AssertContentExists("keyword", "nop");
  });
  it("ldy keyword", function () {
    testSupport.AssertContentExists("keyword", "ldy");
  });
  it("byte pseudo op", function () {
    testSupport.AssertContentExists("pseudoOp", "byte");
  });
  it("constant", function () {
    testSupport.AssertContentExists("constant", "#MAID_HEIGHT");
  });
  it("constant", function () {
    testSupport.AssertContentExists("constant", "#0");
  });
  it("constant with brackets and whitespace", function () {
    testSupport.AssertContentExists("constant", "#<[3.14 * 100]");
  });
  it("comment", function () {
    testSupport.AssertContentExists("comment", ";+2      72");
  });
  it("ident", function () {
    testSupport.AssertContentExists("ident", "GRP0");
  });
  it("ident", function () {
    testSupport.AssertContentExists("ident", "HeroGfx1Ptrb");
  });
  it("ident", function () {
    testSupport.AssertContentExists("ident", "SLEEP");
  });
  it("dcp illegal opcode", function () {
    testSupport.AssertContentExists("illegalOpcode", "dcp");
  });
  it("hex number", function () {
    testSupport.AssertContentExists("number", "$2C");
  });
  it("integer", function () {
    testSupport.AssertContentExists("number", "3");
  });
});