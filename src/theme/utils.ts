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

import { useMediaQuery, useTheme as useMuiTheme } from "@mui/material";
import { Breakpoint, Theme } from "@mui/material/styles";

/**
 * Hook to check if current viewport matches a breakpoint
 */
export const useResponsive = () => {
  const theme = useMuiTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
  };
};

/**
 * Get responsive spacing based on breakpoint
 */
export const getResponsiveSpacing = (theme: Theme) => ({
  xs: theme.spacing(1),
  sm: theme.spacing(2),
  md: theme.spacing(3),
  lg: theme.spacing(4),
  xl: theme.spacing(6),
});

/**
 * Get responsive padding based on screen size
 */
export const getResponsivePadding = (theme: Theme) => ({
  mobile: theme.spacing(2),
  tablet: theme.spacing(3),
  desktop: theme.spacing(4),
});

/**
 * Common responsive breakpoints for sx prop
 */
export const responsiveBreakpoints = {
  mobile: "xs",
  tablet: "sm",
  desktop: "lg",
} as const;

/**
 * Helper function to create responsive values
 * Usage: responsiveValue({ xs: 12, sm: 6, lg: 4 })
 */
export const responsiveValue = (values: Partial<Record<Breakpoint, any>>) =>
  values;

/**
 * Common responsive typography variants
 */
export const responsiveTypography = {
  pageTitle: {
    fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
    fontWeight: { xs: 400, sm: 300 },
    lineHeight: 1.2,
  },
  sectionTitle: {
    fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
    fontWeight: 400,
    lineHeight: 1.3,
  },
  cardTitle: {
    fontSize: { xs: "1rem", sm: "1.125rem" },
    fontWeight: 500,
    lineHeight: 1.4,
  },
};

/**
 * Common responsive container widths
 */
export const responsiveContainer = {
  maxWidth: { xs: "100%", sm: "sm", md: "md", lg: "lg", xl: "xl" },
  px: { xs: 2, sm: 3, md: 4 },
};

/**
 * Helper for creating responsive menu widths
 */
export const getResponsiveMenuWidth = () => ({
  xs: "100vw",
  sm: 300,
  md: 350,
  lg: 400,
});

/**
 * Helper for responsive button sizes
 */
export const responsiveButtonSize = {
  small: { xs: "small", sm: "medium" },
  medium: { xs: "medium", sm: "large" },
  large: { xs: "large", sm: "large" },
} as const;
