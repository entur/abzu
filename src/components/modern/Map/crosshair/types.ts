export const CROSSHAIR_TYPES = ["classic", "dot", "circle", "gap"] as const;

export type CrosshairType = (typeof CROSSHAIR_TYPES)[number];
export type CrosshairSetting = CrosshairType | "none";
