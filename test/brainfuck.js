import { TestSupport } from "./fixtures/testsupport.js";

let testSupport;
describe("Brainfuck tests", function() {
  before(function() {
    testSupport = new TestSupport("brainfuck.bf", "brainfuck");
  });

  it("increment", function() {
    testSupport.AssertContentExists("increment", ">");
  });
  it("decrement", function() {
    testSupport.AssertContentExists("decrement", "<");
  });
  it("increment pointer", function() {
    testSupport.AssertContentExists("incrementPointer", "+");
  });
  it("decrement pointer", function() {
    testSupport.AssertContentExists("decrementPointer", "-");
  });
  it("read", function() {
    testSupport.AssertContentExists("read", ",");
  });
  it("write", function() {
    testSupport.AssertContentExists("write", ".");
  });
  it("open loop", function() {
    testSupport.AssertContentExists("openLoop", "[");
  });
  it("close loop", function() {
    testSupport.AssertContentExists("closeLoop", "]");
  });
});
