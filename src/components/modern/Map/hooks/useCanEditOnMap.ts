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

import { getStopPermissions } from "../../../../utils/permissionsUtils";
import { useIsViewingOlderVersion } from "../../Shared/StopStatus";
import type { MapStopPlace } from "../markers/types";

/**
 * Whether the open stop's elements may be changed on the map: dragged, given
 * typed coordinates, or acted on from their popups.
 *
 * Every marker used to work this out on its own from permissions and
 * termination only, so an older version (read-only in the editor since F-42)
 * still offered merge and move on the live quays (F-96).
 */
export const useCanEditOnMap = (stop: MapStopPlace | null): boolean => {
  const isViewingOlderVersion = useIsViewingOlderVersion();
  if (!stop || isViewingOlderVersion) return false;
  return !stop.permanentlyTerminated && !!getStopPermissions(stop).canEdit;
};
