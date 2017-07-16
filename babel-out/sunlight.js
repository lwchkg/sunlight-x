'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sunlight = undefined;

var _util = require('util.js');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jsdom = require('jsdom').jsdom; /**
                                     * Sunlight
                                     *    Intelligent syntax highlighting
                                     *
                                     * http://sunlightjs.com/
                                     *
                                     * by Tommy Montgomery <http://tmont.com>
                                     * Licensed under WTFPL <http://sam.zoy.org/wtfpl/>
                                     */

var document = jsdom('', {});
// const window = document.defaultView;

// (function(window, document, undefined) {
// http://webreflection.blogspot.com/2009/01/32-bytes-to-know-if-your-browser-is-ie.html
// we have to sniff this because IE requires \r
var isIe = !+'\v1';
var EOL = isIe ? '\r' : '\n';
var EMPTY = function EMPTY() {
  return null;
};
var HIGHLIGHTED_NODE_COUNT = 0;
var DEFAULT_LANGUAGE = 'plaintext';
var DEFAULT_CLASS_PREFIX = 'sunlight-';

// global sunlight variables
var globalOptions = {
  tabWidth: 4,
  classPrefix: DEFAULT_CLASS_PREFIX,
  showWhitespace: false,
  maxHeight: false
};
var languages = {};
var languageDefaults = {};
var events = {
  beforeHighlightNode: [],
  beforeHighlight: [],
  beforeTokenize: [],
  afterTokenize: [],
  beforeAnalyze: [],
  afterAnalyze: [],
  afterHighlight: [],
  afterHighlightNode: []
};

class defaultAnalyzer {
  defaultHandleToken(suffix) {
    return function (context) {
      var element = document.createElement('span');
      element.className = context.options.classPrefix + suffix;
      element.appendChild(context.createTextNode(context.tokens[context.index]));
      return context.addNode(element) || true;
    };
  }

  handleToken(context) {
    return defaultHandleToken(context.tokens[context.index].name)(context);
  }

  // just append default content as a text node
  handle_default(context) {
    return context.addNode(context.createTextNode(context.tokens[context.index]));
  }

  // this handles the named ident mayhem
  handle_ident(context) {
    var evaluate = function evaluate(rules, createRule) {
      var i = void 0;
      rules = rules || [];
      for (i = 0; i < rules.length; i++) {
        if (typeof rules[i] === 'function') {
          if (rules[i](context)) return defaultHandleToken('named-ident')(context);
        } else if (createRule && createRule(rules[i])(context.tokens)) {
          return defaultHandleToken('named-ident')(context);
        }
      }

      return false;
    };

    return evaluate(context.language.namedIdentRules.custom) || evaluate(context.language.namedIdentRules.follows, function (ruleData) {
      return createProceduralRule(context.index - 1, -1, ruleData, context.language.caseInsensitive);
    }) || evaluate(context.language.namedIdentRules.precedes, function (ruleData) {
      return createProceduralRule(context.index + 1, 1, ruleData, context.language.caseInsensitive);
    }) || evaluate(context.language.namedIdentRules.between, function (ruleData) {
      return createBetweenRule(context.index, ruleData.opener, ruleData.closer, context.language.caseInsensitive);
    }) || defaultHandleToken('ident')(context);
  }
}

languageDefaults = {
  analyzer: create(defaultAnalyzer),
  customTokens: [],
  namedIdentRules: {},
  punctuation: /[^\w\s]/,
  numberParser: defaultNumberParser,
  caseInsensitive: false,
  doNotParse: /\s/,
  contextItems: {},
  embeddedLanguages: {}
};

// -----------
// FUNCTIONS
// -----------

function createCodeReader(_text) {
  var index = 0;
  var line = 1;
  var column = 1;
  var length = void 0;
  var EOF = undefined;
  var currentChar = void 0;
  var nextReadBeginsLine = void 0;

  _text = _text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); // normalize line endings to unix

  length = _text.length;
  currentChar = length > 0 ? _text.charAt(0) : EOF;

  function getCharacters(count) {
    var value = void 0;
    if (count === 0) return '';

    count = count || 1;

    value = _text.substring(index + 1, index + count + 1);
    return value === '' ? EOF : value;
  }

  return {
    toString: function toString() {
      return `length: ${length}, index: ${index}, line: ${line}, column: ${column}, current: [${currentChar}]`;
    },

    peek: function peek(count) {
      return getCharacters(count);
    },

    substring: function substring() {
      return _text.substring(index);
    },

    peekSubstring: function peekSubstring() {
      return _text.substring(index + 1);
    },

    read: function read(count) {
      var value = getCharacters(count),
          newlineCount = void 0,
          lastChar = void 0;

      if (value === '') {
        // this is a result of reading/peeking/doing nothing
        return value;
      }

      if (value !== EOF) {
        // advance index
        index += value.length;
        column += value.length;

        // update line count
        if (nextReadBeginsLine) {
          line++;
          column = 1;
          nextReadBeginsLine = false;
        }

        newlineCount = value.substring(0, value.length - 1).replace(/[^\n]/g, '').length;
        if (newlineCount > 0) {
          line += newlineCount;
          column = 1;
        }

        lastChar = last(value);
        if (lastChar === '\n') nextReadBeginsLine = true;

        currentChar = lastChar;
      } else {
        index = length;
        currentChar = EOF;
      }

      return value;
    },

    text: function text() {
      return _text;
    },

    getLine: function getLine() {
      return line;
    },
    getColumn: function getColumn() {
      return column;
    },
    isEof: function isEof() {
      return index >= length;
    },
    isSol: function isSol() {
      return column === 1;
    },
    isSolWs: function isSolWs() {
      var temp = index,
          c = void 0;
      if (column === 1) return true;

      // look backward until we find a newline or a non-whitespace character
      while ((c = _text.charAt(--temp)) !== '') {
        if (c === '\n') return true;

        if (!/\s/.test(c)) return false;
      }

      return true;
    },
    isEol: function isEol() {
      return nextReadBeginsLine;
    },
    EOF: EOF,
    current: function current() {
      return currentChar;
    }
  };
}

// http://javascript.crockford.com/prototypal.html
function create(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

function appendAll(parent, children) {
  var i = void 0;
  for (i = 0; i < children.length; i++) {
    parent.appendChild(children[i]);
  }
}

// gets the next token in the specified direction while matcher matches the current token
function getNextWhile(tokens, index, direction, matcher) {
  var count = 1,
      token = void 0;

  direction = direction || 1;
  while (token = tokens[index + direction * count++]) {
    if (!matcher(token)) return token;
  }return undefined;
}

function defaultNumberParser(context) {
  var current = context.reader.current(),
      number = void 0,
      line = context.reader.getLine(),
      column = context.reader.getColumn(),
      allowDecimal = true,
      peek = void 0;

  if (!/\d/.test(current)) {
    // is it a decimal followed by a number?
    if (current !== '.' || !/\d/.test(context.reader.peek())) return null;

    // decimal without leading zero
    number = current + context.reader.read();
    allowDecimal = false;
  } else {
    number = current;
    if (current === '0' && context.reader.peek() !== '.') {
      // hex or octal
      allowDecimal = false;
    }
  }

  // easy way out: read until it's not a number or letter
  // this will work for hex (0xef), octal (012), decimal and scientific notation (1e3)
  // anything else and you're on your own

  while ((peek = context.reader.peek()) !== context.reader.EOF) {
    if (!/[A-Za-z0-9]/.test(peek)) {
      if (peek === '.' && allowDecimal && /\d$/.test(context.reader.peek(2))) {
        number += context.reader.read();
        allowDecimal = false;
        continue;
      }

      break;
    }

    number += context.reader.read();
  }

  return context.createToken('number', number, line, column);
}

function fireEvent(eventName, highlighter, eventContext) {
  var delegates = events[eventName] || [],
      i = void 0;

  for (i = 0; i < delegates.length; i++) {
    delegates[i].call(highlighter, eventContext);
  }
}

function Highlighter(options) {
  this.options = merge(clone(globalOptions), options);
}

Highlighter.prototype = function () {
  var parseNextToken = function () {
    function isIdentMatch(context) {
      return context.language.identFirstLetter && context.language.identFirstLetter.test(context.reader.current());
    }

    // token parsing functions
    function parseKeyword(context) {
      return matchWord(context, context.language.keywords, 'keyword');
    }

    function parseCustomTokens(context) {
      var tokenName = void 0,
          token = void 0;
      if (context.language.customTokens === undefined) return null;

      for (tokenName in context.language.customTokens) {
        token = matchWord(context, context.language.customTokens[tokenName], tokenName);
        if (token !== null) return token;
      }

      return null;
    }

    function parseOperator(context) {
      return matchWord(context, context.language.operators, 'operator');
    }

    function parsePunctuation(context) {
      var current = context.reader.current();
      if (context.language.punctuation.test(regexEscape(current))) {
        return context.createToken('punctuation', current, context.reader.getLine(), context.reader.getColumn());
      }

      return null;
    }

    function parseIdent(context) {
      var ident = void 0,
          peek = void 0,
          line = context.reader.getLine(),
          column = context.reader.getColumn();

      if (!isIdentMatch(context)) return null;

      ident = context.reader.current();
      while ((peek = context.reader.peek()) !== context.reader.EOF) {
        if (!context.language.identAfterFirstLetter.test(peek)) break;

        ident += context.reader.read();
      }

      return context.createToken('ident', ident, line, column);
    }

    function parseDefault(context) {
      if (context.defaultData.text === '') {
        // new default token
        context.defaultData.line = context.reader.getLine();
        context.defaultData.column = context.reader.getColumn();
      }

      context.defaultData.text += context.reader.current();
      return null;
    }

    function parseScopes(context) {
      var current = context.reader.current(),
          tokenName = void 0,
          specificScopes = void 0,
          j = void 0,
          opener = void 0,
          line = void 0,
          column = void 0,
          continuation = void 0,
          value = void 0;

      for (tokenName in context.language.scopes) {
        specificScopes = context.language.scopes[tokenName];
        for (j = 0; j < specificScopes.length; j++) {
          opener = specificScopes[j][0];

          value = current + context.reader.peek(opener.length - 1);

          if (opener !== value && (!context.language.caseInsensitive || value.toUpperCase() !== opener.toUpperCase())) continue;

          line = context.reader.getLine(), column = context.reader.getColumn();
          context.reader.read(opener.length - 1);
          continuation = getScopeReaderFunction(specificScopes[j], tokenName);
          return continuation(context, continuation, value, line, column);
        }
      }

      return null;
    }

    function parseNumber(context) {
      return context.language.numberParser(context);
    }

    function parseCustomRules(context) {
      var customRules = context.language.customParseRules,
          i = void 0,
          token = void 0;

      if (customRules === undefined) return null;

      for (i = 0; i < customRules.length; i++) {
        token = customRules[i](context);
        if (token) return token;
      }

      return null;
    }

    return function (context) {
      if (context.language.doNotParse.test(context.reader.current())) return parseDefault(context);

      return parseCustomRules(context) || parseCustomTokens(context) || parseKeyword(context) || parseScopes(context) || parseIdent(context) || parseNumber(context) || parseOperator(context) || parsePunctuation(context) || parseDefault(context);
    };
  }();

  function getScopeReaderFunction(scope, tokenName) {
    var escapeSequences = scope[2] || [],
        closerLength = scope[1].length,
        closer = typeof scope[1] === 'string' ? new RegExp(regexEscape(scope[1])) : scope[1].regex,
        zeroWidth = scope[3] || false;

    // processCurrent indicates that this is being called from a continuation
    // which means that we need to process the current char, rather than peeking at the next
    return function (context, continuation, buffer, line, column, processCurrent) {
      var foundCloser = false;
      buffer = buffer || '';

      processCurrent = processCurrent ? 1 : 0;

      function process(processCurrent) {
        // check for escape sequences
        var peekValue = void 0,
            current = context.reader.current(),
            i = void 0;

        for (i = 0; i < escapeSequences.length; i++) {
          peekValue = (processCurrent ? current : '') + context.reader.peek(escapeSequences[i].length - processCurrent);
          if (peekValue === escapeSequences[i]) {
            buffer += context.reader.read(peekValue.length - processCurrent);
            return true;
          }
        }

        peekValue = (processCurrent ? current : '') + context.reader.peek(closerLength - processCurrent);
        if (closer.test(peekValue)) {
          foundCloser = true;
          return false;
        }

        buffer += processCurrent ? current : context.reader.read();
        return true;
      }

      if (!processCurrent || process(true)) {
        while (context.reader.peek() !== context.reader.EOF && process(false)) {}
      }

      if (processCurrent) {
        buffer += context.reader.current();
        context.reader.read();
      } else {
        buffer += zeroWidth || context.reader.peek() === context.reader.EOF ? '' : context.reader.read(closerLength);
      }

      if (!foundCloser) {
        // we need to signal to the context that this scope was never properly closed
        // this has significance for partial parses (e.g. for nested languages)
        context.continuation = continuation;
      }

      return context.createToken(tokenName, buffer, line, column);
    };
  }

  // called before processing the current
  function switchToEmbeddedLanguageIfNecessary(context) {
    var i = void 0,
        embeddedLanguage = void 0;

    for (i = 0; i < context.language.embeddedLanguages.length; i++) {
      if (!languages[context.language.embeddedLanguages[i].language]) {
        // unregistered language
        continue;
      }

      embeddedLanguage = clone(context.language.embeddedLanguages[i]);

      if (embeddedLanguage.switchTo(context)) {
        embeddedLanguage.oldItems = clone(context.items);
        context.embeddedLanguageStack.push(embeddedLanguage);
        context.language = languages[embeddedLanguage.language];
        context.items = merge(context.items, clone(context.language.contextItems));
        break;
      }
    }
  }

  // called after processing the current
  function switchBackFromEmbeddedLanguageIfNecessary(context) {
    var current = last(context.embeddedLanguageStack),
        lang = void 0;

    if (current && current.switchBack(context)) {
      context.language = languages[current.parentLanguage];
      lang = context.embeddedLanguageStack.pop();

      // restore old items
      context.items = clone(lang.oldItems);
      lang.oldItems = {};
    }
  }

  function tokenize(unhighlightedCode, language, partialContext, options) {
    var tokens = [],
        context = void 0,
        continuation = void 0,
        token = void 0;

    fireEvent('beforeTokenize', this, {
      code: unhighlightedCode,
      language: language
    });
    context = {
      reader: createCodeReader(unhighlightedCode),
      language: language,
      items: clone(language.contextItems),
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
          value: isIe ? value.replace(/\n/g, '\r') : value,
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
      switchToEmbeddedLanguageIfNecessary(context);
      token = parseNextToken(context);

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

      switchBackFromEmbeddedLanguageIfNecessary(context);
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

  function createAnalyzerContext(parserContext, partialContext, options) {
    var nodes = [],
        prepareText = function () {
      var nbsp = void 0,
          tab = void 0;
      if (options.showWhitespace) {
        nbsp = String.fromCharCode(0xb7);
        tab = new Array(options.tabWidth).join(String.fromCharCode(0x2014)) + String.fromCharCode(0x2192);
      } else {
        nbsp = String.fromCharCode(0xa0);
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
          lastNewlineColumn = value.lastIndexOf(EOL, tabIndex);
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
      getAnalyzer: EMPTY,
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

  // partialContext allows us to perform a partial parse, and then pick up where we left off at a later time
  // this functionality enables nested highlights (language within a language, e.g. PHP within HTML followed by more PHP)
  function highlightText(unhighlightedCode, languageId, partialContext) {
    var language = languages[languageId],
        analyzerContext = void 0;

    partialContext = partialContext || {};
    if (language === undefined) {
      // use default language if one wasn't specified or hasn't been registered
      language = languages[DEFAULT_LANGUAGE];
    }

    fireEvent('beforeHighlight', this, {
      code: unhighlightedCode,
      language: language,
      previousContext: partialContext
    });

    analyzerContext = createAnalyzerContext(tokenize.call(this, unhighlightedCode, language, partialContext, this.options), partialContext, this.options);

    analyze.call(this, analyzerContext, partialContext.index ? partialContext.index + 1 : 0);

    fireEvent('afterHighlight', this, { analyzerContext: analyzerContext });

    return analyzerContext;
  }

  function createContainer(ctx) {
    var container = document.createElement('span');
    container.className = ctx.options.classPrefix + ctx.language.name;
    return container;
  }

  function analyze(analyzerContext, startIndex) {
    var nodes = void 0,
        lastIndex = void 0,
        container = void 0,
        i = void 0,
        tokenName = void 0,
        func = void 0,
        language = void 0,
        analyzer = void 0;

    fireEvent('beforeAnalyze', this, { analyzerContext: analyzerContext });

    if (analyzerContext.tokens.length > 0) {
      analyzerContext.language = languages[analyzerContext.tokens[0].language] || languages[DEFAULT_LANGUAGE];
      nodes = [];
      lastIndex = 0;
      container = createContainer(analyzerContext);

      for (i = startIndex; i < analyzerContext.tokens.length; i++) {
        language = languages[analyzerContext.tokens[i].language] || languages[DEFAULT_LANGUAGE];
        if (language.name !== analyzerContext.language.name) {
          appendAll(container, analyzerContext.getNodes());
          analyzerContext.resetNodes();

          nodes.push(container);
          analyzerContext.language = language;
          container = createContainer(analyzerContext);
        }

        analyzerContext.index = i;
        tokenName = analyzerContext.tokens[i].name;
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

  return {
    // matches the language of the node to highlight
    matchSunlightNode: function () {
      var regex = void 0;

      return function (node) {
        if (!regex) {
          regex = new RegExp('(?:\\s|^)' + this.options.classPrefix + 'highlight-(\\S+)(?:\\s|$)');
        }

        return regex.exec(node.className);
      };
    }(),

    // determines if the node has already been highlighted
    isAlreadyHighlighted: function () {
      var regex = void 0;
      return function (node) {
        if (!regex) {
          regex = new RegExp('(?:\\s|^)' + this.options.classPrefix + 'highlighted(?:\\s|$)');
        }

        return regex.test(node.className);
      };
    }(),

    // highlights a block of text
    highlight: function highlight(code, languageId) {
      return highlightText.call(this, code, languageId);
    },

    // recursively highlights a DOM node
    highlightNode: function highlightRecursive(node) {
      var match = void 0,
          currentNodeCount = void 0,
          j = void 0,
          nodes = void 0,
          k = void 0,
          partialContext = void 0,
          container = void 0,
          codeContainer = void 0;

      if (this.isAlreadyHighlighted(node) || (match = this.matchSunlightNode(node)) === null) return;

      var languageId = match[1];
      currentNodeCount = 0;
      fireEvent('beforeHighlightNode', this, { node: node });
      for (j = 0; j < node.childNodes.length; j++) {
        if (node.childNodes[j].nodeType === 3) {
          // text nodes
          partialContext = highlightText.call(this, node.childNodes[j].nodeValue, languageId, partialContext);
          HIGHLIGHTED_NODE_COUNT++;
          currentNodeCount = currentNodeCount || HIGHLIGHTED_NODE_COUNT;
          nodes = partialContext.getNodes();

          node.replaceChild(nodes[0], node.childNodes[j]);
          for (k = 1; k < nodes.length; k++) {
            node.insertBefore(nodes[k], nodes[k - 1].nextSibling);
          }
        } else if (node.childNodes[j].nodeType === 1) {
          // element nodes
          highlightRecursive.call(this, node.childNodes[j]);
        }
      }

      // indicate that this node has been highlighted
      node.className += ' ' + this.options.classPrefix + 'highlighted';

      // if the node is block level, we put it in a container, otherwise we just leave it alone
      if (getComputedStyle(node, 'display') === 'block') {
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
  };
}();

// public facing object
var Sunlight = exports.Sunlight = {
  version: '1.22.0',
  Highlighter: Highlighter,
  createAnalyzer: function createAnalyzer() {
    return create(defaultAnalyzer);
  },
  globalOptions: globalOptions,

  highlightAll: function highlightAll(options) {
    var highlighter = new Highlighter(options);
    var tags = document.getElementsByTagName('*');
    for (var i = 0; i < tags.length; i++) {
      highlighter.highlightNode(tags[i]);
    }
  },

  registerLanguage: function registerLanguage(languageId, languageData) {
    var tokenName = void 0,
        languageName = void 0;

    if (!languageId) throw new Error('Languages must be registered with an identifier, e.g. "php" for PHP');

    languageData = _util2.default.merge(_util2.default.merge({}, languageDefaults), languageData);
    languageData.name = languageId;

    // transform keywords, operators and custom tokens into a hash map
    languageData.keywords = _util2.default.createHashMap(languageData.keywords || [], '\\b', languageData.caseInsensitive);
    languageData.operators = _util2.default.createHashMap(languageData.operators || [], '', languageData.caseInsensitive);
    for (tokenName in languageData.customTokens) {
      languageData.customTokens[tokenName] = _util2.default.createHashMap(languageData.customTokens[tokenName].values ? languageData.customTokens[tokenName].values : [], languageData.customTokens[tokenName].boundary, languageData.caseInsensitive);
    }

    // convert the embedded language object to an easier-to-use array
    var embeddedLanguages = [];
    for (languageName in languageData.embeddedLanguages) {
      embeddedLanguages.push({
        parentLanguage: languageData.name,
        language: languageName,
        switchTo: languageData.embeddedLanguages[languageName].switchTo,
        switchBack: languageData.embeddedLanguages[languageName].switchBack
      });
    }

    languageData.embeddedLanguages = embeddedLanguages;

    languages[languageData.name] = languageData;
  },

  isRegistered: function isRegistered(languageId) {
    return languages[languageId] !== undefined;
  },

  bind: function bind(event, callback) {
    if (!events[event]) throw new Error('Unknown event "' + event + '"');

    events[event].push(callback);
  }
};

// })(this, document);