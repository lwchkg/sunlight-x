// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import * as util from "../util.js";

export const name = "sln";

export const keywords = [
  "Project",
  "EndProject",
  "GlobalSection",
  "Global",
  "EndGlobalSection",
  "EndGlobal"
];

export const customTokens = {
  sectionName: {
    values: ["preSolution", "postSolution"],
    boundary: "\\b"
  }
};

export const scopes = {
  string: [['"', '"', ['\\"', "\\\\"], false]],
  comment: [["#", "\n", [], true]],
  guid: [["{", "}", [], false]],
  formatDeclaration: [
    ["Microsoft Visual Studio Solution File, Format Version", "\n", [], true]
  ]
};

export const identFirstLetter = /[A-Za-z_.]/;
export const identAfterFirstLetter = /[\w-.]/;

export const namedIdentRules = {
  follows: [
    [
      { token: "keyword", values: ["GlobalSection"] },
      util.whitespace,
      { token: "punctuation", values: ["("] },
      util.whitespace
    ]
  ]
};

export const operators = ["=", "|"];
