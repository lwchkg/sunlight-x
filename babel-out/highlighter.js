'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Highlighter = undefined;

var _util = require('./util.js');

var util = _interopRequireWildcard(_util);

var _constants = require('./constants.js');

var _globals = require('./globals.js');

var _codeReader = require('./code-reader.js');

var _parseNextToken = require('./parse-next-token.js');

var _jsdom = require('jsdom');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var document = (0, _jsdom.jsdom)('', {});

var HIGHLIGHTED_NODE_COUNT = 0;

function appendAll(parent, children) {
  var i = void 0;
  for (i = 0; i < children.length; i++) {
    parent.appendChild(children[i]);
  }
}

function fireEvent(eventName, highlighter, eventContext) {
  var delegates = _constants.events[eventName] || [];

  for (var i = 0; i < delegates.length; i++) {
    delegates[i].call(highlighter, eventContext);
  }
}

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/
class Highlighter {
  constructor(options) {
    this.options = util.merge(util.clone(_constants.globalOptions), options);
  }

  // called before processing the current
  switchToEmbeddedLanguageIfNecessary(context) {
    var i = void 0,
        embeddedLanguage = void 0;

    for (i = 0; i < context.language.embeddedLanguages.length; i++) {
      if (!_globals.languages[context.language.embeddedLanguages[i].language]) {
        // unregistered language
        continue;
      }

      embeddedLanguage = util.clone(context.language.embeddedLanguages[i]);

      if (embeddedLanguage.switchTo(context)) {
        embeddedLanguage.oldItems = util.clone(context.items);
        context.embeddedLanguageStack.push(embeddedLanguage);
        context.language = _globals.languages[embeddedLanguage.language];
        context.items = util.merge(context.items, util.clone(context.language.contextItems));
        break;
      }
    }
  }

  // called after processing the current
  switchBackFromEmbeddedLanguageIfNecessary(context) {
    var current = util.last(context.embeddedLanguageStack);

    if (current && current.switchBack(context)) {
      context.language = _globals.languages[current.parentLanguage];
      var lang = context.embeddedLanguageStack.pop();

      // restore old items
      context.items = util.clone(lang.oldItems);
      lang.oldItems = {};
    }
  }

  tokenize(unhighlightedCode, language, partialContext, options) {
    var tokens = [],
        continuation = void 0,
        token = void 0;

    fireEvent('beforeTokenize', this, {
      code: unhighlightedCode,
      language: language
    });

    var context = {
      reader: (0, _codeReader.createCodeReader)(unhighlightedCode),
      language: language,
      items: util.clone(language.contextItems),
      token: function token(index) {
        return tokens[index];
      },
      getAllTokens: function getAllTokens() {
        return tokens.slice(0);
      },
      count: function count() {
        return tokens.length;
      },
      options: options,
      embeddedLanguageStack: [],

      defaultData: {
        text: '',
        line: 1,
        column: 1
      },
      createToken: function createToken(name, value, line, column) {
        return {
          name: name,
          line: line,
          value: _constants.isIe ? value.replace(/\n/g, '\r') : value,
          column: column,
          language: this.language.name
        };
      }
    };

    // if continuation is given, then we need to pick up where we left off from a previous parse
    // basically it indicates that a scope was never closed, so we need to continue that scope
    if (partialContext.continuation) {
      continuation = partialContext.continuation;
      partialContext.continuation = null;
      tokens.push(continuation(context, continuation, '', context.reader.getLine(), context.reader.getColumn(), true));
    }

    while (!context.reader.isEof()) {
      this.switchToEmbeddedLanguageIfNecessary(context);
      token = (0, _parseNextToken.parseNextToken)(context);

      // flush default data if needed (in pretty much all languages this is just whitespace)
      if (token !== null) {
        if (context.defaultData.text !== '') {
          tokens.push(context.createToken('default', context.defaultData.text, context.defaultData.line, context.defaultData.column));
          context.defaultData.text = '';
        }

        if (token[0] !== undefined) {
          // multiple tokens
          tokens = tokens.concat(token);
        } else {
          // single token
          tokens.push(token);
        }
      }

      this.switchBackFromEmbeddedLanguageIfNecessary(context);
      context.reader.read();
    }

    // append the last default token, if necessary
    if (context.defaultData.text !== '') {
      tokens.push(context.createToken('default', context.defaultData.text, context.defaultData.line, context.defaultData.column));
    }

    fireEvent('afterTokenize', this, {
      code: unhighlightedCode,
      parserContext: context
    });
    return context;
  }

  createAnalyzerContext(parserContext, partialContext, options) {
    var nodes = [];
    var prepareText = function () {
      var nbsp = void 0,
          tab = void 0;
      if (options.showWhitespace) {
        nbsp = '\u00b7';
        tab = new Array(options.tabWidth).join('\u2014') + '\u2192';
      } else {
        nbsp = '\u00a0';
        tab = new Array(options.tabWidth + 1).join(nbsp);
      }

      return function (token) {
        var value = token.value.split(' ').join(nbsp),
            tabIndex = void 0,
            lastNewlineColumn = void 0,
            actualColumn = void 0,
            tabLength = void 0;

        // tabstop madness: replace \t with the appropriate number of characters, depending on the tabWidth option and its relative position in the line
        while ((tabIndex = value.indexOf('\t')) >= 0) {
          lastNewlineColumn = value.lastIndexOf(_constants.EOL, tabIndex);
          actualColumn = lastNewlineColumn === -1 ? tabIndex : tabIndex - lastNewlineColumn - 1;
          tabLength = options.tabWidth - actualColumn % options.tabWidth; // actual length of the TAB character

          value = value.substring(0, tabIndex) + tab.substring(options.tabWidth - tabLength) + value.substring(tabIndex + 1);
        }

        return value;
      };
    }();

    return {
      tokens: (partialContext.tokens || []).concat(parserContext.getAllTokens()),
      index: partialContext.index ? partialContext.index + 1 : 0,
      language: null,
      getAnalyzer: _constants.EMPTY,
      options: options,
      continuation: parserContext.continuation,
      addNode: function addNode(node) {
        nodes.push(node);
      },
      createTextNode: function createTextNode(token) {
        return document.createTextNode(prepareText(token));
      },
      getNodes: function getNodes() {
        return nodes;
      },
      resetNodes: function resetNodes() {
        nodes = [];
      },
      items: parserContext.items
    };
  }

  createContainer(ctx) {
    var container = document.createElement('span');
    container.className = ctx.options.classPrefix + ctx.language.name;
    return container;
  }

  analyze(analyzerContext, startIndex) {
    var nodes = void 0,
        container = void 0,
        i = void 0,
        tokenName = void 0,
        func = void 0,
        language = void 0,
        analyzer = void 0;
    // TODO: let lastIndex;

    fireEvent('beforeAnalyze', this, { analyzerContext: analyzerContext });

    if (analyzerContext.tokens.length > 0) {
      analyzerContext.language = _globals.languages[analyzerContext.tokens[0].language] || _globals.languages[_constants.DEFAULT_LANGUAGE];
      nodes = [];
      // TODO: lastIndex = 0;
      container = this.createContainer(analyzerContext);

      for (i = startIndex; i < analyzerContext.tokens.length; i++) {
        language = _globals.languages[analyzerContext.tokens[i].language] || _globals.languages[_constants.DEFAULT_LANGUAGE];
        if (language.name !== analyzerContext.language.name) {
          appendAll(container, analyzerContext.getNodes());
          analyzerContext.resetNodes();

          nodes.push(container);
          analyzerContext.language = language;
          container = this.createContainer(analyzerContext);
        }

        analyzerContext.index = i;
        tokenName = analyzerContext.tokens[i].name;
        // TODO: clean up!!!
        func = 'handle_' + tokenName;

        analyzer = analyzerContext.getAnalyzer.call(analyzerContext) || analyzerContext.language.analyzer;
        analyzer[func] ? analyzer[func](analyzerContext) : analyzer.handleToken(analyzerContext);
      }

      // append the last nodes, and add the final nodes to the context
      appendAll(container, analyzerContext.getNodes());
      nodes.push(container);
      analyzerContext.resetNodes();
      for (i = 0; i < nodes.length; i++) {
        analyzerContext.addNode(nodes[i]);
      }
    }

    fireEvent('afterAnalyze', this, { analyzerContext: analyzerContext });
  }

  // partialContext allows us to perform a partial parse, and then pick up where we left off at a later time
  // this functionality enables nested highlights (language within a language, e.g. PHP within HTML followed by more PHP)
  highlightText(unhighlightedCode, languageId, partialContext) {
    var language = _globals.languages[languageId];

    partialContext = partialContext || {};
    if (language === undefined) {
      // use default language if one wasn't specified or hasn't been registered
      language = _globals.languages[_constants.DEFAULT_LANGUAGE];
    }

    fireEvent('beforeHighlight', this, {
      code: unhighlightedCode,
      language: language,
      previousContext: partialContext
    });

    var analyzerContext = this.createAnalyzerContext(this.tokenize.call(this, unhighlightedCode, language, partialContext, this.options), partialContext, this.options);

    this.analyze.call(this, analyzerContext, partialContext.index ? partialContext.index + 1 : 0);

    fireEvent('afterHighlight', this, { analyzerContext: analyzerContext });

    return analyzerContext;
  }

  // matches the language of the node to highlight
  matchSunlightNode(node) {
    if (!this.matchSunlightNodeRegEx) {
      this.matchSunlightNodeRegEx = new RegExp('(?:\\s|^)' + this.options.classPrefix + 'highlight-(\\S+)(?:\\s|$)');
    }
    return this.matchSunlightNodeRegEx.exec(node.className);
  }

  // determines if the node has already been highlighted
  isAlreadyHighlighted(node) {
    if (!this.isAlreadyHighlightedRegEx) {
      this.isAlreadyHighlightedRegEx = new RegExp('(?:\\s|^)' + this.options.classPrefix + 'highlighted(?:\\s|$)');
    }

    return this.isAlreadyHighlightedRegEx.test(node.className);
  }

  // highlights a block of text
  highlight(code, languageId) {
    return this.highlightText.call(this, code, languageId);
  }

  // recursively highlights a DOM node
  highlightNode(node) {
    var partialContext = void 0;

    if (this.isAlreadyHighlighted(node)) return;

    var match = this.matchSunlightNode(node);
    if (match === null) return;

    var languageId = match[1];
    var currentNodeCount = 0;
    fireEvent('beforeHighlightNode', this, { node: node });
    for (var j = 0; j < node.childNodes.length; j++) {
      if (node.childNodes[j].nodeType === 3) {
        // text nodes
        partialContext = this.highlightText.call(this, node.childNodes[j].nodeValue, languageId, partialContext);
        HIGHLIGHTED_NODE_COUNT++;
        currentNodeCount = currentNodeCount || HIGHLIGHTED_NODE_COUNT;
        var nodes = partialContext.getNodes();

        node.replaceChild(nodes[0], node.childNodes[j]);
        for (var k = 1; k < nodes.length; k++) {
          node.insertBefore(nodes[k], nodes[k - 1].nextSibling);
        }
      } else if (node.childNodes[j].nodeType === 1) {
        // element nodes
        this.highlightNode.call(this, node.childNodes[j]);
      }
    }

    // indicate that this node has been highlighted
    node.className += ' ' + this.options.classPrefix + 'highlighted';

    var container = void 0,
        codeContainer = void 0;
    // if the node is block level, we put it in a container, otherwise we just leave it alone
    if (util.getComputedStyle(node, 'display') === 'block') {
      container = document.createElement('div');
      container.className = this.options.classPrefix + 'container';

      codeContainer = document.createElement('div');
      codeContainer.className = this.options.classPrefix + 'code-container';

      // apply max height if specified in options
      if (this.options.maxHeight !== false) {
        codeContainer.style.overflowY = 'auto';
        codeContainer.style.maxHeight = this.options.maxHeight + (/^\d+$/.test(this.options.maxHeight) ? 'px' : '');
      }

      container.appendChild(codeContainer);

      node.parentNode.insertBefore(codeContainer, node);
      node.parentNode.removeChild(node);
      codeContainer.appendChild(node);

      codeContainer.parentNode.insertBefore(container, codeContainer);
      codeContainer.parentNode.removeChild(codeContainer);
      container.appendChild(codeContainer);
    }

    fireEvent('afterHighlightNode', this, {
      container: container,
      codeContainer: codeContainer,
      node: node,
      count: currentNodeCount
    });
  }
}
exports.Highlighter = Highlighter;