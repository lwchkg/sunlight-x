import { document } from "./jsdom";
import type { AnalyzerContext } from "./analyzer-context";
export class Analyzer {
  handlers: Record<string, (arg0: AnalyzerContext) => true>;

  constructor() {
    this.handlers = {};
  }

  static defaultHandleToken(suffix: string): (arg0: AnalyzerContext) => true {
    return function (context: AnalyzerContext): true {
      const element: Element = document.createElement("span");
      element.className = context.options.classPrefix + suffix;
      element.appendChild(context.createTextNode(context.tokens[context.index]));
      context.addNode(element);
      return true;
    };
  }

  handleToken(context: AnalyzerContext): true {
    return Analyzer.defaultHandleToken(context.tokens[context.index].name)(context);
  }

}