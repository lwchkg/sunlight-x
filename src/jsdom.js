// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

// @flow
import { JSDOM } from "jsdom";
export const document: Document = new JSDOM("", {}).window.document;

const defaultView = document.defaultView;

const window: {
  Element: Element,
  HTMLElement: HTMLElement,
  Text: Text
} = {
  Element: defaultView.Element,
  HTMLElement: defaultView.HTMLElement,
  Text: defaultView.Text
};

export { window };
