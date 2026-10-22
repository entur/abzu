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

import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../../actions";
import { fetchCanEditAt } from "../../../../../actions/StopPlaceActions.modern";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { getCrosshairPreference, type CrosshairSetting } from "../../crosshair";
import { useMapNotice } from "../../notices/useMapNotice";
import { useIgnoreMarkerClicks } from "./useIgnoreMarkerClicks";

export type ElementType =
  "quay" | "parkAndRide" | "bikeParking" | "boardingPosition";

/** What the next map click places: a new stop, or an element of the open stop. */
export type PlacementType = ElementType | "stopPlace";

export interface MapPosition {
  latitude: number;
  longitude: number;
}

export interface Placement {
  placementType: PlacementType | null;
  startPlacement: (type: PlacementType) => void;
  cancelPlacement: () => void;
  /** Where a new stop would go; set by a click, awaiting confirmation (F-13). */
  pendingStopPosition: MapPosition | null;
  clearPendingStopPosition: () => void;
  crosshairSetting: CrosshairSetting;
  pointerPosition: MapPosition | null;
}

const PARKING_TYPES = new Set<ElementType>(["parkAndRide", "bikeParking"]);
const OUTSIDE_AREA_MESSAGE_ID = "create_not_allowed";

/**
 * One placement mechanism for everything the + adds (F-13): a single map
 * click, the user's drag crosshair following the pointer, Esc to cancel.
 * Elements of the open stop are added straight away; a new stop only
 * records the clicked position, which NewStopConfirm then asks about.
 */
export const usePlacement = (): Placement => {
  const dispatch = useAppDispatch();
  const showNotice = useMapNotice();
  const { current: mapRef } = useMap();
  const [placementType, setPlacementType] = useState<PlacementType | null>(
    null,
  );
  const [pendingStopPosition, setPendingStopPosition] =
    useState<MapPosition | null>(null);
  const [crosshairSetting, setCrosshairSetting] =
    useState<CrosshairSetting>("none");
  const [pointerPosition, setPointerPosition] = useState<MapPosition | null>(
    null,
  );

  const quayCount = useAppSelector(
    (state) => (state.stopPlace.current as any)?.quays?.length ?? 0,
  );
  const parkingCount = useAppSelector(
    (state) => (state.stopPlace.current as any)?.parking?.length ?? 0,
  );
  // Refs so the map listeners, registered once per placement, read fresh values.
  const countsRef = useRef({ quayCount, parkingCount });
  countsRef.current = { quayCount, parkingCount };
  const isCheckingRef = useRef(false);

  useIgnoreMarkerClicks(mapRef, !!placementType);

  const cancelPlacement = useCallback(() => {
    setPlacementType(null);
    setPendingStopPosition(null);
  }, []);

  const startPlacement = useCallback((type: PlacementType) => {
    setPendingStopPosition(null);
    setPlacementType(type);
  }, []);

  useEffect(() => {
    if (placementType) setCrosshairSetting(getCrosshairPreference());
  }, [placementType]);

  // Pointer-following crosshair, as when dragging an element.
  useEffect(() => {
    if (!mapRef || !placementType) return;
    const map = mapRef.getMap();
    const handleMove = (event: any) =>
      setPointerPosition({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.lng,
      });
    const handleLeave = () => setPointerPosition(null);
    map.on("mousemove", handleMove);
    map.on("mouseout", handleLeave);
    return () => {
      map.off("mousemove", handleMove);
      map.off("mouseout", handleLeave);
      setPointerPosition(null);
    };
  }, [mapRef, placementType]);

  // The placing click itself.
  useEffect(() => {
    if (!mapRef || !placementType) return;
    const map = mapRef.getMap();

    // Elements must stay inside the user's edit area, like the stop itself
    // (F-107). A refused spot keeps placement on, so another click can retry.
    const placeElement = async (
      type: ElementType,
      position: [number, number],
    ) => {
      if (isCheckingRef.current) return;
      isCheckingRef.current = true;
      const isAllowed = await dispatch(fetchCanEditAt(position)).catch(
        () => false,
      );
      isCheckingRef.current = false;
      if (!isAllowed) {
        showNotice(OUTSIDE_AREA_MESSAGE_ID);
        return;
      }
      const { quayCount: quays, parkingCount: parking } = countsRef.current;
      const newIndex = PARKING_TYPES.has(type) ? parking : quays;
      try {
        dispatch(StopPlaceActions.addElementToStop(type, position));
        dispatch(StopPlaceActions.setElementFocus(newIndex, type));
      } finally {
        // Placement must end even if adding fails, or later clicks are swallowed.
        setPlacementType(null);
      }
    };

    const handleClick = (event: any) => {
      const { lat, lng } = event.lngLat;
      if (placementType === "stopPlace") {
        // Clicking again moves the not-yet-confirmed stop.
        setPendingStopPosition({ latitude: lat, longitude: lng });
        return;
      }
      void placeElement(placementType, [lat, lng]);
    };

    // With a crosshair following the pointer, hide the OS cursor; fall back to
    // the CSS crosshair when the user chose none.
    map.getCanvas().style.cursor =
      crosshairSetting === "none" ? "crosshair" : "none";
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
      map.getCanvas().style.cursor = "";
    };
  }, [mapRef, placementType, crosshairSetting, dispatch, showNotice]);

  useEffect(() => {
    if (!placementType) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancelPlacement();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [placementType, cancelPlacement]);

  return {
    placementType,
    startPlacement,
    cancelPlacement,
    pendingStopPosition,
    clearPendingStopPosition: () => setPendingStopPosition(null),
    crosshairSetting,
    pointerPosition,
  };
};
