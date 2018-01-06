// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import assert from "assert";
import { djb2Utf8 } from "./fixtures/djb2-utf8.js";
import {
  getOptionsFromString,
  getOptionsFromHash
} from "./fixtures/testsupport.js";

describe("Test of test fixtures", function() {
  describe("djb2 in utf-8", function() {
    it("hashes with value > 0x7fffffff should be positive", function() {
      assert.strictEqual(djb2Utf8("test1234"), 4241607919);
    });
    it("hashes utf-8 representation of the string", function() {
      assert.strictEqual(djb2Utf8("\u4E2D\u6587\u5316"), 2831680472);
    });
  });

  describe("getOptionsFromString", function() {
    it("returns a set of options", function() {
      const s = "test";
      assert.deepEqual(
        getOptionsFromString(s),
        getOptionsFromHash(djb2Utf8(s))
      );
    });
  });

  describe("getOptionsFromHash", function() {
    it("has the correct peroidic behavior", function() {
      const periods = [
        { name: "theme", period: 3 },
        { name: "lineNumbers", period: 2 }
      ];
      const cardinality = periods.length;

      const count = 10000;

      const counts = new Array(cardinality + 1).fill(0, 0, cardinality + 1);
      const expected = [];
      for (let index = 0; index < cardinality; ++index) expected[index] = [];

      for (let hash = 0; hash < count; ++hash) {
        const options = getOptionsFromHash(hash);
        for (let index = 0; index < cardinality; ++index) {
          const actual = options[periods[index].name];
          if (typeof expected[index][counts[index]] === "undefined")
            expected[index][counts[index]] = actual;
          else
            assert.strictEqual(
              actual,
              expected[index][counts[index]],
              `Failed on hash = ${hash}, field ${periods[index].name}`
            );
        }

        counts[0]++;
        for (let index = 0; index < cardinality; ++index) {
          if (counts[index] < periods[index].period) break;
          counts[index] = 0;
          counts[index + 1]++;
        }
      }
    });
  });
});
