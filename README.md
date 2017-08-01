# sunlight-x: Intelligent Syntax Highlighting, Modernized

[![Build Status](https://travis-ci.org/lwchkg/sunlight-x.svg?branch=master)](https://travis-ci.org/lwchkg/sunlight-x)
[![Build status](https://ci.appveyor.com/api/projects/status/ilr6lbjngs8x5abg?svg=true)](https://ci.appveyor.com/project/lwchkg/sunlight-x)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d34cdc3875a94bafb62c822ba120b4cd)](https://www.codacy.com/app/lwchkg/sunlight-x?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=lwchkg/sunlight-x&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/d34cdc3875a94bafb62c822ba120b4cd)](https://www.codacy.com/app/lwchkg/sunlight-x?utm_source=github.com&utm_medium=referral&utm_content=lwchkg/sunlight-x&utm_campaign=Badge_Coverage)

Sunlight highlighter modernized for node.js.
While the highlighter can be run, it is still a WIP.


# Features

- Relatively accurate highlighting for some languages.
  This is mainly done with a context-aware highlighting facility (at the expense of more complex language modules).
  In particular, "named identifiers" are supported in addition to normal identifiers.
- Use multiple themes at the same time.
- Line numbering.
- Line highlighting.


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
  - Sunlight.\*
  - Sunlight.Highlighter.\*
  - Add API for theme selection
  - Add API for getting the path and/or content of CSS files (and LESS files?).
- Add more tests.
- Webpack for browsers
- Clarify owners of code snippets (some unknown code are used now).
  - Others are listed in the code snippets folder.
- Refactors.
- Modernize the languages being highlighted.
- Rewrite number parsers.


# How to contribute

- Start an issue, and write down your ideas there.
- Give ideas on the API.
- Add tests, contribute test snippets.


# Copyright

Copyright 2017 Leung Wing-chung. All rights reserved.
Use of the software by a Apache License Version 2.0, that can be found in the LICENSE file.


# Credits

This software is forked from [Sunlight](http://sunlightjs.com/), authored by Tommy Montgomery.
The original Sunlight is licensed by the [WTFPL](http://www.wtfpl.net/about/) (warning: foul language inside).
