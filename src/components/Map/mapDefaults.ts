import { Tile, TileProvider } from "../../config/ConfigContext";

export const defaultCenterPosition = [64.349421, 16.809082];

export const defaultOSMTile: Tile = {
  name: TileProvider.OSM,
  url: "//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
};
