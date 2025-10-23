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

import type { ThemeOptions } from "@mui/material/styles";

/**
 * Abzu Theme Configuration
 * Extends MUI's ThemeOptions to include custom application-specific properties
 */
export interface AbzuThemeConfig extends ThemeOptions {
  name: string;
  version: string;
  description?: string;
  author?: string;

  // Environment-specific configuration
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

  // Asset configuration
  assets?: {
    logo?: string;
    logoHeight?: {
      xs?: number;
      sm?: number;
      md?: number;
    };
    favicon?: string;
  };

  // Custom properties for application configuration
  customProperties?: Record<string, any>;
}

/**
 * Module augmentation to extend MUI's Theme interface
 * This allows TypeScript to recognize custom properties when using useTheme()
 */
declare module "@mui/material/styles" {
  interface Theme {
    // Theme metadata
    name: string;
    version: string;
    description?: string;
    author?: string;

    // Environment configuration
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

    // Asset configuration
    assets?: {
      logo?: string;
      logoHeight?: {
        xs?: number;
        sm?: number;
        md?: number;
      };
      favicon?: string;
    };

    // Custom properties
    customProperties?: Record<string, any>;
  }

  interface ThemeOptions {
    name?: string;
    version?: string;
    description?: string;
    author?: string;

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

    customProperties?: Record<string, any>;
  }

  // Add tertiary palette color
  interface Palette {
    tertiary?: PaletteColor;
  }

  interface PaletteOptions {
    tertiary?: PaletteColorOptions;
  }
}
