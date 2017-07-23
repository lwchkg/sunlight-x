// @flow
import { jsdom } from "jsdom";
export { jsdom };
export const document = jsdom("", {});

const window = document.defaultView;

const Element = window.Element;
const HTMLElement = window.HTMLElement;
const Text = window.Text;

export { Element, HTMLElement, Text };
