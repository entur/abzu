import { OidcClientSettings } from "oidc-client-ts";
import React, { useContext } from "react";

type FeatureFlags = {
  SVVStreetViewLink: boolean;
  KartverketFlyFotoLayer: boolean;
};

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
}

export interface MapConfig {
  supportedTiles: Tile[];
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

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
