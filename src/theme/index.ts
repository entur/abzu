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
import { baseTheme } from "./base";
import { darkTheme } from "./variants/dark";
import { lightTheme } from "./variants/light";

export type ThemeVariant = "light" | "dark";
export type Environment = "development" | "test" | "prod";

export interface AbzuThemeOptions {
  variant?: ThemeVariant;
  environment?: Environment;
}

export const createAbzuTheme = (options: AbzuThemeOptions = {}): Theme => {
  const { variant = "light", environment = getTiamatEnv() as Environment } =
    options;

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
        main: getEnvironmentColor(environment),
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: getEnvironmentColor(environment),
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

const getEnvironmentColor = (env: Environment): string => {
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

export * from "./base";
export * from "./variants/dark";
export * from "./variants/light";
