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

export interface AbzuThemeConfig {
  name: string;
  version: string;
  description?: string;
  author?: string;

  palette: {
    primary: {
      main: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    secondary: {
      main: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    tertiary?: {
      main: string;
      light?: string;
      dark?: string;
      contrastText?: string;
    };
    error?: {
      main: string;
      light?: string;
      dark?: string;
    };
    warning?: {
      main: string;
      light?: string;
      dark?: string;
    };
    info?: {
      main: string;
      light?: string;
      dark?: string;
    };
    success?: {
      main: string;
      light?: string;
      dark?: string;
    };
    background?: {
      default?: string;
      paper?: string;
    };
    text?: {
      primary?: string;
      secondary?: string;
      disabled?: string;
    };
  };

  typography?: {
    fontFamily?: string;
    h1?: {
      fontSize?: string;
      fontWeight?: number;
      lineHeight?: number;
    };
    h2?: {
      fontSize?: string;
      fontWeight?: number;
      lineHeight?: number;
    };
    h3?: {
      fontSize?: string;
      fontWeight?: number;
      lineHeight?: number;
    };
    h4?: {
      fontSize?: string;
      fontWeight?: number;
      lineHeight?: number;
    };
    h5?: {
      fontSize?: string;
      fontWeight?: number;
      lineHeight?: number;
    };
    h6?: {
      fontSize?: string;
      fontWeight?: number;
      lineHeight?: number;
    };
    body1?: {
      fontSize?: string;
      lineHeight?: number;
    };
    body2?: {
      fontSize?: string;
      lineHeight?: number;
    };
    button?: {
      textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
      fontWeight?: number;
    };
    caption?: {
      fontSize?: string;
      lineHeight?: number;
    };
  };

  shape?: {
    borderRadius?: number;
  };

  spacing?: number;

  breakpoints?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  environment?: {
    development?: {
      color: string;
      showBadge?: boolean;
      label?: string;
    };
    test?: {
      color: string;
      showBadge?: boolean;
      label?: string;
    };
    prod?: {
      color: string;
      showBadge?: boolean;
      label?: string;
    };
  };

  assets?: {
    logo?: string;
    logoHeight?: {
      xs?: number;
      sm?: number;
      md?: number;
    };
    favicon?: string;
  };

  components?: {
    MuiButton?: {
      borderRadius?: number;
      textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
      fontWeight?: number;
    };
    MuiCard?: {
      elevation?: number;
      borderRadius?: number;
    };
    MuiAppBar?: {
      elevation?: number;
    };
    MuiTextField?: {
      variant?: "outlined" | "filled" | "standard";
      borderRadius?: number;
    };
    // Add more component customizations as needed
  };

  customProperties?: Record<string, any>;
}

export interface ThemeVariantConfig {
  light?: {
    palette?: Partial<AbzuThemeConfig["palette"]>;
    typography?: Partial<AbzuThemeConfig["typography"]>;
    shape?: Partial<AbzuThemeConfig["shape"]>;
    spacing?: number;
    breakpoints?: Partial<AbzuThemeConfig["breakpoints"]>;
    components?: Partial<AbzuThemeConfig["components"]>;
    customProperties?: Record<string, any>;
  };
  dark?: {
    palette?: Partial<AbzuThemeConfig["palette"]>;
    typography?: Partial<AbzuThemeConfig["typography"]>;
    shape?: Partial<AbzuThemeConfig["shape"]>;
    spacing?: number;
    breakpoints?: Partial<AbzuThemeConfig["breakpoints"]>;
    components?: Partial<AbzuThemeConfig["components"]>;
    customProperties?: Record<string, any>;
  };
}

export interface EnvironmentColors {
  development: string;
  test: string;
  prod: string;
}

export type ThemeConfigValidationError = {
  field: string;
  message: string;
  value?: any;
};
