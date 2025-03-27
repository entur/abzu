import { OidcClientSettings } from "oidc-client-ts";
import React, { useContext } from "react";

type FeatureFlags = {
  SVVStreetViewLink: boolean;
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
  defaultTileProvider: TileProvider;
  defaultCenter: [number, number];
  defaultZoom: number;
}

export enum TileProvider {
  OSM = "OpenStreetMap",
  KARTVERKET_TOPOGRAFISK = "Kartverket topografisk",
  KARTVERKET_FLYFOTO = "Kartverket flyfoto",
  DIGITRANSIT = "Digitransit",
}

export interface Tile {
  name: TileProvider;
  attribution?: string;
  url?: string;
  maxZoom?: number;
  component?: boolean;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
