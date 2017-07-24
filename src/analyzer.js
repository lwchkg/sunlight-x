// @flow
import { document } from "./jsdom.js";

import type { AnalyzerContext } from "./analyzer-context.js";

export class Analyzer {
  handlers: { [string]: (AnalyzerContext) => true };
  constructor() {
    this.handlers = {};
  }

  static defaultHandleToken(suffix: string): * {
    return function(context: AnalyzerContext): true {
      const element: Element = document.createElement("span");
      element.className = context.options.classPrefix + suffix;
      element.appendChild(
        context.createTextNode(context.tokens[context.index])
      );
      context.addNode(element);
      return true;
    };
  }

  handleToken(context: AnalyzerContext): true {
    return Analyzer.defaultHandleToken(context.tokens[context.index].name)(
      context
    );
  }
}
