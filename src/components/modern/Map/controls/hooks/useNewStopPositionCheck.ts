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
import { fetchCanEditAt } from "../../../../../actions/StopPlaceActions.modern";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { distanceInMeters } from "../../../Shared/coordinates/coordinateChecks";
import type { NeighbourStop } from "../../markers/types";
import type { MapPosition } from "./usePlacement";

/** Closer than this to an existing stop, the prompt says so (F-95). */
const NEARBY_STOP_METERS = 50;

export type NewStopAreaStatus = "checking" | "allowed" | "outside";

interface NewStopPositionCheck {
  areaStatus: NewStopAreaStatus;
  /** Name of an existing stop right at the pin, if any. */
  nearbyStopName: string | null;
}

const findNearbyStopName = (
  position: MapPosition,
  stops: NeighbourStop[],
): string | null => {
  const pin: [number, number] = [position.latitude, position.longitude];
  const nearby = stops.find(
    (stop) =>
      stop.location &&
      !stop.hasExpired &&
      distanceInMeters(pin, stop.location) <= NEARBY_STOP_METERS,
  );
  return nearby ? (nearby.name ?? nearby.id) : null;
};

/**
 * Checks a new stop's pin before any work is done (F-106): whether it is
 * inside the user's edit area, and whether a stop is already there (F-95).
 * Legacy NewStopMarker did the area check on placing; the modern prompt only
 * learned about it after the stop had been built.
 */
export const useNewStopPositionCheck = (
  position: MapPosition,
): NewStopPositionCheck => {
  const dispatch = useAppDispatch();
  const [areaStatus, setAreaStatus] = useState<NewStopAreaStatus>("checking");
  const neighbourStops = useAppSelector(
    (state) =>
      ((state.stopPlace as any).neighbourStops ?? []) as NeighbourStop[],
  );
  const { latitude, longitude } = position;

  useEffect(() => {
    // A newer pin position wins; the answer for an older one is dropped.
    let isCurrent = true;
    setAreaStatus("checking");
    dispatch(fetchCanEditAt([latitude, longitude]))
      .catch(() => false)
      .then((canEdit) => {
        if (isCurrent) setAreaStatus(canEdit ? "allowed" : "outside");
      });
    return () => {
      isCurrent = false;
    };
  }, [dispatch, latitude, longitude]);

  return {
    areaStatus,
    nearbyStopName: findNearbyStopName(position, neighbourStops),
  };
};
