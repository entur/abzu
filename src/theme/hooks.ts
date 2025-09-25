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

import { useTheme as useMuiTheme } from "@mui/material/styles";
import { useResponsive } from "./utils";

/**
 * Hook to access the current MUI theme with Abzu extensions
 */
export const useAbzuTheme = () => {
  const theme = useMuiTheme();
  const responsive = useResponsive();

  return {
    theme,
    ...responsive,
    spacing: theme.spacing,
    breakpoints: theme.breakpoints,
    palette: theme.palette,
    typography: theme.typography,
    components: theme.components,
  };
};

/**
 * Hook to get environment-specific styling
 */
export const useEnvironmentStyles = () => {
  const environment = (window as any).config?.tiamatEnv || "development";

  const getEnvironmentColor = () => {
    switch (environment.toLowerCase()) {
      case "development":
        return "#457645";
      case "test":
        return "#d18e25";
      case "prod":
      default:
        return "#181C56";
    }
  };

  const getEnvironmentBadge = () => {
    if (environment === "prod") return null;

    return {
      content: environment.toUpperCase(),
      backgroundColor: getEnvironmentColor(),
      color: "white",
      fontSize: "0.75rem",
      fontWeight: 500,
      padding: "2px 6px",
      borderRadius: "4px",
      textTransform: "uppercase" as const,
    };
  };

  return {
    environment,
    environmentColor: getEnvironmentColor(),
    environmentBadge: getEnvironmentBadge(),
    isProduction: environment === "prod",
    isDevelopment: environment === "development",
    isTest: environment === "test",
  };
};

/**
 * Hook for consistent spacing across the application
 */
export const useSpacing = () => {
  const theme = useMuiTheme();
  const { isMobile, isTablet } = useResponsive();

  return {
    // Basic spacing units
    xs: theme.spacing(0.5),
    sm: theme.spacing(1),
    md: theme.spacing(2),
    lg: theme.spacing(3),
    xl: theme.spacing(4),
    xxl: theme.spacing(6),

    // Responsive spacing
    responsive: {
      padding: {
        container: isMobile
          ? theme.spacing(2)
          : isTablet
            ? theme.spacing(3)
            : theme.spacing(4),
        section: isMobile ? theme.spacing(3) : theme.spacing(4),
        card: isMobile ? theme.spacing(2) : theme.spacing(3),
      },
      margin: {
        section: isMobile ? theme.spacing(2) : theme.spacing(3),
        component: isMobile ? theme.spacing(1) : theme.spacing(2),
      },
      gap: {
        items: isMobile ? theme.spacing(1) : theme.spacing(2),
        sections: isMobile ? theme.spacing(2) : theme.spacing(3),
      },
    },
  };
};

/**
 * Hook for consistent elevation/shadow styles
 */
export const useElevation = () => {
  const theme = useMuiTheme();

  return {
    none: "none",
    low: theme.shadows[1],
    medium: theme.shadows[4],
    high: theme.shadows[8],
    highest: theme.shadows[12],
  };
};
