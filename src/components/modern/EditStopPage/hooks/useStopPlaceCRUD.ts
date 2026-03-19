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
import {
  deleteStopPlace,
  getNeighbourStops,
  getStopPlaceVersions,
  getStopPlaceWithAll,
  saveStopPlaceBasedOnType,
  terminateStop,
} from "../../../../actions/TiamatActions";
import { useAppDispatch } from "../../../../store/hooks";

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

  const handleSave = useCallback(
    (userInput: any) => {
      if (!stopPlace) return;

      if (!stopPlace.name?.trim() || !stopPlace.stopPlaceType) {
        onCloseSaveDialog();
        onOpenRequiredFieldsMissing();
        return;
      }

      onCloseSaveDialog();

      dispatch(saveStopPlaceBasedOnType(stopPlace, userInput)).then(
        (id: string) => {
          dispatch(getStopPlaceVersions(id));
          dispatch(getNeighbourStops(id, activeMap?.getBounds()));
          dispatch(getStopPlaceWithAll(id));
        },
      );
    },
    [
      stopPlace,
      dispatch,
      activeMap,
      onCloseSaveDialog,
      onOpenRequiredFieldsMissing,
    ],
  );

  const handleAllowUserToGoBack = useCallback(() => {
    if (isModified) {
      return true;
    }
    dispatch(UserActions.navigateTo("/", ""));
    return false;
  }, [isModified, dispatch]);

  const handleGoBack = useCallback(() => {
    onCloseGoBackDialog();
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

  const handleTerminate = useCallback(
    (
      shouldHardDelete: boolean,
      shouldTerminatePermanently: boolean,
      comment: string,
      dateTime: string,
    ) => {
      if (!stopPlace?.id) return;

      if (shouldHardDelete) {
        dispatch(deleteStopPlace(stopPlace.id)).then((response: any) => {
          dispatch(UserActions.hideDeleteStopDialog());
          if (response?.data?.deleteStopPlace) {
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
          dispatch(getStopPlaceVersions(stopPlace.id));
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
