// @flow
import { DEFAULT_CLASS_PREFIX } from "./constants.js";

export type SunlightOptionsType = { [string]: number | string | boolean };
// Global sunlight variables. These can be added or modified by plugins.
export const globalOptions: SunlightOptionsType = {
  tabWidth: 4,
  classPrefix: DEFAULT_CLASS_PREFIX,
  showWhitespace: false,
  maxHeight: false
};
