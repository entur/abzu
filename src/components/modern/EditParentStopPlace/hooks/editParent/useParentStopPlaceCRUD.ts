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
import { StopPlaceActions, UserActions } from "../../../../../actions";
import {
  deleteStopPlace,
  getStopPlaceVersions,
  terminateStop,
} from "../../../../../actions/TiamatActions.modern";
import { useAppDispatch } from "../../../../../store/hooks";
import { useParentStopPlaceSave } from "./useParentStopPlaceSave";

/**
 * Hook for managing CRUD operations for parent stop place
 * Handles save, undo, go back, terminate, and delete operations
 */
export const useParentStopPlaceCRUD = (
  stopPlace: any,
  isModified: boolean,
  activeMap: any,
  onCloseSaveDialog: () => void,
  onCloseGoBackDialog: () => void,
  onCloseUndoDialog: () => void,
) => {
  const dispatch = useAppDispatch();

  const handleSave = useParentStopPlaceSave(
    stopPlace,
    activeMap,
    onCloseSaveDialog,
  );

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

  // Terminate/Delete handlers
  const handleOpenTerminateDialog = useCallback(() => {
    if (stopPlace?.id) {
      dispatch(UserActions.requestTerminateStopPlace(stopPlace.id));
    }
  }, [stopPlace, dispatch]);

  const handleCloseTerminateDialog = useCallback(() => {
    dispatch(UserActions.hideDeleteStopDialog());
  }, [dispatch]);

  const handleTerminate = useCallback(
    (
      shouldHardDelete: boolean,
      shouldTerminatePermanently: boolean,
      comment: string,
      dateTime: string,
    ) => {
      if (!stopPlace?.id) return;

      if (shouldHardDelete) {
        dispatch(deleteStopPlace(stopPlace.id)).then((response) => {
          dispatch(UserActions.hideDeleteStopDialog());
          if (response.data.deleteStopPlace) {
            dispatch(UserActions.navigateToMainAfterDelete());
          }
        });
      } else {
        dispatch(
          terminateStop(
            stopPlace.id,
            shouldTerminatePermanently,
            comment,
            dateTime,
          ),
        ).then(() => {
          dispatch(getStopPlaceVersions(stopPlace.id!));
          dispatch(UserActions.hideDeleteStopDialog());
        });
      }
    },
    [stopPlace, dispatch],
  );

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
