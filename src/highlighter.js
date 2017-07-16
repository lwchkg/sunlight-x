import * as util from './util.js';

/* eslint require-jsdoc: 0, no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }]*/

Highlighter.prototype = (function() {
  const parseNextToken = (function() {
    function isIdentMatch(context) {
      return (
        context.language.identFirstLetter &&
        context.language.identFirstLetter.test(context.reader.current())
      );
    }

    // token parsing functions
    function parseKeyword(context) {
      return util.matchWord(context, context.language.keywords, 'keyword');
    }

    function parseCustomTokens(context) {
      let tokenName, token;
      if (context.language.customTokens === undefined) return null;

      for (tokenName in context.language.customTokens) {
        token = util.matchWord(
          context,
          context.language.customTokens[tokenName],
          tokenName
        );
        if (token !== null) return token;
      }

      return null;
    }

    function parseOperator(context) {
      return util.matchWord(context, context.language.operators, 'operator');
    }

    function parsePunctuation(context) {
      const current = context.reader.current();
      if (context.language.punctuation.test(util.regexEscape(current))) {
        return context.createToken(
          'punctuation',
          current,
          context.reader.getLine(),
          context.reader.getColumn()
        );
      }

      return null;
    }

    function parseIdent(context) {
      const line = context.reader.getLine();
      const column = context.reader.getColumn();

      if (!isIdentMatch(context)) return null;

      let ident = context.reader.current();
      let peek;
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

    function getScopeReaderFunction(scope, tokenName) {
      const escapeSequences = scope[2] || [];
      const closerLength = scope[1].length;
      const closer =
          typeof scope[1] === 'string'
            ? new RegExp(util.regexEscape(scope[1]))
            : scope[1].regex;
      const zeroWidth = scope[3] || false;

      // processCurrent indicates that this is being called from a continuation
      // which means that we need to process the current char, rather than peeking at the next
      return function(
        context,
        continuation,
        buffer,
        line,
        column,
        processCurrent
      ) {
        let foundCloser = false;
        buffer = buffer || '';

        processCurrent = processCurrent ? 1 : 0;

        function process(processCurrent) {
          // check for escape sequences
          let peekValue;
          const current = context.reader.current();

          for (let i = 0; i < escapeSequences.length; i++) {
            peekValue =
              (processCurrent ? current : '') +
              context.reader.peek(escapeSequences[i].length - processCurrent);
            if (peekValue === escapeSequences[i]) {
              buffer += context.reader.read(peekValue.length - processCurrent);
              return true;
            }
          }

          peekValue =
            (processCurrent ? current : '') +
            context.reader.peek(closerLength - processCurrent);
          if (closer.test(peekValue)) {
            foundCloser = true;
            return false;
          }

          buffer += processCurrent ? current : context.reader.read();
          return true;
        }

        if (!processCurrent || process(true)) {
          while (context.reader.peek() !== context.reader.EOF && process(false)) {
            // empty
          }
        }

        if (processCurrent) {
          buffer += context.reader.current();
          context.reader.read();
        } else {
          buffer +=
            zeroWidth || context.reader.peek() === context.reader.EOF
              ? ''
              : context.reader.read(closerLength);
        }

        if (!foundCloser) {
          // we need to signal to the context that this scope was never properly closed
          // this has significance for partial parses (e.g. for nested languages)
          context.continuation = continuation;
        }

        return context.createToken(tokenName, buffer, line, column);
      };
    }

    function parseScopes(context) {
      const current = context.reader.current();

      for (const tokenName in context.language.scopes) {
        const specificScopes = context.language.scopes[tokenName];
        for (let j = 0; j < specificScopes.length; j++) {
          const opener = specificScopes[j][0];

          const value = current + context.reader.peek(opener.length - 1);

          if (
            opener !== value &&
            (!context.language.caseInsensitive ||
              value.toUpperCase() !== opener.toUpperCase())
          )
            continue;

          const line = context.reader.getLine();
          const column = context.reader.getColumn();
          context.reader.read(opener.length - 1);
          const continuation = getScopeReaderFunction(specificScopes[j], tokenName);
          return continuation(context, continuation, value, line, column);
        }
      }

      return null;
    }

    function parseNumber(context) {
      return context.language.numberParser(context);
    }

    function parseCustomRules(context) {
      const customRules = context.language.customParseRules;

      if (customRules === undefined) return null;

      for (let i = 0; i < customRules.length; i++) {
        const token = customRules[i](context);
        if (token) return token;
      }

      return null;
    }

    return function(context) {
      if (context.language.doNotParse.test(context.reader.current()))
        return parseDefault(context);

      return (
        parseCustomRules(context) ||
        parseCustomTokens(context) ||
        parseKeyword(context) ||
        parseScopes(context) ||
        parseIdent(context) ||
        parseNumber(context) ||
        parseOperator(context) ||
        parsePunctuation(context) ||
        parseDefault(context)
      );
    };
  })();

  // called before processing the current
  function switchToEmbeddedLanguageIfNecessary(context) {
    let i, embeddedLanguage;

    for (i = 0; i < context.language.embeddedLanguages.length; i++) {
      if (!languages[context.language.embeddedLanguages[i].language]) {
        // unregistered language
        continue;
      }

      embeddedLanguage = util.clone(context.language.embeddedLanguages[i]);

      if (embeddedLanguage.switchTo(context)) {
        embeddedLanguage.oldItems = util.clone(context.items);
        context.embeddedLanguageStack.push(embeddedLanguage);
        context.language = languages[embeddedLanguage.language];
        context.items = util.merge(
          context.items,
          util.clone(context.language.contextItems)
        );
        break;
      }
    }
  }

  // called after processing the current
  function switchBackFromEmbeddedLanguageIfNecessary(context) {
    const current = util.last(context.embeddedLanguageStack);

    if (current && current.switchBack(context)) {
      context.language = languages[current.parentLanguage];
      const lang = context.embeddedLanguageStack.pop();

      // restore old items
      context.items = util.clone(lang.oldItems);
      lang.oldItems = {};
    }
  }

  function tokenize(unhighlightedCode, language, partialContext, options) {
    let tokens = [],
      continuation,
      token;

    fireEvent('beforeTokenize', this, {
      code: unhighlightedCode,
      language: language,
    });

    const context = {
      reader: createCodeReader(unhighlightedCode),
      language: language,
      items: util.clone(language.contextItems),
      token: function(index) {
        return tokens[index];
      },
      getAllTokens: function() {
        return tokens.slice(0);
      },
      count: function() {
        return tokens.length;
      },
      options: options,
      embeddedLanguageStack: [],

      defaultData: {
        text: '',
        line: 1,
        column: 1,
      },
      createToken: function(name, value, line, column) {
        return {
          name: name,
          line: line,
          value: isIe ? value.replace(/\n/g, '\r') : value,
          column: column,
          language: this.language.name,
        };
      },
    };

    // if continuation is given, then we need to pick up where we left off from a previous parse
    // basically it indicates that a scope was never closed, so we need to continue that scope
    if (partialContext.continuation) {
      continuation = partialContext.continuation;
      partialContext.continuation = null;
      tokens.push(
        continuation(
          context,
          continuation,
          '',
          context.reader.getLine(),
          context.reader.getColumn(),
          true
        )
      );
    }

    while (!context.reader.isEof()) {
      switchToEmbeddedLanguageIfNecessary(context);
      token = parseNextToken(context);

      // flush default data if needed (in pretty much all languages this is just whitespace)
      if (token !== null) {
        if (context.defaultData.text !== '') {
          tokens.push(
            context.createToken(
              'default',
              context.defaultData.text,
              context.defaultData.line,
              context.defaultData.column
            )
          );
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
      tokens.push(
        context.createToken(
          'default',
          context.defaultData.text,
          context.defaultData.line,
          context.defaultData.column
        )
      );
    }

    fireEvent('afterTokenize', this, {
      code: unhighlightedCode,
      parserContext: context,
    });
    return context;
  }

  function createAnalyzerContext(parserContext, partialContext, options) {
    let nodes = [];
    const prepareText = (function() {
      let nbsp, tab;
      if (options.showWhitespace) {
        nbsp = '\u00b7';
        tab = new Array(options.tabWidth).join('\u2014') + '\u2192';
      } else {
        nbsp = '\u00a0';
        tab = new Array(options.tabWidth + 1).join(nbsp);
      }

      return function(token) {
        let value = token.value.split(' ').join(nbsp),
          tabIndex,
          lastNewlineColumn,
          actualColumn,
          tabLength;

        // tabstop madness: replace \t with the appropriate number of characters, depending on the tabWidth option and its relative position in the line
        while ((tabIndex = value.indexOf('\t')) >= 0) {
          lastNewlineColumn = value.lastIndexOf(EOL, tabIndex);
          actualColumn =
            lastNewlineColumn === -1
              ? tabIndex
              : tabIndex - lastNewlineColumn - 1;
          tabLength = options.tabWidth - actualColumn % options.tabWidth; // actual length of the TAB character

          value =
            value.substring(0, tabIndex) +
            tab.substring(options.tabWidth - tabLength) +
            value.substring(tabIndex + 1);
        }

        return value;
      };
    })();

    return {
      tokens: (partialContext.tokens || [])
        .concat(parserContext.getAllTokens()),
      index: partialContext.index ? partialContext.index + 1 : 0,
      language: null,
      getAnalyzer: EMPTY,
      options: options,
      continuation: parserContext.continuation,
      addNode: function(node) {
        nodes.push(node);
      },
      createTextNode: function(token) {
        return document.createTextNode(prepareText(token));
      },
      getNodes: function() {
        return nodes;
      },
      resetNodes: function() {
        nodes = [];
      },
      items: parserContext.items,
    };
  }

  function createContainer(ctx) {
    const container = document.createElement('span');
    container.className = ctx.options.classPrefix + ctx.language.name;
    return container;
  }

  function analyze(analyzerContext, startIndex) {
    let nodes, container, i, tokenName, func, language, analyzer;
    // TODO: let lastIndex;

    fireEvent('beforeAnalyze', this, {analyzerContext: analyzerContext});

    if (analyzerContext.tokens.length > 0) {
      analyzerContext.language =
        languages[analyzerContext.tokens[0].language] ||
        languages[DEFAULT_LANGUAGE];
      nodes = [];
      // TODO: lastIndex = 0;
      container = createContainer(analyzerContext);

      for (i = startIndex; i < analyzerContext.tokens.length; i++) {
        language =
          languages[analyzerContext.tokens[i].language] ||
          languages[DEFAULT_LANGUAGE];
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

        analyzer =
          analyzerContext.getAnalyzer.call(analyzerContext) ||
          analyzerContext.language.analyzer;
        analyzer[func]
          ? analyzer[func](analyzerContext)
          : analyzer.handleToken(analyzerContext);
      }

      // append the last nodes, and add the final nodes to the context
      appendAll(container, analyzerContext.getNodes());
      nodes.push(container);
      analyzerContext.resetNodes();
      for (i = 0; i < nodes.length; i++) analyzerContext.addNode(nodes[i]);
    }

    fireEvent('afterAnalyze', this, {analyzerContext: analyzerContext});
  }

  // partialContext allows us to perform a partial parse, and then pick up where we left off at a later time
  // this functionality enables nested highlights (language within a language, e.g. PHP within HTML followed by more PHP)
  function highlightText(unhighlightedCode, languageId, partialContext) {
    let language = languages[languageId];

    partialContext = partialContext || {};
    if (language === undefined) {
      // use default language if one wasn't specified or hasn't been registered
      language = languages[DEFAULT_LANGUAGE];
    }

    fireEvent('beforeHighlight', this, {
      code: unhighlightedCode,
      language: language,
      previousContext: partialContext,
    });

    const analyzerContext = createAnalyzerContext(
      tokenize.call(
        this,
        unhighlightedCode,
        language,
        partialContext,
        this.options
      ),
      partialContext,
      this.options
    );

    analyze.call(
      this,
      analyzerContext,
      partialContext.index ? partialContext.index + 1 : 0
    );

    fireEvent('afterHighlight', this, {analyzerContext: analyzerContext});

    return analyzerContext;
  }

  return {
    // matches the language of the node to highlight
    matchSunlightNode: (function() {
      let regex;

      return function(node) {
        if (!regex) {
          regex = new RegExp(
            '(?:\\s|^)' + this.options.classPrefix + 'highlight-(\\S+)(?:\\s|$)'
          );
        }

        return regex.exec(node.className);
      };
    })(),

    // determines if the node has already been highlighted
    isAlreadyHighlighted: (function() {
      let regex;
      return function(node) {
        if (!regex) {
          regex = new RegExp(
            '(?:\\s|^)' + this.options.classPrefix + 'highlighted(?:\\s|$)'
          );
        }

        return regex.test(node.className);
      };
    })(),

    // highlights a block of text
    highlight: function(code, languageId) {
      return highlightText.call(this, code, languageId);
    },

    // recursively highlights a DOM node
    highlightNode: function highlightRecursive(node) {
      let partialContext;

      if (this.isAlreadyHighlighted(node))
        return;

      const match = this.matchSunlightNode(node);
      if (match === null)
        return;

      const languageId = match[1];
      let currentNodeCount = 0;
      fireEvent('beforeHighlightNode', this, {node: node});
      for (let j = 0; j < node.childNodes.length; j++) {
        if (node.childNodes[j].nodeType === 3) {
          // text nodes
          partialContext = highlightText.call(
            this,
            node.childNodes[j].nodeValue,
            languageId,
            partialContext
          );
          HIGHLIGHTED_NODE_COUNT++;
          currentNodeCount = currentNodeCount || HIGHLIGHTED_NODE_COUNT;
          const nodes = partialContext.getNodes();

          node.replaceChild(nodes[0], node.childNodes[j]);
          for (let k = 1; k < nodes.length; k++)
            node.insertBefore(nodes[k], nodes[k - 1].nextSibling);
        } else if (node.childNodes[j].nodeType === 1) {
          // element nodes
          highlightRecursive.call(this, node.childNodes[j]);
        }
      }

      // indicate that this node has been highlighted
      node.className += ' ' + this.options.classPrefix + 'highlighted';

      let container, codeContainer;
      // if the node is block level, we put it in a container, otherwise we just leave it alone
      if (util.getComputedStyle(node, 'display') === 'block') {
        container = document.createElement('div');
        container.className = this.options.classPrefix + 'container';

        codeContainer = document.createElement('div');
        codeContainer.className = this.options.classPrefix + 'code-container';

        // apply max height if specified in options
        if (this.options.maxHeight !== false) {
          codeContainer.style.overflowY = 'auto';
          codeContainer.style.maxHeight =
            this.options.maxHeight +
            (/^\d+$/.test(this.options.maxHeight) ? 'px' : '');
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
        count: currentNodeCount,
      });
    },
  };
})();
