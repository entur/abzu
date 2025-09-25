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
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getTiamatEnv } from "../config/themeConfig";
import { createAbzuTheme, Environment, ThemeVariant } from "./index";

interface ThemeContextType {
  themeVariant: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
  environment: Environment;
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
}

export const AbzuThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultVariant = "light",
}) => {
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>(() => {
    // Check for saved theme preference
    const saved = localStorage.getItem("abzu-theme-variant");
    return (saved as ThemeVariant) || defaultVariant;
  });

  const environment = getTiamatEnv() as Environment;

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("abzu-theme-variant", themeVariant);
  }, [themeVariant]);

  const theme = createAbzuTheme({
    variant: themeVariant,
    environment,
  });

  const contextValue: ThemeContextType = {
    themeVariant,
    setThemeVariant,
    environment,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
