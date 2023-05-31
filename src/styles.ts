// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
import * as fs from "fs";
import * as path from "path";

/**
 * Synchonorusly returns the CSS stylesheet for the highlighter.
 * @returns {string}
 */
export function getCSSSync(): string {
  const file = path.join(__dirname, "..", "compiled-assets", "sunlight-defaultfont.css");
  return fs.readFileSync(file, "utf8");
}