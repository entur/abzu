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

import { getFetchedConfig } from "../../config/fetchConfig";
import defaultThemeConfig from "./default-theme.json";
import themeVariantsConfig from "./theme-variants-config.json";
import {
  AbzuThemeConfig,
  ThemeConfigValidationError,
  ThemeVariantConfig,
} from "./types";

/**
 * Deep merge utility for theme configurations
 */
const deepMerge = (target: any, source: any): any => {
  const result = { ...target };

  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
};

/**
 * Validate theme configuration structure
 */
export const validateThemeConfig = (
  config: any,
): ThemeConfigValidationError[] => {
  const errors: ThemeConfigValidationError[] = [];

  // Required fields
  if (!config.name) {
    errors.push({ field: "name", message: "Theme name is required" });
  }
  if (!config.version) {
    errors.push({ field: "version", message: "Theme version is required" });
  }
  if (!config.palette) {
    errors.push({
      field: "palette",
      message: "Palette configuration is required",
    });
  }

  // Validate palette structure
  if (config.palette) {
    if (!config.palette.primary?.main) {
      errors.push({
        field: "palette.primary.main",
        message: "Primary color is required",
      });
    }
    if (!config.palette.secondary?.main) {
      errors.push({
        field: "palette.secondary.main",
        message: "Secondary color is required",
      });
    }

    // Validate color format (hex colors)
    const validateColor = (path: string, color: string) => {
      if (
        color &&
        !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|rgba?\([^)]+\))/.test(color)
      ) {
        errors.push({
          field: path,
          message: "Invalid color format. Use hex (#RRGGBB) or rgba() format",
          value: color,
        });
      }
    };

    // Validate main colors
    if (config.palette.primary?.main)
      validateColor("palette.primary.main", config.palette.primary.main);
    if (config.palette.secondary?.main)
      validateColor("palette.secondary.main", config.palette.secondary.main);
    if (config.palette.tertiary?.main)
      validateColor("palette.tertiary.main", config.palette.tertiary.main);
  }

  // Validate breakpoints
  if (config.breakpoints) {
    const breakpointOrder = ["xs", "sm", "md", "lg", "xl"];
    for (let i = 0; i < breakpointOrder.length - 1; i++) {
      const current = config.breakpoints[breakpointOrder[i]];
      const next = config.breakpoints[breakpointOrder[i + 1]];
      if (current && next && current >= next) {
        errors.push({
          field: `breakpoints.${breakpointOrder[i + 1]}`,
          message: `Breakpoint must be larger than ${breakpointOrder[i]} (${current})`,
          value: next,
        });
      }
    }
  }

  return errors;
};

/**
 * Available theme configurations
 */
export interface AvailableTheme {
  id: string;
  name: string;
  description: string;
  path: string;
}

/**
 * Get list of available themes
 */
export const getAvailableThemes = (): AvailableTheme[] => {
  return [
    {
      id: "default",
      name: "Default Theme",
      description: "Neutral Material Design theme",
      path: "src/theme/config/default-theme.json",
    },
    {
      id: "entur",
      name: "Entur Theme",
      description: "Entur branded theme",
      path: "src/theme/config/entur-theme.json",
    },
    {
      id: "custom",
      name: "Custom Theme",
      description: "Example custom theme",
      path: "src/theme/config/custom-theme-example.json",
    },
  ];
};

/**
 * Load a specific theme configuration by ID or path
 */
export const loadSpecificThemeConfig = async (
  themeIdOrPath: string,
): Promise<AbzuThemeConfig> => {
  try {
    let themePath: string;

    // Check if it's a theme ID
    const availableThemes = getAvailableThemes();
    const themeById = availableThemes.find((t) => t.id === themeIdOrPath);

    if (themeById) {
      themePath = themeById.path;
    } else {
      themePath = themeIdOrPath;
    }

    console.log(`Loading theme config from: ${themePath}`);

    // Fetch the theme config JSON file
    const response = await fetch(`${import.meta.env.BASE_URL}${themePath}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch theme config: ${response.status} ${response.statusText}`,
      );
    }

    const config = await response.json();

    // Validate configuration
    const validationErrors = validateThemeConfig(config);
    if (validationErrors.length > 0) {
      console.warn("Theme configuration validation errors:", validationErrors);
      if (import.meta.env.DEV) {
        console.error("Theme validation failed:", validationErrors);
      }
    }

    console.log("Successfully loaded theme config:", config.name);
    return config;
  } catch (error) {
    console.error("Failed to load specific theme configuration:", error);
    throw error;
  }
};

/**
 * Load and validate theme configuration
 */
export const loadThemeConfig = async (): Promise<AbzuThemeConfig> => {
  try {
    let config: AbzuThemeConfig;

    const appConfig = getFetchedConfig();
    const themeConfigPath = appConfig?.themeConfig;

    if (themeConfigPath) {
      try {
        config = await loadSpecificThemeConfig(themeConfigPath);
      } catch (error) {
        console.warn(
          "Failed to load custom theme config, falling back to default",
          error,
        );
        config = defaultThemeConfig as AbzuThemeConfig;
      }
    } else {
      console.warn("No theme config path found, using default");
      config = defaultThemeConfig as AbzuThemeConfig;
    }

    return config;
  } catch (error) {
    console.error("Failed to load theme configuration:", error);
    // Fallback to default configuration
    return defaultThemeConfig as AbzuThemeConfig;
  }
};

/**
 * Get theme variant configuration
 */
export const getThemeVariantConfig = (
  variant: "light" | "dark",
): Partial<AbzuThemeConfig> => {
  const variants = themeVariantsConfig as unknown as ThemeVariantConfig;
  return (variants[variant] || {}) as Partial<AbzuThemeConfig>;
};

/**
 * Merge base theme config with variant-specific overrides
 */
export const createThemedConfig = (
  baseConfig: AbzuThemeConfig,
  variant: "light" | "dark",
): AbzuThemeConfig => {
  const variantConfig = getThemeVariantConfig(variant);
  return deepMerge(baseConfig, variantConfig) as AbzuThemeConfig;
};

/**
 * Load theme configuration for a specific environment
 */
export const loadEnvironmentThemeConfig = async (
  environment?: string,
): Promise<AbzuThemeConfig> => {
  const baseConfig = await loadThemeConfig();

  // Apply environment-specific overrides if needed
  if (
    environment &&
    baseConfig.environment?.[environment as keyof typeof baseConfig.environment]
  ) {
    const envConfig =
      baseConfig.environment[
        environment as keyof typeof baseConfig.environment
      ];
    if (envConfig) {
      return deepMerge(baseConfig, {
        palette: {
          primary: {
            main: envConfig.color,
          },
        },
      });
    }
  }

  return baseConfig;
};
