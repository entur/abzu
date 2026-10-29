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
   * With this it's possible to specify localized links that will be shown in User Guide section of the header menu;
   * By default, Entur's user guide is used there.
   */
  extUserGuideLink?: Record<string, string>;
  /**
   * Hides "Move quays to new stop place" button
   */
  disableMoveQuaysToNewStopPlace?: boolean;
  /**
   * These keys will always be shown in UI and cannot be deleted
   */
  mandatoryKeyValuesSet?: MandatoryKeyValuesSet;
  /**
   * Path to a single custom theme config JSON file (legacy singular field).
   */
  themeConfig?: string;
  /**
   * Paths to one or more custom theme config JSON files.
   * Takes priority over the singular themeConfig field.
   */
  themeConfigs?: string[];
  /**
   * Controls which UI is available.
   * "legacy" (default) — only the legacy UI, no toggle shown.
   * "dual" — both UIs available; a switch in each UI's header swaps between them.
   * "modern" — only the modern UI, no toggle shown.
   */
  uiMode?: "legacy" | "dual" | "modern";
  /**
   * Only read when uiMode is "dual": which UI a first-time visitor lands on,
   * and what the header's UI switch says.
   */
  dualUiConfig?: DualUiConfig;
  /**
   * Settings for the modern parking editor.
   */
  parkingConfig?: ParkingConfig;
}

export interface DayTypeOption {
  /** The `dayTypeRef` value that Tiamat stores */
  ref: string;
  /** The label for each language code. A missing language falls back to `ref`. */
  label: Record<string, string>;
}

export interface ParkingConfig {
  /**
   * The day types an editor can choose for opening hours.
   * Without this list the editor shows the stored day type as read-only text.
   */
  dayTypes?: DayTypeOption[];
}

export type SwitchableUiMode = "legacy" | "modern";

export interface DualUiConfig {
  /**
   * UI shown until the user picks one with the switch. Defaults to "legacy".
   */
  defaultUiMode?: SwitchableUiMode;
  /**
   * Shows the UI switch button in each UI's header. Defaults to true.
   * The switch in the header menus stays available either way.
   */
  showSwitchButton?: boolean;
  /**
   * Overrides the switch button text per locale, e.g. { "nb": "…", "en": "…" }.
   * A locale missing here falls back to the built-in translation.
   */
  switchLabels?: {
    toModern?: Record<string, string>;
    toLegacy?: Record<string, string>;
  };
}

export interface MapConfig {
  baseLayers: TileLayer[];
  defaultBaseLayer: string;
  overlays?: TileLayer[];
  center: [number, number];
  zoom: number;
}

export interface TileLayer {
  name: string;
  attribution?: string;
  url?: string;
  maxZoom?: number;
  maxNativeZoom?: number;
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
  /**
   * When true, all UI controls for creating new MultiModal (parent) StopPlaces are hidden.
   * Existing MultiModal StopPlaces can still be viewed and edited.
   */
  disableMultiModalStopPlaceCreation?: boolean;
  /**
   * When true, all UI controls for creating new Group of Stop Places are hidden.
   * Existing Groups of Stop Places can still be viewed and edited.
   */
  disableGroupOfStopPlacesCreation?: boolean;
}

export type MandatoryKeyValuesSupportedTransportMode =
  "rail" | "bus" | "tram" | "all";

export interface MandatoryKeyValuesSet {
  stopPlace: Record<MandatoryKeyValuesSupportedTransportMode, string[]>;
  quay: Record<MandatoryKeyValuesSupportedTransportMode, string[]>;
}

export const ConfigContext = React.createContext<Config>({});

export const useConfig = () => {
  return useContext(ConfigContext);
};
