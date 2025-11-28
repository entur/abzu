import { ReactElement } from "react";
import { MobilityFacility } from "../../../models/Facilities";

export enum FeaturePopoverMenuDefaults {
  NONE = "none",
  UNKNOWN = "unknown",
  ALL = "all",
}

export const iconColorStates: Record<string, string> = {
  TRUE: "#181C56",
  FALSE: "#F44336",
  UNKNOWN: "#e8e3e3",
  NONE: "#BEBEBE",
  PARTIAL: "#FF9800",
  DEFAULT: "#181C56",
};

/**
 * This is to be extended with other enum-s once there a new feature with a popover menu to be added
 */
export type FeaturePopoverMenuValue =
  | FeaturePopoverMenuDefaults
  | MobilityFacility;

export interface FeaturePopoverMenuOption {
  value: FeaturePopoverMenuValue;
  color?: string;
  icon: ReactElement<any>;
}
