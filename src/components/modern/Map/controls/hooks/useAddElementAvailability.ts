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

import { useAppSelector } from "../../../../../store/hooks";
import { useDrawerOpen } from "../../../Shared/hooks/useDrawerOpen";
import { useDrawerWidth } from "../../../Shared/hooks/useDrawerWidth";
import { useCanEditOnMap } from "../../hooks/useCanEditOnMap";
import { useIsEditingGroup } from "../../hooks/useIsEditingGroup";
import { useMapCurrentStop } from "../../hooks/useMapCurrentStop";
import { fabLeftFor } from "../utils/fabPosition";

export interface AddElementAvailability {
  /** False when the + has nothing to offer here; it then isn't shown. */
  isAvailable: boolean;
  isEditorOpen: boolean;
  isQuayFocused: boolean;
  /** Left edge of the + in pixels (only meaningful when available). */
  fabLeft: number;
}

/**
 * Whether the map's + is shown, what it adds and where it sits. All the
 * hooks run on every render (no early return): the map stays mounted across
 * the login transition, so the hook count must not change.
 */
export const useAddElementAvailability = (): AddElementAvailability => {
  const isAuthenticated = useAppSelector(
    (state) => (state.user as any).auth?.isAuthenticated as boolean | undefined,
  );
  /* An unsaved new stop has no id yet but is still open in the editor, so
     "open" means current is set, not that it has an id (F-16). */
  const current = useMapCurrentStop();
  const canEditOpenStop = useCanEditOnMap(current);
  const isEditingGroup = useIsEditingGroup();
  // The + follows the editor drawer's real width and open state (F-10d).
  const { isDrawerOpen } = useDrawerOpen();
  const drawerWidth = useDrawerWidth();
  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as
        { type: string; index: number } | undefined,
  );

  const isEditorOpen = !!current;
  const fabLeft = fabLeftFor({ isEditorOpen, isDrawerOpen, drawerWidth });
  const isAvailable =
    !!isAuthenticated &&
    // Quays and parking belong to the child stops, never the parent (F-35).
    !current?.isParent &&
    // Nothing to add to a group; the previous stop is no longer open (F-88).
    !isEditingGroup &&
    // A read-only stop or an older version gets no new elements (F-96).
    (!isEditorOpen || canEditOpenStop) &&
    // A phone-wide drawer covers the map: nothing to place on (F-10d).
    fabLeft !== null;

  return {
    isAvailable,
    isEditorOpen,
    isQuayFocused:
      focusedElement?.type === "quay" && (focusedElement?.index ?? -1) >= 0,
    fabLeft: fabLeft ?? 0,
  };
};
