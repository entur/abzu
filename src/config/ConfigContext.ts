import { OidcClientSettings } from "oidc-client-ts";
import React, { useContext } from "react";
import { FeatureFlags } from "./FeatureFlags";

export interface Config {
  tiamatBaseUrl?: string;
  baatTokenProxyEndpoint?: string;
  sentryDSN?: string;
  googleApiKey?: string;
  tiamatEnv?: string;
  preferredNameNamespace?: string;
  claimsNamespace?: string;
  oidcConfig?: OidcClientSettings;
  featureFlags?: FeatureFlags;
  mapConfig?: MapConfig;
  localeConfig?: LocaleConfig;
  /**
   * Path to folder inder /ext that contains features or assets of a company that adopted NSR.
   * This is used e.g. for:
   *    CustomStyle, when determining the relevant custom style class;
   *    CustomLogo;
   */
  extPath?: string;
  /**
   * Path to theme configuration file (e.g., "src/theme/config/custom-theme-example.json")
   * @deprecated Use themeConfigs array instead for multi-theme support
   */
  themeConfig?: string;
  /**
   * Array of theme configuration file paths.
   * First theme in array is the default theme.
   * If only one theme provided, theme switcher will be hidden.
   * If empty or missing, standard MUI theme is used.
   */
  themeConfigs?: string[];
}

export interface MapConfig {
  tiles: Tile[];
  defaultTile: string;
  center: [number, number];
  zoom: number;
}

export interface Tile {
  name: string;
  attribution?: string;
  url?: string;
  maxZoom?: number;
  component?: boolean;
  componentName?: string;
  tms?: boolean;
}

export interface LocaleConfig {
  locales: string[];
  defaultLocale: string;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
