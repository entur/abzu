export type FeatureFlags = {
  SVVStreetViewLink: boolean;
  KartverketFlyFotoLayer: boolean;
  Fintraffic: boolean;
  CookieInformation: boolean;
  MatomoTracker: boolean;
  StopPlaceUrl: boolean;
  StopPlacePostalAddress: boolean;
  LoadTimerBadge?: boolean;
  /** The guided test tour in the settings menu (dev and test only). */
  GuidedTour?: boolean;
};

export type Features = keyof FeatureFlags;
