import { $PropertyType } from "utility-types";
import { DEFAULT_CLASS_PREFIX } from "./constants";
export type SunlightOptionsType = {
  theme: string;
  tabWidth: number;
  classPrefix: string;
  showWhitespace: boolean;
  maxHeight: false | string;
  enableScalaXmlInterpolation: boolean;
  [key: string]: unknown;
};
export type SunlightPartialOptionsType = {
  theme?: $PropertyType<SunlightOptionsType, "theme">;
  tabWidth?: $PropertyType<SunlightOptionsType, "tabWidth">;
  classPrefix?: $PropertyType<SunlightOptionsType, "classPrefix">;
  showWhitespace?: $PropertyType<SunlightOptionsType, "showWhitespace">;
  maxHeight?: $PropertyType<SunlightOptionsType, "maxHeight">;
  enableScalaXmlInterpolation?: $PropertyType<SunlightOptionsType, "enableScalaXmlInterpolation">;
  [key: string]: unknown;
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