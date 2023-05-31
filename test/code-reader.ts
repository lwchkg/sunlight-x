// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017-18 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import assert from "assert";
import { CodeReader } from "../src/code-reader";
describe("Tests of CodeReader", function () {
  const code = "Line 1\nLine Two\nLine 3";
  describe("Tests of CodeReader's methods", function () {
    it("constructs correctly", function () {
      const reader = new CodeReader(code);
      assert.strictEqual(reader.index, 0);
      assert.strictEqual(reader.length, code.length);
      assert.strictEqual(reader.text, code);
    });
    it("read() returns data and advances index", function () {
      const reader = new CodeReader(code);
      assert.strictEqual(reader.index, 0);
      assert.strictEqual(reader.read(), "L");
      assert.strictEqual(reader.index, 1);
      assert.strictEqual(reader.read(5), "ine 1");
      assert.strictEqual(reader.index, 6);
      assert.strictEqual(reader.read(10), "\nLine Two\n");
      assert.strictEqual(reader.index, 16);
      assert.strictEqual(reader.read(10), "Line 3");
      assert.strictEqual(reader.index, 22);
    });
    it("peek() returns data but do not advance index", function () {
      const reader = new CodeReader(code);
      reader.index = 6;
      assert.strictEqual(reader.peek(), "\n");
      assert.strictEqual(reader.index, 6);
      assert.strictEqual(reader.peek(10), "\nLine Two\n");
      assert.strictEqual(reader.index, 6);
    });
    it("peekWithOffset() returns data with offset", function () {
      const reader = new CodeReader(code);
      reader.index = 6;
      assert.strictEqual(reader.peekWithOffset(0, 1), "\n");
      assert.strictEqual(reader.index, 6);
      assert.strictEqual(reader.peekWithOffset(1, 5), "Line ");
      assert.strictEqual(reader.index, 6);
      // The end is past EOF, so read as many characters as possible.
      assert.strictEqual(reader.peekWithOffset(10, 10), "Line 3");
      assert.strictEqual(reader.index, 6);
      // The start is past EOF, return "".
      assert.strictEqual(reader.peekWithOffset(20, 10), "");
      assert.strictEqual(reader.index, 6);
      // The start is before index 0, return (length + index) characters.
      assert.strictEqual(reader.peekWithOffset(-10, 10), "Line 1");
      assert.strictEqual(reader.index, 6);
      // (start + length) < 0, return "".
      assert.strictEqual(reader.peekWithOffset(-20, 10), "");
      assert.strictEqual(reader.index, 6);
    });
    it("peekToEOF() peeks to end of file", function () {
      const reader = new CodeReader(code);
      assert.strictEqual(reader.index, 0);
      assert.strictEqual(reader.peekToEOF(), code);
      assert.strictEqual(reader.index, 0);
      reader.index = 6;
      assert.strictEqual(reader.peekToEOF(), "\nLine Two\nLine 3");
      assert.strictEqual(reader.index, 6);
    });
    it("peekToEndOfLine() peeks to end of line", function () {
      const reader = new CodeReader(code);
      assert.strictEqual(reader.index, 0);
      assert.strictEqual(reader.peekToEndOfLine(), "Line 1");
      assert.strictEqual(reader.index, 0);
      reader.index = 6;
      assert.strictEqual(reader.peekToEndOfLine(), "");
      assert.strictEqual(reader.index, 6);
      reader.index = 10;
      assert.strictEqual(reader.peekToEndOfLine(), "e Two");
      assert.strictEqual(reader.index, 10);
    });
    it("isEOF() returns if index is at EOF", function () {
      const reader = new CodeReader(code);
      assert.strictEqual(reader.isEOF(), false);
      assert.strictEqual(reader.index, 0);
      reader.read(16);
      assert.strictEqual(reader.isEOF(), false);
      assert.strictEqual(reader.index, 16);
      reader.read(10);
      assert.strictEqual(reader.isEOF(), true);
      assert.strictEqual(reader.index, 22);
      reader.index = 16;
      reader.read(6);
      assert.strictEqual(reader.isEOF(), true);
      assert.strictEqual(reader.index, 22);
      // Test for off-by-one error.
      reader.index = 16;
      reader.read(5);
      assert.strictEqual(reader.isEOF(), false);
      assert.strictEqual(reader.index, 21);
    });
    it("isStartOfLine() returns if index is at start of line", function () {
      const reader = new CodeReader(code);
      assert.strictEqual(reader.isStartOfLine(), true);
      assert.strictEqual(reader.index, 0);
      reader.read(6);
      assert.strictEqual(reader.isStartOfLine(), false);
      assert.strictEqual(reader.index, 6);
      reader.read(10);
      assert.strictEqual(reader.isStartOfLine(), true);
      assert.strictEqual(reader.index, 16);
      reader.read(10);
      assert.strictEqual(reader.isStartOfLine(), false);
      assert.strictEqual(reader.index, 22);
    });
    it("isPrecededByWhitespaceOnly() returns if current char is not preceded by a non-whitespace char in the line", function () {
      const reader = new CodeReader(" Line 1\n   Line 2");
      assert.strictEqual(reader.index, 0);
      assert.strictEqual(reader.isPrecededByWhitespaceOnly(), true);
      reader.read();
      assert.strictEqual(reader.isPrecededByWhitespaceOnly(), true);
      assert.strictEqual(reader.index, 1);
      reader.read();
      assert.strictEqual(reader.isPrecededByWhitespaceOnly(), false);
      assert.strictEqual(reader.index, 2);
      reader.index = 8;
      assert.strictEqual(reader.isPrecededByWhitespaceOnly(), true);
      reader.index = 11;
      assert.strictEqual(reader.isPrecededByWhitespaceOnly(), true);
      reader.index = 12;
      assert.strictEqual(reader.isPrecededByWhitespaceOnly(), false);
    });
    it("isStartOfLine() and isPrecededByWhitespaceOnly performs correctly at EOF.", function () {
      let reader = new CodeReader(code + "\n");
      reader.read(30);
      // isStartOfLine returns false at EOF even if after a \n.
      assert.strictEqual(reader.isStartOfLine(), false);
      assert.strictEqual(reader.index, 23);
      // isPrecededByWhitespaceOnly returns false at EOF after \n.
      assert.strictEqual(reader.isPrecededByWhitespaceOnly(), false);
      assert.strictEqual(reader.index, 23);
      reader = new CodeReader(code + "\n ");
      reader.read(30);
      assert.strictEqual(reader.isStartOfLine(), false);
      assert.strictEqual(reader.index, 24);
      // isPrecededByWhitespaceOnly returns true at EOF after a whitespace.
      assert.strictEqual(reader.isPrecededByWhitespaceOnly(), true);
      assert.strictEqual(reader.index, 24);
    });
    it("match() returns if the current chars are given in the argument", function () {
      const reader = new CodeReader(code);
      assert.strictEqual(reader.index, 0);
      assert.strictEqual(reader.match("L"), true);
      assert.strictEqual(reader.match("Line 1"), true);
      assert.strictEqual(reader.match("Line1"), false);
      reader.index = 10;
      assert.strictEqual(reader.match("e"), true);
      assert.strictEqual(reader.match("e T"), true);
      assert.strictEqual(reader.match("T"), false);
    });
  });
  describe("Tests about line breaks", function () {
    it("Converts \\r\\n into \\n", function () {
      const reader = new CodeReader(code.replace("\n", "\r\n"));
      assert.strictEqual(reader.length, code.length);
      assert.strictEqual(reader.text, code);
    });
    it("Converts \\r into \\n", function () {
      const reader = new CodeReader(code.replace("\n", "\r"));
      assert.strictEqual(reader.length, code.length);
      assert.strictEqual(reader.text, code);
    });
  });
});