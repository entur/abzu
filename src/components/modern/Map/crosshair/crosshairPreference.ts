import type { CrosshairSetting } from "./types";
import { CROSSHAIR_TYPES } from "./types";

const STORAGE_KEY = "map.dragCrosshair";
const VALID_VALUES: readonly string[] = [...CROSSHAIR_TYPES, "none"];

export const getCrosshairPreference = (): CrosshairSetting => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_VALUES.includes(stored)) {
      return stored as CrosshairSetting;
    }
  } catch {
    // localStorage unavailable
  }
  return "none";
};

export const setCrosshairPreference = (type: CrosshairSetting): void => {
  try {
    localStorage.setItem(STORAGE_KEY, type);
  } catch {
    // localStorage unavailable
  }
};
