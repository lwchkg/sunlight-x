// @flow
import { DEFAULT_CLASS_PREFIX } from "./constants.js";

type SunlightOptionsMapType = { [string]: mixed };
type SunlightOptionsObjectType = {
  theme: string,
  tabWidth: number,
  classPrefix: string,
  showWhitespace: boolean,
  maxHeight: false | string,
  enableScalaXmlInterpolation: boolean
};
export type SunlightOptionsType = SunlightOptionsMapType &
  SunlightOptionsObjectType;

type SunlightPartialOptionsObjectType = {
  theme?: $PropertyType<SunlightOptionsObjectType, "theme">,
  tabWidth?: $PropertyType<SunlightOptionsObjectType, "tabWidth">,
  classPrefix?: $PropertyType<SunlightOptionsObjectType, "classPrefix">,
  showWhitespace?: $PropertyType<SunlightOptionsObjectType, "showWhitespace">,
  maxHeight?: $PropertyType<SunlightOptionsObjectType, "maxHeight">
};
export type SunlightPartialOptionsType = SunlightOptionsMapType &
  SunlightPartialOptionsObjectType;

// Global sunlight variables. These can be added or modified by plugins.
export const globalOptions: SunlightOptionsType = {
  theme: "gitbook",
  tabWidth: 4,
  classPrefix: DEFAULT_CLASS_PREFIX,
  showWhitespace: false,
  maxHeight: false,
  enableScalaXmlInterpolation: false
};
