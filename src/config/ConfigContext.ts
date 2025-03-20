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
  supportedTiles: TileEnum[];
  defaultTile: TileEnum;
  center: [number, number];
  zoom: number;
}

export enum TileEnum {
  OSM = "OpenStreetMap",
  KARTVERKET_TOPOGRAFISK = "Kartverket topografisk",
  KARTVERKET_FLYFOTO = "Kartverket flyfoto",
  DGT = "Digitransit",
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
