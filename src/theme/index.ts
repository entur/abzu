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

import { createTheme, Theme } from "@mui/material/styles";
import { getTiamatEnv } from "../config/themeConfig";

export type Environment = "development" | "test" | "prod";

export interface AbzuThemeOptions {
  environment?: Environment;
}

/**
 * Legacy function for backward compatibility with old UI
 * Used only by legacy components that don't use theme config files
 */
export const createAbzuThemeLegacy = (
  options: AbzuThemeOptions = {},
): Theme => {
  const { environment = getTiamatEnv() as Environment } = options;

  // Import legacy theme components
  const { baseTheme } = require("./base");
  const { lightTheme } = require("./variants/light");

  // Start with base theme
  let theme = createTheme(baseTheme);

  // Apply light theme overrides
  theme = createTheme(theme, lightTheme);

  // Apply environment-specific overrides
  theme = createTheme(theme, {
    palette: {
      primary: {
        ...theme.palette.primary,
        main: getEnvironmentColorLegacy(environment),
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: getEnvironmentColorLegacy(environment),
          },
        },
      },
    },
  });

  return theme;
};

const getEnvironmentColorLegacy = (env: Environment): string => {
  switch (env.toLowerCase()) {
    case "development":
      return "#457645";
    case "test":
      return "#d18e25";
    case "prod":
    default:
      return "#181C56";
  }
};

// Export theme components for legacy use
export * from "./base";
export * from "./components";
export * from "./variants/light";

// Export new theme system
export { createThemeFromConfig } from "./config/createThemeFromConfig";
export { loadThemeConfig } from "./config/loader";
export type { AbzuThemeConfig } from "./config/theme-config";
