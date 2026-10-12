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

import AppRoutes from "../../../../routes";
import type { RootState } from "../../../../store/store";

export type UnsavedEditor = "stopPlace" | "group";

/**
 * Which editor holds unsaved changes on this path, if any. Stop places and
 * parent stop places share one dirty flag and route; groups have their own.
 * Read at the moment of navigating, so a discard just before navigating counts.
 */
export const findUnsavedEditor = (
  state: RootState,
  pathname: string,
): UnsavedEditor | null => {
  const isOnStopPlace = pathname.includes(`/${AppRoutes.STOP_PLACE}/`);
  const isOnGroup = pathname.includes(`/${AppRoutes.GROUP_OF_STOP_PLACE}/`);

  if (isOnStopPlace && (state.stopPlace as any).stopHasBeenModified) {
    return "stopPlace";
  }
  if (isOnGroup && (state.stopPlacesGroup as any).isModified) {
    return "group";
  }
  return null;
};
