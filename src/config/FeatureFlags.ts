export type FeatureFlags = {
  SVVStreetViewLink: boolean;
  KartverketFlyFotoLayer: boolean;
  Fintraffic: boolean;
  CookieInformation: boolean;
};

export type Features = keyof FeatureFlags;
