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

import { useCallback, useMemo } from "react";
import { StopPlaceActions, UserActions } from "../../../../../actions";
import { openTerminateDialogWithoutUsageCheck } from "../../../../../actions/StopPlaceActions.modern";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { useTerminateStopPlace } from "../../../Shared/useTerminateStopPlace";
import { useParentStopPlaceSave } from "./useParentStopPlaceSave";

/**
 * Hook for managing CRUD operations for parent stop place
 * Handles save, undo, go back, terminate, and delete operations
 */
export const useParentStopPlaceCRUD = (
  stopPlace: any,
  isModified: boolean,
  onCloseSaveDialog: () => void,
  onCloseGoBackDialog: () => void,
  onCloseUndoDialog: () => void,
) => {
  const dispatch = useAppDispatch();

  const handleSave = useParentStopPlaceSave(stopPlace, onCloseSaveDialog);

  // Go back handlers
  const handleAllowUserToGoBack = useCallback(() => {
    if (isModified) {
      return true;
    }
    dispatch(UserActions.navigateTo("/", ""));
    return false;
  }, [isModified, dispatch]);

  /* The user confirmed discarding, so discard first: the unsaved-changes
     guard then lets the navigation through without asking again. */
  const handleGoBack = useCallback(() => {
    onCloseGoBackDialog();
    dispatch(StopPlaceActions.discardChangesForEditingStop());
    dispatch(UserActions.navigateTo("/", ""));
  }, [dispatch, onCloseGoBackDialog]);

  // Undo handler
  const handleUndo = useCallback(() => {
    onCloseUndoDialog();
    dispatch(StopPlaceActions.discardChangesForEditingStop());
  }, [dispatch, onCloseUndoDialog]);

  /* Deactivating a parent detaches its saved children first (they stay
     active), so no stop with journeys expires: skip the usage lookup. */
  const handleOpenTerminateDialog = useCallback(() => {
    if (stopPlace?.id) {
      dispatch(openTerminateDialogWithoutUsageCheck());
    }
  }, [stopPlace, dispatch]);

  const handleCloseTerminateDialog = useCallback(() => {
    dispatch(UserActions.hideDeleteStopDialog());
  }, [dispatch]);

  const savedChildren = useAppSelector(
    (state) => (state.stopPlace as any).originalCurrent?.children,
  ) as { id: string }[] | undefined;
  const savedChildIds = useMemo(
    () => (savedChildren ?? []).map((child) => child.id),
    [savedChildren],
  );
  const handleTerminate = useTerminateStopPlace(stopPlace?.id, savedChildIds);

  return {
    handleSave,
    handleAllowUserToGoBack,
    handleGoBack,
    handleUndo,
    handleOpenTerminateDialog,
    handleCloseTerminateDialog,
    handleTerminate,
  };
};
