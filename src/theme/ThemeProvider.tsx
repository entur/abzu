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

import { CssBaseline } from "@mui/material";
import { ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getTiamatEnv } from "../config/themeConfig";
import { loadThemeConfig } from "./config/loader";
import { AbzuThemeConfig } from "./config/types";
import {
  createAbzuTheme,
  createAbzuThemeLegacy,
  Environment,
  ThemeVariant,
} from "./index";

interface ThemeContextType {
  themeVariant: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
  environment: Environment;
  themeConfig?: AbzuThemeConfig;
  isConfigLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultVariant?: ThemeVariant;
  useConfigFiles?: boolean;
}

export const AbzuThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultVariant = "light",
  useConfigFiles = true,
}) => {
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>(() => {
    // Check for saved theme preference
    const saved = localStorage.getItem("abzu-theme-variant");
    return (saved as ThemeVariant) || defaultVariant;
  });

  const [themeConfig, setThemeConfig] = useState<AbzuThemeConfig | undefined>(
    undefined,
  );
  const [isConfigLoaded, setIsConfigLoaded] = useState(!useConfigFiles);
  const [theme, setTheme] = useState<Theme | null>(null);

  const environment = getTiamatEnv() as Environment;

  // Load theme configuration on mount
  useEffect(() => {
    if (useConfigFiles) {
      loadThemeConfig()
        .then((config) => {
          setThemeConfig(config);
          setIsConfigLoaded(true);
        })
        .catch((error) => {
          console.warn(
            "Failed to load theme config, falling back to legacy theme:",
            error,
          );
          setIsConfigLoaded(true);
        });
    }
  }, [useConfigFiles]);

  // Create theme when config or variant changes
  useEffect(() => {
    if (isConfigLoaded) {
      if (themeConfig && useConfigFiles) {
        // Use new config-driven theme
        createAbzuTheme({
          variant: themeVariant,
          environment,
          config: themeConfig,
        })
          .then(setTheme)
          .catch((error) => {
            console.warn(
              "Failed to create config-driven theme, falling back to legacy:",
              error,
            );
            setTheme(
              createAbzuThemeLegacy({ variant: themeVariant, environment }),
            );
          });
      } else {
        // Fallback to legacy theme
        setTheme(createAbzuThemeLegacy({ variant: themeVariant, environment }));
      }
    }
  }, [themeVariant, environment, themeConfig, isConfigLoaded, useConfigFiles]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("abzu-theme-variant", themeVariant);
  }, [themeVariant]);

  const contextValue: ThemeContextType = {
    themeVariant,
    setThemeVariant,
    environment,
    themeConfig,
    isConfigLoaded,
  };

  // Show loading state while theme is being created
  if (!theme || !isConfigLoaded) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Roboto, sans-serif",
          color: "#666",
        }}
      >
        Loading theme...
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
