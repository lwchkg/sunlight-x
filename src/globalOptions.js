// @flow
import { DEFAULT_CLASS_PREFIX } from "./constants.js";

export type SunlightOptionsMapType = { [string]: mixed };
export type SunlightOptionsObjectType = {
  tabWidth: number,
  classPrefix: string,
  showWhitespace: boolean,
  maxHeight: false | number
};
export type SunlightOptionsType = SunlightOptionsMapType &
  SunlightOptionsObjectType;

// Global sunlight variables. These can be added or modified by plugins.
export const globalOptions: SunlightOptionsType = {
  tabWidth: 4,
  classPrefix: DEFAULT_CLASS_PREFIX,
  showWhitespace: false,
  maxHeight: false
};
