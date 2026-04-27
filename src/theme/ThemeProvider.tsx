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
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
  Theme,
} from "@mui/material/styles";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getFetchedConfig } from "../config/fetchConfig";
import { getTiamatEnv } from "../config/themeConfig";
import { createThemeFromConfig } from "./config/createThemeFromConfig";
import { AbzuThemeConfig } from "./config/theme-config";
import { createAbzuThemeLegacy, Environment } from "./index";

interface ThemeContextType {
  environment: Environment;
  themeConfig?: AbzuThemeConfig;
  isConfigLoaded: boolean;
  availableThemes: string[];
  currentThemeName: string;
  switchThemeConfig: (themePath: string) => Promise<void>;
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
  useConfigFiles?: boolean;
}

export const AbzuThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  useConfigFiles = true, // Use new theme system by default
}) => {
  const [themeConfig, setThemeConfig] = useState<AbzuThemeConfig | undefined>(
    undefined,
  );
  const [isConfigLoaded, setIsConfigLoaded] = useState(!useConfigFiles);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [availableThemes, setAvailableThemes] = useState<string[]>([]);
  const [currentThemeName, setCurrentThemeName] = useState<string>("");
  const [currentThemePath, setCurrentThemePath] = useState<string>("");

  const environment = getTiamatEnv() as Environment;

  // Load theme configuration helper
  const loadThemeFromPath = async (themePath: string) => {
    try {
      console.log(`Loading theme config from: ${themePath}`);
      const response = await fetch(`${import.meta.env.BASE_URL}${themePath}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch theme config: ${response.status} ${response.statusText}`,
        );
      }

      const config = await response.json();
      console.log("Successfully loaded theme config:", config.name);

      setThemeConfig(config);
      setCurrentThemeName(config.name);
      setCurrentThemePath(themePath);

      // Save the selected theme to localStorage
      localStorage.setItem("abzu-selected-theme", themePath);

      return config;
    } catch (error) {
      console.error("Failed to load theme from path:", themePath, error);
      throw error;
    }
  };

  // Switch theme configuration dynamically
  const switchThemeConfig = async (themePath: string) => {
    try {
      await loadThemeFromPath(themePath);
    } catch (error) {
      console.error("Failed to switch theme:", error);
    }
  };

  // Load theme configuration on mount
  useEffect(() => {
    if (useConfigFiles) {
      // Check for saved theme selection
      const savedThemePath = localStorage.getItem("abzu-selected-theme");

      // Get available themes from bootstrap.json config
      const appConfig = getFetchedConfig();
      let configuredThemes: string[] = [];

      // Priority: use themeConfigs array if present
      if (appConfig?.themeConfigs && appConfig.themeConfigs.length > 0) {
        configuredThemes = appConfig.themeConfigs;
      }
      // Fallback: use old singular themeConfig field for backward compatibility
      else if (appConfig?.themeConfig) {
        configuredThemes = [appConfig.themeConfig];
      }
      // If no themes configured, use empty array (will trigger standard MUI theme)

      setAvailableThemes(configuredThemes);

      // Validate theme paths and log warnings
      configuredThemes.forEach((themePath) => {
        if (!themePath || typeof themePath !== "string") {
          console.error(
            `Invalid theme path in bootstrap.json themeConfigs: ${themePath}`,
          );
        }
      });

      // Default theme is the first in the array
      const defaultTheme = configuredThemes[0];

      // Validate saved theme still exists in config
      const themeToLoad =
        savedThemePath && configuredThemes.includes(savedThemePath)
          ? savedThemePath
          : defaultTheme;

      if (themeToLoad) {
        // Load the selected theme
        loadThemeFromPath(themeToLoad)
          .then(() => setIsConfigLoaded(true))
          .catch((error) => {
            console.error("Failed to load theme, using fallback:", error);
            setIsConfigLoaded(true);
          });
      } else {
        // No themes configured - use standard MUI theme
        console.log(
          "No themes configured in bootstrap.json, using standard MUI theme",
        );
        setIsConfigLoaded(true);
      }
    }
  }, [useConfigFiles]);

  // Create theme when config changes
  useEffect(() => {
    if (isConfigLoaded) {
      if (themeConfig && useConfigFiles) {
        // Use new simplified config-driven theme
        try {
          const newTheme = createThemeFromConfig(themeConfig);
          setTheme(newTheme);
        } catch (error) {
          console.warn(
            "Failed to create config-driven theme, falling back to standard MUI:",
            error,
          );
          setTheme(createTheme());
        }
      } else if (useConfigFiles && availableThemes.length === 0) {
        // No themes configured - use standard MUI theme
        console.log("Using standard MUI theme (no custom themes configured)");
        setTheme(createTheme());
      } else {
        // Fallback to legacy theme
        setTheme(createAbzuThemeLegacy({ environment }));
      }
    }
  }, [
    environment,
    themeConfig,
    isConfigLoaded,
    useConfigFiles,
    availableThemes,
  ]);

  const contextValue: ThemeContextType = {
    environment,
    themeConfig,
    isConfigLoaded,
    availableThemes,
    currentThemeName,
    switchThemeConfig,
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
