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

import { useEffect, useRef } from "react";
import { fitMapToGroupMembers } from "../../../components/modern/GroupOfStopPlaces/utils/fitMapToGroupMembers";
import type { GroupMemberOnMap } from "../../../components/modern/Map/layers/utils/visibleGroupMembers";
import { Entities } from "../../../models/Entities";
import { useAppSelector } from "../../../store/hooks";
import {
  getGroupOfStopPlacesIdFromURL,
  getStopPlaceIdFromURL,
} from "../../../utils/URLhelpers";

const STOP_ZOOM = 17;
const FLY_DURATION_MS = 800;

interface UrlResult {
  id?: string;
  entityType?: string;
  location?: [number, number];
  members?: GroupMemberOnMap[];
}

interface MovableMap {
  flyTo: (options: {
    center: [number, number];
    zoom: number;
    duration: number;
  }) => void;
  fitBounds: Parameters<typeof fitMapToGroupMembers>[0]["fitBounds"];
}

/**
 * A map-page link with ?stopPlaceId= or ?groupOfStopPlacesId= loads that
 * result, but the map stayed at the overview (S-20). Once the result and
 * the map are both ready, move to it once: a stop at street level, a
 * group fitted to the members the map draws.
 */
export const useMoveMapToUrlResult = (): void => {
  const targetIdRef = useRef(
    getStopPlaceIdFromURL() ?? getGroupOfStopPlacesIdFromURL(),
  );
  const hasMovedRef = useRef(false);
  const result = useAppSelector(
    (state) => (state.stopPlace as any).activeSearchResult as UrlResult | null,
  );
  const activeMap = useAppSelector(
    (state) => (state.mapUtils as any).activeMap as MovableMap | undefined,
  );
  const showExpiredStops = useAppSelector(
    (state) => (state.stopPlace as any).showExpiredStops as boolean,
  );

  useEffect(() => {
    const targetId = targetIdRef.current;
    if (hasMovedRef.current || !targetId || !activeMap) return;
    if (!result || result.id !== targetId) return;
    hasMovedRef.current = true;

    if (result.entityType === Entities.GROUP_OF_STOP_PLACE) {
      fitMapToGroupMembers(
        activeMap,
        result.members ?? [],
        showExpiredStops,
        0,
      );
      return;
    }
    if (!result.location) return;
    const [lat, lng] = result.location;
    activeMap.flyTo({
      center: [lng, lat],
      zoom: STOP_ZOOM,
      duration: FLY_DURATION_MS,
    });
    // showExpiredStops is read once, when the move happens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, activeMap]);
};
