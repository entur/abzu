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

import { ThemeOptions } from "@mui/material/styles";
import { AbzuThemeConfig } from "./types";

/**
 * Convert AbzuThemeConfig to MUI ThemeOptions
 */
export const convertConfigToThemeOptions = (
  config: AbzuThemeConfig,
): ThemeOptions => {
  const themeOptions: ThemeOptions = {};

  // Convert palette - only assign defined properties
  if (config.palette) {
    themeOptions.palette = {};

    if (config.palette.primary)
      themeOptions.palette.primary = config.palette.primary;
    if (config.palette.secondary)
      themeOptions.palette.secondary = config.palette.secondary;
    if (config.palette.error) themeOptions.palette.error = config.palette.error;
    if (config.palette.warning)
      themeOptions.palette.warning = config.palette.warning;
    if (config.palette.info) themeOptions.palette.info = config.palette.info;
    if (config.palette.success)
      themeOptions.palette.success = config.palette.success;
    if (config.palette.background)
      themeOptions.palette.background = config.palette.background;
    if (config.palette.text) themeOptions.palette.text = config.palette.text;

    // Add custom palette properties if needed
    if (config.palette.tertiary) {
      (themeOptions.palette as any).tertiary = config.palette.tertiary;
    }
  }

  // Convert typography
  if (config.typography) {
    themeOptions.typography = {
      fontFamily: config.typography.fontFamily,
      h1: config.typography.h1,
      h2: config.typography.h2,
      h3: config.typography.h3,
      h4: config.typography.h4,
      h5: config.typography.h5,
      h6: config.typography.h6,
      body1: config.typography.body1,
      body2: config.typography.body2,
      button: config.typography.button,
      caption: config.typography.caption,
    };
  }

  // Convert shape
  if (config.shape) {
    themeOptions.shape = {
      borderRadius: config.shape.borderRadius || 8,
    };
  }

  // Convert spacing
  if (config.spacing) {
    themeOptions.spacing = config.spacing;
  }

  // Convert breakpoints
  if (config.breakpoints) {
    themeOptions.breakpoints = {
      values: {
        xs: config.breakpoints.xs || 0,
        sm: config.breakpoints.sm || 600,
        md: config.breakpoints.md || 900,
        lg: config.breakpoints.lg || 1200,
        xl: config.breakpoints.xl || 1536,
      },
    };
  }

  // Convert component overrides
  if (config.components) {
    themeOptions.components = {};

    // Convert MuiButton overrides
    if (config.components.MuiButton) {
      themeOptions.components.MuiButton = {
        styleOverrides: {
          root: {
            borderRadius: config.components.MuiButton.borderRadius,
            textTransform: config.components.MuiButton.textTransform,
            fontWeight: config.components.MuiButton.fontWeight,
            boxShadow: "none",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
            },
          },
          contained: {
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
            },
          },
        },
      };
    }

    // Convert MuiCard overrides
    if (config.components.MuiCard) {
      const shadowMap = {
        1: "0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)",
        2: "0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)",
        3: "0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)",
      };

      themeOptions.components.MuiCard = {
        styleOverrides: {
          root: {
            borderRadius: config.components.MuiCard.borderRadius,
            boxShadow:
              shadowMap[
                config.components.MuiCard.elevation as keyof typeof shadowMap
              ] || shadowMap[1],
            "&:hover": {
              boxShadow: shadowMap[2],
            },
          },
        },
      };
    }

    // Convert MuiAppBar overrides
    if (config.components.MuiAppBar) {
      themeOptions.components.MuiAppBar = {
        styleOverrides: {
          root: {
            boxShadow: config.components.MuiAppBar.elevation
              ? `0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)`
              : "none",
          },
        },
      };
    }

    // Convert MuiTextField overrides
    if (config.components.MuiTextField) {
      themeOptions.components.MuiTextField = {
        defaultProps: {
          variant: config.components.MuiTextField.variant || "outlined",
        },
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: config.components.MuiTextField.borderRadius || 8,
            },
          },
        },
      };
    }
  }

  // Add base component styles that are always applied
  themeOptions.components = {
    ...themeOptions.components,
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#959595",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#2b2b2b",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow:
            "0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)",
        },
        elevation2: {
          boxShadow:
            "0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: config.shape?.borderRadius || 8,
          minWidth: 200,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: "2px 8px",
          "&:hover": {
            borderRadius: 4,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: config.shape?.borderRadius || 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiSnackbarContent-root": {
            borderRadius: config.shape?.borderRadius || 8,
          },
        },
      },
    },
  };

  return themeOptions;
};

/**
 * Get environment-specific overrides from config
 * NOTE: Environment colors should ONLY affect the environment badge,
 * NOT the theme's primary color or AppBar background
 */
export const getEnvironmentOverrides = (
  config: AbzuThemeConfig,
  environment: string,
): ThemeOptions => {
  // Environment colors are now only used by useEnvironmentStyles hook
  // for the environment badge. No theme overrides should be applied.
  return {};
};

/**
 * Convert custom properties to CSS variables
 */
export const generateCSSVariables = (
  config: AbzuThemeConfig,
): Record<string, string> => {
  const cssVars: Record<string, string> = {};

  if (config.customProperties) {
    Object.entries(config.customProperties).forEach(([key, value]) => {
      // Convert camelCase to kebab-case and add CSS variable prefix
      const cssVarName = `--abzu-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      cssVars[cssVarName] = typeof value === "number" ? `${value}px` : value;
    });
  }

  // Add palette colors as CSS variables
  if (config.palette) {
    if (config.palette.primary?.main) {
      cssVars["--abzu-primary-main"] = config.palette.primary.main;
    }
    if (config.palette.secondary?.main) {
      cssVars["--abzu-secondary-main"] = config.palette.secondary.main;
    }
    if (config.palette.tertiary?.main) {
      cssVars["--abzu-tertiary-main"] = config.palette.tertiary.main;
    }
  }

  return cssVars;
};
