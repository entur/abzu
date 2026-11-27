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
import { MARKER_SIZES } from "../markerSize/markerSizePreference";
import { useMarkerSize } from "../markerSize/useMarkerSize";

// Zoom level from which markers keep their full working size
const BASE_ZOOM = 15;

// Controls how quickly markers shrink per zoom step when zooming out.
const ZOOM_SCALE_FACTOR = 0.2;

const MIN_SCALE = 0.5;
/** Markers don't grow past their size at BASE_ZOOM when zooming in (F-93). */
const MAX_SCALE = 1;

/**
 * The multiplier for every marker size at a zoom level: the chosen working
 * size (`sizeFactor`, see MARKER_SIZES) from BASE_ZOOM in, shrinking when
 * zooming out, down to MIN_SCALE × sizeFactor.
 */
export const markerScaleForZoom = (
  zoom: number,
  sizeFactor: number,
): number => {
  const curve = Math.pow(2, (zoom - BASE_ZOOM) * ZOOM_SCALE_FACTOR);
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, curve)) * sizeFactor;
};

/**
 * Returns the marker scale for the current map zoom and the user's chosen
 * marker size (see markerScaleForZoom). Subscribes to the MapLibre zoom event
 * for smooth real-time updates. Use this to scale marker sizes.
 */
export const useMarkerScale = (): number => {
  const { current: mapRef } = useMap();
  const { markerSize } = useMarkerSize();
  const [zoom, setZoom] = useState<number>(
    () => mapRef?.getZoom() ?? BASE_ZOOM,
  );

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!map) return;

    // Coalesce rapid zoom events to at most one state update per frame —
    // every marker on the map calls this hook, so an unthrottled listener
    // means one re-render per marker per zoom tick.
    let rafId: number | null = null;
    const handleZoom = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setZoom(map.getZoom());
      });
    };
    map.on("zoom", handleZoom);
    return () => {
      map.off("zoom", handleZoom);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [mapRef]);

  return markerScaleForZoom(zoom, MARKER_SIZES[markerSize]);
};
