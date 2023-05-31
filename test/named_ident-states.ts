// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import { TestSupportForCode } from "./fixtures/testsupport";
describe("Named-ident tests", function () {
  it("user defined functions do not persist to the second file", function () {
    const code1 = `add :: Integer -> Integer -> Integer;
add x y = x+y;

a = 4
main = print $ add 4 a`;
    const testSupport1 = new TestSupportForCode(code1, "haskell");
    testSupport1.AssertContentExists("named-ident", "add");
    const code2 = `add = 2;
main = print $ add`;
    const testSupport2 = new TestSupportForCode(code2, "haskell");
    testSupport2.AssertContentExists("ident", "add");
  });
});