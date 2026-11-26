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
import { useAppSelector } from "../../../../store/hooks";
import {
  GroupMemberOnMap,
  visibleGroupMembers,
} from "../../Map/layers/utils/visibleGroupMembers";
import { groupMemberBounds, LngLatBounds } from "../utils/groupMemberBounds";

/** Space kept free around the members, in pixels. */
const FIT_PADDING = 64;
/** The zoom a single stop opens at; a one-member group stops there too. */
const GROUP_FIT_MAX_ZOOM = 17;
const FIT_DURATION_MS = 800;

interface FitBoundsMap {
  fitBounds: (
    bounds: LngLatBounds,
    options: {
      padding: { top: number; right: number; bottom: number; left: number };
      maxZoom: number;
      duration: number;
    },
  ) => void;
}

/**
 * Fits the map to every member of the open group that the map draws (F-89;
 * expired members only when the user shows expired stops, F-87), keeping them
 * clear of the drawer. Runs when the editor opens and whenever the group is
 * loaded, created or saved again (the reducer then sets a new
 * `centerPosition`). If the map isn't ready yet, it fits once it is. Opening
 * or closing the drawer, or toggling expired stops, does not move the map. A
 * group without members keeps the current view (F-83).
 *
 * @param drawerInset pixels the open drawer covers on the left of the map
 */
export const useFitMapToGroupMembers = (drawerInset: number): void => {
  const members = useAppSelector(
    (state) =>
      (state.stopPlacesGroup as any).current?.members as
        GroupMemberOnMap[] | undefined,
  );
  const showExpiredStops = useAppSelector(
    (state) => (state.stopPlace as any).showExpiredStops as boolean,
  );
  const centerPosition = useAppSelector(
    (state) => (state.stopPlacesGroup as any).centerPosition as unknown,
  );
  const activeMap = useAppSelector(
    (state) => (state.mapUtils as any).activeMap as FitBoundsMap | undefined,
  );

  const fitStateRef = useRef({ members, drawerInset, showExpiredStops });
  fitStateRef.current = { members, drawerInset, showExpiredStops };

  /* Fitting on mount is right: the group route shows a loader instead of the
     editor until the group is fetched, and a new group is set up before
     navigating, so the members are the open group's by the time this runs. */
  useEffect(() => {
    if (!activeMap) return;
    const {
      members: currentMembers,
      drawerInset: inset,
      showExpiredStops: includeExpired,
    } = fitStateRef.current;
    const bounds = groupMemberBounds(
      visibleGroupMembers(currentMembers ?? [], includeExpired),
    );
    if (!bounds) return;
    activeMap.fitBounds(bounds, {
      padding: {
        top: FIT_PADDING,
        right: FIT_PADDING,
        bottom: FIT_PADDING,
        left: FIT_PADDING + inset,
      },
      maxZoom: GROUP_FIT_MAX_ZOOM,
      duration: FIT_DURATION_MS,
    });
  }, [activeMap, centerPosition]);
};
