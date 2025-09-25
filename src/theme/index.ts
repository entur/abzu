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
import {
  convertConfigToThemeOptions,
  getEnvironmentOverrides,
} from "./config/converter";
import { createThemedConfig, loadThemeConfig } from "./config/loader";
import { AbzuThemeConfig } from "./config/types";

export type ThemeVariant = "light" | "dark";
export type Environment = "development" | "test" | "prod";

export interface AbzuThemeOptions {
  variant?: ThemeVariant;
  environment?: Environment;
  config?: AbzuThemeConfig;
}

// Cache for loaded theme config
let cachedThemeConfig: AbzuThemeConfig | null = null;

/**
 * Get theme configuration (cached)
 */
const getThemeConfig = async (): Promise<AbzuThemeConfig> => {
  if (!cachedThemeConfig) {
    cachedThemeConfig = await loadThemeConfig();
  }
  return cachedThemeConfig;
};

/**
 * Create Abzu theme from configuration
 */
export const createAbzuTheme = async (
  options: AbzuThemeOptions = {},
): Promise<Theme> => {
  const {
    variant = "light",
    environment = getTiamatEnv() as Environment,
    config,
  } = options;

  // Use provided config or load from files
  const baseConfig = config || (await getThemeConfig());

  // Apply variant-specific overrides
  const themedConfig = createThemedConfig(baseConfig, variant);

  // Convert config to MUI ThemeOptions
  const themeOptions = convertConfigToThemeOptions(themedConfig);

  // Create base theme
  let theme = createTheme(themeOptions);

  // Apply environment-specific overrides
  const environmentOverrides = getEnvironmentOverrides(
    themedConfig,
    environment,
  );
  if (Object.keys(environmentOverrides).length > 0) {
    theme = createTheme(theme, environmentOverrides);
  }

  return theme;
};

/**
 * Synchronous version for cases where config is already loaded
 */
export const createAbzuThemeSync = (
  options: AbzuThemeOptions & { config: AbzuThemeConfig },
): Theme => {
  const {
    variant = "light",
    environment = getTiamatEnv() as Environment,
    config,
  } = options;

  // Apply variant-specific overrides
  const themedConfig = createThemedConfig(config, variant);

  // Convert config to MUI ThemeOptions
  const themeOptions = convertConfigToThemeOptions(themedConfig);

  // Create base theme
  let theme = createTheme(themeOptions);

  // Apply environment-specific overrides
  const environmentOverrides = getEnvironmentOverrides(
    themedConfig,
    environment,
  );
  if (Object.keys(environmentOverrides).length > 0) {
    theme = createTheme(theme, environmentOverrides);
  }

  return theme;
};

/**
 * Legacy function for backward compatibility
 */
export const createAbzuThemeLegacy = (
  options: AbzuThemeOptions = {},
): Theme => {
  const { variant = "light", environment = getTiamatEnv() as Environment } =
    options;

  // Import legacy theme components
  const { baseTheme } = require("./base");
  const { lightTheme } = require("./variants/light");
  const { darkTheme } = require("./variants/dark");

  // Start with base theme
  let theme = createTheme(baseTheme);

  // Apply variant-specific overrides
  const variantTheme = variant === "dark" ? darkTheme : lightTheme;
  theme = createTheme(theme, variantTheme);

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
            "&::after":
              environment !== "prod"
                ? {
                    content: `"${environment.toUpperCase()}"`,
                    position: "absolute",
                    top: 8,
                    right: 16,
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "rgba(255, 255, 255, 0.8)",
                    textTransform: "uppercase",
                  }
                : undefined,
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

/**
 * Clear theme config cache (useful for development/testing)
 */
export const clearThemeConfigCache = (): void => {
  cachedThemeConfig = null;
};

export * from "./base";
export * from "./variants/dark";
export * from "./variants/light";
