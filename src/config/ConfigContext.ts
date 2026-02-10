import { OidcClientSettings } from "oidc-client-ts";
import React, { useContext } from "react";
import { FeatureFlags } from "./FeatureFlags";

export interface Config {
  tiamatBaseUrl?: string;
  baatTokenProxyEndpoint?: string;
  sentryDSN?: string;
  tiamatEnv?: string;
  preferredNameNamespace?: string;
  claimsNamespace?: string;
  oidcConfig?: OidcClientSettings;
  featureFlags?: FeatureFlags;
  mapConfig?: MapConfig;
  localeConfig?: LocaleConfig;
  modalityConfig?: ModalityConfig;
  /**
   * Path to folder inder /ext that contains features or assets of a company that adopted NSR.
   * This is used e.g. for:
   *    CustomStyle, when determining the relevant custom style class;
   *    CustomLogo;
   */
  extPath?: string;
  /**
   * With this it's possible to specify a link that will be shown in User Guide section of the header menu;
   * By default, Entur's user guide is used there.
   */
  extUserGuideLink?: string;
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

export interface ModalityConfig {
  /**
   * List of stop types to hide from the modality selection menu.
   * These stop types will still exist in the system for backwards compatibility,
   * but will not be available for selection when creating new stops.
   * Example: ["other", "someOtherType"]
   */
  hiddenStopTypes?: string[];
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
