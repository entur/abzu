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

import { useCallback } from "react";
import {
  getNeighbourStops,
  getStopPlaceVersions,
  getStopPlaceWithAll,
} from "../../../../actions/TiamatActions.modern";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";

export type ReloadStopPlace = (stopPlaceId: string) => void;

/**
 * Reloads an open stop place after a server change: its versions, the stops
 * around it on the map, and the stop itself. Mutation responses alone leave
 * derived state stale (e.g. `hasExpired` is computed when the response is
 * mapped, before a deactivation's end time has passed: F-118).
 * Fire-and-forget: the change itself has already succeeded.
 */
export const useReloadStopPlace = (): ReloadStopPlace => {
  const dispatch = useAppDispatch();
  const activeMap = useAppSelector(
    (state) => (state.mapUtils as any).activeMap,
  );
  const showExpiredStops = useAppSelector(
    (state) => (state.stopPlace as any).showExpiredStops as boolean,
  );

  return useCallback(
    (stopPlaceId) => {
      dispatch(getStopPlaceVersions(stopPlaceId));
      if (activeMap) {
        dispatch(
          getNeighbourStops(
            stopPlaceId,
            activeMap.getBounds(),
            showExpiredStops,
          ),
        );
      }
      dispatch(getStopPlaceWithAll(stopPlaceId));
    },
    [dispatch, activeMap, showExpiredStops],
  );
};
