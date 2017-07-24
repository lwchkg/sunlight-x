// @flow
import { jsdom } from "jsdom";
export { jsdom };
export const document: Document = jsdom("", {});

const window = document.defaultView;

const element: Element = window.Element;
const htmlElement: HTMLElement = window.HTMLElement;
const text: Text = window.Text;

export { element as Element, htmlElement as HTMLElement, text as Text };
