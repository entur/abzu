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

import { useCallback } from "react";
import { StopPlaceActions, UserActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";
import { useTerminateStopPlace } from "../../Shared/useTerminateStopPlace";
import { useStopPlaceSave } from "./useStopPlaceSave";

/**
 * Hook for CRUD operations on regular stop places
 * Handles save, undo, go back, and terminate
 */
export const useStopPlaceCRUD = (
  stopPlace: any,
  isModified: boolean,
  activeMap: any,
  onCloseSaveDialog: () => void,
  onCloseGoBackDialog: () => void,
  onCloseUndoDialog: () => void,
  onOpenRequiredFieldsMissing: () => void,
) => {
  const dispatch = useAppDispatch();

  const handleSave = useStopPlaceSave(
    stopPlace,
    activeMap,
    onCloseSaveDialog,
    onOpenRequiredFieldsMissing,
  );

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

  const handleUndo = useCallback(() => {
    onCloseUndoDialog();
    dispatch(StopPlaceActions.discardChangesForEditingStop());
  }, [dispatch, onCloseUndoDialog]);

  const handleOpenTerminateDialog = useCallback(() => {
    if (stopPlace?.id) {
      dispatch(UserActions.requestTerminateStopPlace(stopPlace.id));
    }
  }, [stopPlace, dispatch]);

  const handleCloseTerminateDialog = useCallback(() => {
    dispatch(UserActions.hideDeleteStopDialog());
  }, [dispatch]);

  const handleTerminate = useTerminateStopPlace(stopPlace?.id);

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
