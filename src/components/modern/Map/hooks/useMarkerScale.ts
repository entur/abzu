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

import { useEffect, useState } from "react";
import { useMap } from "react-map-gl/maplibre";

// Zoom level at which markers render at their designed (1×) size
const BASE_ZOOM = 15;

// Controls how aggressively size changes per zoom step.
const ZOOM_SCALE_FACTOR = 0.2;

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.0;

/**
 * Returns a scale multiplier (0.5–2.0) based on the current map zoom level.
 * Subscribes to the MapLibre zoom event for smooth real-time updates.
 * Use this to scale marker sizes relative to zoom.
 */
export const useMarkerScale = (): number => {
  const { current: mapRef } = useMap();
  const [zoom, setZoom] = useState<number>(
    () => mapRef?.getZoom() ?? BASE_ZOOM,
  );

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;

    const handleZoom = () => setZoom(map.getZoom());
    map.on("zoom", handleZoom);
    return () => {
      map.off("zoom", handleZoom);
    };
  }, [mapRef]);

  const raw = Math.pow(2, (zoom - BASE_ZOOM) * ZOOM_SCALE_FACTOR);
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, raw));
};
