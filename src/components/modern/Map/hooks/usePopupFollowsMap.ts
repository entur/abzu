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

import type { PopperProps } from "@mui/material";
import { MutableRefObject, Ref, useEffect, useRef } from "react";
import { useMap } from "react-map-gl/maplibre";

/** The Popper.js instance MUI hands to `popperRef` (popper.js isn't a direct dependency). */
type PopperInstance =
  NonNullable<PopperProps["popperRef"]> extends Ref<infer Instance>
    ? Instance
    : never;

/**
 * Keeps a Popper on its marker while the map pans or zooms. MapLibre moves
 * markers with a CSS transform, which Popper doesn't notice, so the popper is
 * repositioned on the map's `move` event, at most once per frame.
 */
export const usePopupFollowsMap = (
  open: boolean,
): MutableRefObject<PopperInstance | null> => {
  const { current: mapRef } = useMap();
  const popperRef = useRef<PopperInstance | null>(null);

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!open || !map) return;
    let frameId: number | null = null;
    const handleMove = () => {
      if (frameId !== null) return;
      frameId = requestAnimationFrame(() => {
        frameId = null;
        popperRef.current?.update();
      });
    };
    map.on("move", handleMove);
    return () => {
      map.off("move", handleMove);
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [open, mapRef]);

  return popperRef;
};
