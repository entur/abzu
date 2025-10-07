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
  defaultVariant?: ThemeVariant;
  useConfigFiles?: boolean;
}

export const AbzuThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultVariant = "light",
  useConfigFiles = true, // Re-enable new theme system
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

      // Get available themes from config or use defaults
      const defaultThemes = [
        "src/theme/config/default-theme.json",
        "src/theme/config/entur-theme.json",
        "src/theme/config/custom-theme-example.json",
      ];
      setAvailableThemes(defaultThemes);

      // Determine which theme to load
      const themeToLoad = savedThemePath || undefined;

      if (themeToLoad && defaultThemes.includes(themeToLoad)) {
        // Load saved custom theme
        loadThemeFromPath(themeToLoad)
          .then(() => setIsConfigLoaded(true))
          .catch((error) => {
            console.warn("Failed to load saved theme, using default:", error);
            loadThemeConfig()
              .then((config) => {
                setThemeConfig(config);
                setCurrentThemeName(config.name);
                setIsConfigLoaded(true);
              })
              .catch(() => setIsConfigLoaded(true));
          });
      } else {
        // Load from environment config
        loadThemeConfig()
          .then((config) => {
            setThemeConfig(config);
            setCurrentThemeName(config.name);
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
