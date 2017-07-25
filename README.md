# sunlight-x: Intelligent Syntax Highlighting, Modernized

[![Build Status](https://travis-ci.org/lwchkg/sunlight-x.svg?branch=master)](https://travis-ci.org/lwchkg/sunlight-x)
[![Build status](https://ci.appveyor.com/api/projects/status/ilr6lbjngs8x5abg?svg=true)](https://ci.appveyor.com/project/lwchkg/sunlight-x)

Sunlight highlighter modernized for node.js.
While the highlighter can be run, it is still a WIP.


# Usage

The API of the highlighter is still evolving.
Please read the test to infer on how to use the highlighter.

If you want badly to generate HTML snippets, see `test/integration.js` for examples.


# Difference from original Sunlight

- Flow annotation.
- Continuous integration. Old Sunlight has tests, but they are invoked manually.
- API is being refactored. Check Flow annotation for the new API.
- Put the original code in modules and classes.
- Modified CSS (themes not supported in HTML output yet).


# TODO

- Add all languages and plugins
- Reorganize API
- Add API for theme selection
- Add more tests
- Webpack for browsers
- Clarify owners of code snippets (some unknown code are used now).
  - Brainfuck: http://bf.doleczek.pl (license unknown) - any known free alternatives?
  - Others: no other owners found yet

# Copyright

Copyright 2017 Leung Wing-chung. All rights reserved.
Use of the software by a Apache License Version 2.0, that can be found in the LICENSE file.


# Credits

This software is forked from [Sunlight](http://sunlightjs.com/), by Tommy Montgomery.
The original Sunlight is licensed by the [WTFPL](http://www.wtfpl.net/about/) (warning: foul language inside).
