import type { RequestParameters } from "maplibre-gl";
import { useCallback, useRef } from "react";
import { MapConfig } from "../../../../config/ConfigContext";
import { useNibToken } from "../../../../ext/KartverketFlyFoto/hooks/useNibToken";

const NIB_TILE_URL =
  "https://tilecache.norgeibilder.no/arcgis/rest/services/Nibcache_web_mercator_v2/MapServer/tile/{z}/{y}/{x}";

export type MapComponentLayersResult = {
  resolvedComponentUrl: string | null;
  transformRequest: (url: string) => RequestParameters;
};

export const useMapComponentLayers = (
  config: MapConfig,
  activeBaseLayer: string,
): MapComponentLayersResult => {
  const nibToken = useNibToken();
  const nibTokenRef = useRef(nibToken);
  nibTokenRef.current = nibToken;

  const activeLayer =
    config.baseLayers.find((l) => l.name === activeBaseLayer) ??
    config.baseLayers[0];

  const resolvedComponentUrl: string | null =
    activeLayer.component === true &&
    activeLayer.componentName === "KartverketFlyFoto" &&
    !!nibToken
      ? NIB_TILE_URL
      : null;

  const transformRequest = useCallback(
    (url: string): RequestParameters => {
      if (url.startsWith("https://tilecache.norgeibilder.no/")) {
        const token = nibTokenRef.current;
        if (token) {
          return { url: `${url}?token=${encodeURIComponent(token)}` };
        }
      }
      return { url };
    },
    // nibTokenRef is a stable ref — intentionally excluded from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return { resolvedComponentUrl, transformRequest };
};
