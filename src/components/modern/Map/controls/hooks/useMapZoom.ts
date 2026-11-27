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

import { useCallback, useEffect, useState } from "react";
import { useMap } from "react-map-gl/maplibre";

interface ZoomLimits {
  canZoomIn: boolean;
  canZoomOut: boolean;
}

export interface MapZoom extends ZoomLimits {
  zoomIn: () => void;
  zoomOut: () => void;
}

interface ZoomableMap {
  getZoom: () => number;
  getMinZoom: () => number;
  getMaxZoom: () => number;
}

const readLimits = (map: ZoomableMap | undefined): ZoomLimits => {
  if (!map) return { canZoomIn: false, canZoomOut: false };
  const zoom = map.getZoom();
  return {
    canZoomIn: zoom < map.getMaxZoom(),
    canZoomOut: zoom > map.getMinZoom(),
  };
};

/**
 * One-step zoom for the map's zoom buttons (F-01), with whether each
 * direction is still possible. The limits follow the map's zoom and its
 * style (the max zoom comes from the active base layer).
 */
export const useMapZoom = (): MapZoom => {
  const { current: mapRef } = useMap();
  const [limits, setLimits] = useState<ZoomLimits>(() =>
    readLimits(mapRef?.getMap()),
  );

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;
    // Keep the same state object when nothing changed, so a re-run of this
    // effect can't trigger a render of its own.
    const updateLimits = () =>
      setLimits((previous) => {
        const next = readLimits(map);
        const unchanged =
          next.canZoomIn === previous.canZoomIn &&
          next.canZoomOut === previous.canZoomOut;
        return unchanged ? previous : next;
      });
    let frameId: number | null = null;
    const handleChange = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        updateLimits();
      });
    };
    updateLimits();
    map.on("zoom", handleChange);
    map.on("styledata", handleChange);
    return () => {
      map.off("zoom", handleChange);
      map.off("styledata", handleChange);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [mapRef]);

  const zoomIn = useCallback(() => mapRef?.getMap().zoomIn(), [mapRef]);
  const zoomOut = useCallback(() => mapRef?.getMap().zoomOut(), [mapRef]);

  return { ...limits, zoomIn, zoomOut };
};
