// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.

const events = {
  beforeHighlightNode: [],
  beforeHighlight: [],
  beforeTokenize: [],
  afterTokenize: [],
  beforeAnalyze: [],
  afterAnalyze: [],
  afterHighlight: [],
  afterHighlightNode: [],
};

/**
 * Bind a callback function to a event.
 * @param {string} event
 * @param {highlightCallback} callback
 */
export function bind(event, callback) {
  if (!events[event])
    throw new Error('Unknown event "' + event + '"');
  events[event].push(callback);
}

/**
 * Fire an event.
 * @param {string} eventName
 * @param {Object} highlighter
 * @param {Object} eventContext
 */
export function fireEvent(eventName, highlighter, eventContext) {
  const delegates = events[eventName] || [];

  for (let i = 0; i < delegates.length; i++)
    delegates[i](highlighter, eventContext);
}

/**
 * Callback
 * @callback requestCallback
 * @param {Object} highlighter
 * @param {Object} eventContext
 */
