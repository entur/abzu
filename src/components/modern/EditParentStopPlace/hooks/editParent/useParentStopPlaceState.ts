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

import { useSelector } from "react-redux";
import { getStopPermissions } from "../../../../../utils/permissionsUtils";
import { RootState } from "../../types";

/**
 * Hook for managing parent stop place state from Redux
 * Provides stop place data, permissions, and loading state
 */
export const useParentStopPlaceState = () => {
  // Redux selectors
  const stopPlace = useSelector((state: RootState) => state.stopPlace.current);
  const originalStopPlace = useSelector(
    (state: RootState) => state.stopPlace.originalCurrent,
  );
  const isModified = useSelector(
    (state: RootState) => state.stopPlace.stopHasBeenModified,
  );
  const versions = useSelector((state: RootState) => state.stopPlace.versions);
  const isLoading = useSelector((state: RootState) => state.stopPlace.loading);
  const activeMap = useSelector((state: RootState) => state.mapUtils.activeMap);

  // Permissions
  const permissions = getStopPermissions(stopPlace) as any;
  const canEdit = permissions.canEdit;
  const canDelete = permissions.canDelete || permissions.canDeleteStop || false;

  return {
    stopPlace,
    originalStopPlace,
    isModified,
    versions,
    isLoading,
    activeMap,
    canEdit,
    canDelete,
  };
};
