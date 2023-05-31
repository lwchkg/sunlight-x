// sunlight-x: Intelligent Syntax Highlighting, Modernized
// Copyright 2017 Leung Wing-chung. All rights reserved.
// Use of this source code is governed by a Apache License Version 2.0, that can
// be found in the LICENSE file.
export const logger = console;

/**
 * Log to warn about invalid values.
 * @param {string} message The message to log.
 */
export function warnInvalidValue(message: string, ...args: unknown[]) {
  logger.warn(`Sunlight-X: ${message} Given value(s): `, ...args);
}

/**
 * Log to warn about invalid values.
 * @param {string} message The message to log.
 */
export function error(message: string) {
  logger.warn(`Sunlight-X: ${message}`);
}

/**
 * Log to warn about invalid values.
 * @param {string} message The message to log.
 */
export function errorInvalidValue(message: string, ...args: unknown[]) {
  logger.warn(`Sunlight-X: ${message} Given value(s): `, ...args);
}