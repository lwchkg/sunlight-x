// @flow
import { DEFAULT_CLASS_PREFIX } from "./constants.js";

export type SunlightOptionsType = {
  theme: string,
  tabWidth: number,
  classPrefix: string,
  showWhitespace: boolean,
  maxHeight: false | string,
  enableScalaXmlInterpolation: boolean,
  [string]: mixed
};

export type SunlightPartialOptionsType = {
  theme?: $PropertyType<SunlightOptionsType, "theme">,
  tabWidth?: $PropertyType<SunlightOptionsType, "tabWidth">,
  classPrefix?: $PropertyType<SunlightOptionsType, "classPrefix">,
  showWhitespace?: $PropertyType<SunlightOptionsType, "showWhitespace">,
  maxHeight?: $PropertyType<SunlightOptionsType, "maxHeight">,
  enableScalaXmlInterpolation?: $PropertyType<
    SunlightOptionsType,
    "enableScalaXmlInterpolation"
  >,
  [string]: mixed
};

// Global sunlight variables. These can be added or modified by plugins.
export const globalOptions: SunlightOptionsType = {
  theme: "gitbook",
  tabWidth: 4,
  classPrefix: DEFAULT_CLASS_PREFIX,
  showWhitespace: false,
  maxHeight: false,
  enableScalaXmlInterpolation: false
};
