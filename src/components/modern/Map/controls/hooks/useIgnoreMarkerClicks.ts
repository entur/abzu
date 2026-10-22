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

import { useEffect } from "react";
import type { MapRef } from "react-map-gl/maplibre";

const MARKER_SELECTOR = ".maplibregl-marker";

/**
 * While placing, clicks on markers do nothing (F-95). Markers sit inside the
 * map's canvas container, so one click used to reach both the marker (its
 * popup opened over "Create a stop here?") and the map (the pin jumped onto
 * the existing stop). Stopping the click on its way down, in the capture
 * phase, keeps it from the marker's own handler and from MapLibre's.
 */
export const useIgnoreMarkerClicks = (
  mapRef: MapRef | undefined,
  isActive: boolean,
): void => {
  useEffect(() => {
    if (!mapRef || !isActive) return;
    const container = mapRef.getMap().getCanvasContainer();

    const stopMarkerClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest?.(MARKER_SELECTOR)) return;
      event.stopPropagation();
      event.preventDefault();
    };

    container.addEventListener("click", stopMarkerClick, { capture: true });
    return () =>
      container.removeEventListener("click", stopMarkerClick, {
        capture: true,
      });
  }, [mapRef, isActive]);
};
