// @flow
import { DEFAULT_CLASS_PREFIX } from "./constants.js";

type SunlightOptionsMapType = { [string]: mixed };
type SunlightOptionsObjectType = {
  tabWidth: number,
  classPrefix: string,
  showWhitespace: boolean,
  maxHeight: false | string
};
export type SunlightOptionsType = SunlightOptionsMapType &
  SunlightOptionsObjectType;

type SunlightPartialOptionsObjectType = {
  tabWidth?: number,
  classPrefix?: string,
  showWhitespace?: boolean,
  maxHeight?: false | string
};
export type SunlightPartialOptionsType = SunlightOptionsMapType &
  SunlightPartialOptionsObjectType;

// Global sunlight variables. These can be added or modified by plugins.
export const globalOptions: SunlightOptionsType = {
  tabWidth: 4,
  classPrefix: DEFAULT_CLASS_PREFIX,
  showWhitespace: false,
  maxHeight: false
};
