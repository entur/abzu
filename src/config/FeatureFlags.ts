export type FeatureFlags = {
  SVVStreetViewLink: boolean;
  KartverketFlyFotoLayer: boolean;
  Fintraffic: boolean;
  CookieInformation: boolean;
  MatomoTracker: boolean;
  StopPlaceUrl: boolean;
  StopPlacePostalAddress: boolean;
  LoadTimerBadge?: boolean;
};

export type Features = keyof FeatureFlags;
