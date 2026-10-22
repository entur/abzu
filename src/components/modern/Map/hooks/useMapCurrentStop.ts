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

import { useAppSelector } from "../../../../store/hooks";
import type { MapStopPlace } from "../markers/types";
import { useIsEditingGroup } from "./useIsEditingGroup";

/**
 * The stop the map should draw as "open", or null while a group is open
 * (F-88). With `includeNewStop`, a stop that is being created but not yet
 * opened in the editor counts too.
 *
 * `stopPlace.current` outlives the stop editor: opening a group from a
 * member's chip sends the group id with NAVIGATE_TO, and the reducer only
 * clears the stop for an empty payload (see useIsEditingGroup). The map is
 * never torn down, so the previous stop, its quays and its parking stayed
 * highlighted in the group view.
 */
export const useMapCurrentStop = (
  includeNewStop = false,
): MapStopPlace | null => {
  const isEditingGroup = useIsEditingGroup();
  const current = useAppSelector(
    (state) => state.stopPlace.current as MapStopPlace | null,
  );
  const newStop = useAppSelector(
    (state) => (state.stopPlace as any).newStop as MapStopPlace | null,
  );
  if (isEditingGroup) return null;
  return current ?? (includeNewStop ? newStop : null) ?? null;
};
