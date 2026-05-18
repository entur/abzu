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
import { MapConfig } from "../../../../config/ConfigContext";

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
 *
 * For component layers (tile sources requiring external auth), pass the
 * resolved tile URL via `resolvedComponentUrl`. Auth tokens should NOT be
 * embedded here — inject them per-request via the Map's `transformRequest`
 * prop to avoid style rebuilds on token rotation.
 */
export function buildMaplibreStyle(
  config: MapConfig,
  activeLayer: string,
  resolvedComponentUrl?: string | null,
): StyleSpecification {
  const layer =
    config.baseLayers.find((l) => l.name === activeLayer) ??
    config.baseLayers[0];

  if (layer.component) {
    if (!resolvedComponentUrl) return OSM_FALLBACK;
    const attribution = (layer.attribution ?? "").replace(/<[^>]*>/g, "");
    return {
      version: 8,
      sources: {
        "base-layer": {
          type: "raster",
          tiles: [resolvedComponentUrl],
          tileSize: 256,
          attribution,
          maxzoom: layer.maxNativeZoom ?? layer.maxZoom ?? 19,
        },
      },
      layers: [{ id: "base-layer", type: "raster", source: "base-layer" }],
    };
  }

  if (!layer.url) return OSM_FALLBACK;

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
