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

import { useCallback, useEffect, useRef } from "react";
import { useMap } from "react-map-gl/maplibre";

const ESCAPE_KEY = "Escape";
const MAP_CANVAS_SELECTOR = ".maplibregl-canvas";
const MARKER_SELECTOR = ".maplibregl-marker";

/**
 * Closes a non-modal marker popup (F-80) on Esc, on a click on the map, and
 * on a click anywhere else outside it. The map's own `click` event is used
 * for the map, because MapLibre doesn't fire it after a drag: panning keeps
 * the popup open. The returned handler is for a `ClickAwayListener`; it skips
 * the map canvas for the same reason.
 */
export const useMarkerPopupDismiss = (
  open: boolean,
  onClose: () => void,
): ((event: MouseEvent | TouchEvent) => void) => {
  const { current: mapRef } = useMap();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === ESCAPE_KEY) onCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!open || !map) return;
    /* MapLibre also fires `click` for a click on a marker, after the marker
       has opened its popup: that click belongs to the marker (and the
       click-away closes any other popup), so it must not close this one. */
    const handleMapClick = (event: { originalEvent?: Event }) => {
      const target = event.originalEvent?.target as Element | null;
      if (target?.closest?.(MARKER_SELECTOR)) return;
      onCloseRef.current();
    };
    map.on("click", handleMapClick);
    return () => {
      map.off("click", handleMapClick);
    };
  }, [open, mapRef]);

  return useCallback((event: MouseEvent | TouchEvent) => {
    const target = event.target as Element | null;
    if (target?.closest?.(MAP_CANVAS_SELECTOR)) return;
    onCloseRef.current();
  }, []);
};
