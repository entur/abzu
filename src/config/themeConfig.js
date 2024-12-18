/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 the European Commission - subsequent versions of the EUPL (the "Licence");
 You may not use this work except in compliance with the Licence.
 You may obtain a copy of the Licence at:

 https://joinup.ec.europa.eu/software/page/eupl

 Unless required by applicable law or agreed to in writing, software
 distributed under the Licence is distributed on an "AS IS" basis,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the Licence for the specific language governing permissions and
 limitations under the Licence. */

import { getIn } from "../utils";
import {
  darkColor as defaultDarkColor,
  getEnvColor as defaultEnvColor,
  primary as defaultPrimary,
  primaryDarker as defaultPrimaryDarker,
  getTheme as getDefaultTheme,
  getV0Theme as getV0DefaultTheme,
} from "./themes/default/defaultTheme";
import defaultLogo from "./themes/default/logo.png";

export const getTiamatEnv = () => {
  return getIn(window, ["config", "tiamatEnv"], "development");
};

export const getEnvColor = (env) => {
  if (import.meta.env.VITE_THEME) {
    return require(
      "./themes/" + import.meta.env.VITE_THEME + "/index.js",
    ).getEnvColor(env);
  } else {
    return defaultEnvColor(env);
  }
};

export const getV0Theme = () => {
  if (import.meta.env.VITE_THEME) {
    return require(
      "./themes/" + import.meta.env.VITE_THEME + "/index.js",
    ).getV0Theme();
  } else {
    return getV0DefaultTheme();
  }
};

export const getTheme = () => {
  if (import.meta.env.VITE_THEME) {
    return require(
      "./themes/" + import.meta.env.VITE_THEME + "/index.js",
    ).getTheme();
  } else {
    return getDefaultTheme();
  }
};

export const getLogo = () => {
  if (import.meta.env.VITE_THEME) {
    return require("./themes/" + import.meta.env.VITE_THEME + "/logo.png")
      .default;
  } else {
    return defaultLogo;
  }
};

export const getPrimaryColor = () => {
  if (import.meta.env.VITE_THEME) {
    return require("./themes/" + import.meta.env.VITE_THEME + "/index.js")
      .primary;
  } else {
    return defaultPrimary;
  }
};

export const getHeaderColor = () => {
  if (import.meta.env.VITE_THEME) {
    return require("./themes/" + import.meta.env.VITE_THEME + "/index.js")
      .primary;
  } else {
    return defaultEnvColor;
  }
};

export const getDarkColor = () => {
  if (import.meta.env.VITE_THEME) {
    return require("./themes/" + import.meta.env.VITE_THEME + "/index.js")
      .darkColor;
  } else {
    return defaultDarkColor;
  }
};

export const getPrimaryDarkerColor = () => {
  if (import.meta.env.VITE_THEME) {
    return require("./themes/" + import.meta.env.VITE_THEME + "/index.js")
      .primaryDarker;
  } else {
    return defaultPrimaryDarker;
  }
};
