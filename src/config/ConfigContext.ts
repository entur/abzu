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
}

export interface LocaleConfig {
  locales: Locale[];
  defaultLocale: Locale;
}

export enum Locale {
  NB = "nb",
  EN = "en",
  FI = "fi",
  FR = "fr",
  SV = "sv",
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
