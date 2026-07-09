import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import React from "react";
import { getTiamatEnv } from "../../../config/themeConfig";
import type { Environment } from "../../../theme";
import { ThemeContext } from "../../../theme/ThemeProvider";
import { getTheme } from "./theme";

const muiTheme = createTheme(getTheme());

export const FintrafficThemeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const environment = getTiamatEnv() as Environment;

  const contextValue = {
    environment,
    themeConfig: undefined,
    isConfigLoaded: true,
    availableThemes: [],
    currentThemeName: "fintraffic",
    switchThemeConfig: async () => {},
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
