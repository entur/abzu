import { TileLayer } from "./ConfigContext";

export const defaultCenterPosition = [64.349421, 16.809082];

export const OPEN_STREET_MAP = "OpenStreetMap";

export const defaultOSMTileLayer: TileLayer = {
  name: OPEN_STREET_MAP,
  url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
};
