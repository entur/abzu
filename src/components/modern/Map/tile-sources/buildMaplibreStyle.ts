/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */

import { StyleSpecification } from "maplibre-gl";
import { MapConfig, TileLayer } from "../../../../config/ConfigContext";

const OSM_FALLBACK: StyleSpecification = {
  version: 8,
  sources: {
    "base-layer": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
      maxzoom: 19,
    },
  },
  layers: [{ id: "base-layer", type: "raster", source: "base-layer" }],
};

/**
 * Returns true for layers that require special auth or components not yet
 * supported by the modern map (e.g. Kartverket Flyfoto / BAAT token).
 */
export const isUnsupportedLayer = (layer: TileLayer): boolean =>
  !!layer.component;

/**
 * MapLibre does not support the Leaflet-style `{s}` subdomain placeholder.
 * Expand it into one URL per subdomain so MapLibre can round-robin between them.
 */
function expandSubdomains(url: string): string[] {
  if (!url.includes("{s}")) return [url];
  // OSM and most public tile servers use subdomains a, b, c
  return ["a", "b", "c"].map((s) => url.replace("{s}", s));
}

/**
 * Converts the runtime MapConfig into a MapLibre StyleSpecification.
 * Layers marked as `component: true` (e.g. Flyfoto) are not yet supported
 * and will cause a fallback to OSM.
 */
export function buildMaplibreStyle(
  config: MapConfig,
  activeLayer: string,
): StyleSpecification {
  const layer =
    config.baseLayers.find((l) => l.name === activeLayer) ??
    config.baseLayers[0];

  // Skip component-based layers not yet supported in the modern map
  if (isUnsupportedLayer(layer) || !layer.url) return OSM_FALLBACK;

  // Normalise protocol-relative URLs (//s.tile... → https://s.tile...)
  const normalised = layer.url.replace(/^\/\//, "https://");
  const tiles = expandSubdomains(normalised);
  const attribution = (layer.attribution ?? "").replace(/<[^>]*>/g, "");

  return {
    version: 8,
    sources: {
      "base-layer": {
        type: "raster",
        tiles,
        tileSize: 256,
        attribution,
        maxzoom: layer.maxNativeZoom ?? layer.maxZoom ?? 19,
      },
    },
    layers: [{ id: "base-layer", type: "raster", source: "base-layer" }],
  };
}
