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

import {
  GroupMemberOnMap,
  visibleGroupMembers,
} from "../../Map/layers/utils/visibleGroupMembers";
import { groupMemberBounds, LngLatBounds } from "./groupMemberBounds";

/** Space kept free around the members, in pixels. */
const FIT_PADDING = 64;
/** The zoom a single stop opens at; a one-member group stops there too. */
const GROUP_FIT_MAX_ZOOM = 17;
const FIT_DURATION_MS = 800;

export interface FitBoundsMap {
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
 * Fits the map to the group members it draws (F-89; expired members only
 * when the user shows expired stops, F-87), clear of a drawer covering
 * `drawerInset` pixels on the left. No members with a location: no move.
 */
export const fitMapToGroupMembers = (
  map: FitBoundsMap,
  members: GroupMemberOnMap[],
  includeExpired: boolean,
  drawerInset: number,
): void => {
  const bounds = groupMemberBounds(
    visibleGroupMembers(members, includeExpired),
  );
  if (!bounds) return;
  map.fitBounds(bounds, {
    padding: {
      top: FIT_PADDING,
      right: FIT_PADDING,
      bottom: FIT_PADDING,
      left: FIT_PADDING + drawerInset,
    },
    maxZoom: GROUP_FIT_MAX_ZOOM,
    duration: FIT_DURATION_MS,
  });
};
