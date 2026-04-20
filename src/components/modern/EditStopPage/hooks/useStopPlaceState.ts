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
import { getStopPermissions } from "../../../../utils/permissionsUtils";

/**
 * Hook for managing stop place state from Redux
 * Provides stop place data, permissions, and loading state
 */
export const useStopPlaceState = () => {
  // For freshly placed stops the data lives in `newStop` until saved; fall back to it
  // so the wizard and drawer render immediately without needing USE_NEW_STOP_AS_CURRENT.
  const stopPlace = useSelector(
    (state: any) => state.stopPlace.current ?? state.stopPlace.newStop,
  );
  const originalStopPlace = useSelector(
    (state: any) => state.stopPlace.originalCurrent,
  );
  const isModified = useSelector(
    (state: any) => state.stopPlace.stopHasBeenModified,
  );
  const isLoading = useSelector((state: any) => state.stopPlace.loading);
  const versions = useSelector((state: any) => state.stopPlace.versions ?? []);
  const activeMap = useSelector((state: any) => state.mapUtils.activeMap);
  const terminateStopDialogOpen = useSelector(
    (state: any) => state.mapUtils.deleteStopDialogOpen,
  );

  const permissions = getStopPermissions(stopPlace) as any;
  const canEdit = permissions.canEdit ?? false;
  const canDelete = permissions.canDelete || permissions.canDeleteStop || false;

  return {
    stopPlace,
    originalStopPlace,
    isModified,
    isLoading,
    activeMap,
    canEdit,
    canDelete,
    terminateStopDialogOpen,
    versions,
  };
};
