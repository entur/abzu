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
  getAddStopPlaceInfo,
  getStopPlaceVersions,
  removeStopPlaceFromMultiModalStop,
} from "../../../../../actions/TiamatActions";
import { useAppDispatch } from "../../../../../store/hooks";

/**
 * Hook for managing children and adjacent sites for parent stop place
 * Handles adding/removing children and adjacent connections
 */
export const useParentStopPlaceChildren = (
  stopPlace: any,
  removingChildId: string,
  onCloseRemoveChildDialog: () => void,
  onCloseAddChildDialog: () => void,
) => {
  const dispatch = useAppDispatch();

  // Remove child handler
  const handleRemoveChild = useCallback(() => {
    if (!stopPlace?.id || !removingChildId) return;

    dispatch(
      removeStopPlaceFromMultiModalStop(stopPlace.id, removingChildId),
    ).then(() => {
      dispatch(getStopPlaceVersions(stopPlace.id!));
      onCloseRemoveChildDialog();
    });
  }, [stopPlace, removingChildId, dispatch, onCloseRemoveChildDialog]);

  // Add children handler — fetches full stop place data and adds to local state
  // with notSaved: true so the save button can persist them via addToMultiModalStopPlace
  const handleAddChildren = useCallback(
    (stopPlaceIds: string[]) => {
      if (stopPlaceIds.length === 0) return;

      dispatch(getAddStopPlaceInfo(stopPlaceIds)).then((result: any) => {
        dispatch(StopPlaceActions.addChildrenToParenStopPlace(result));
        onCloseAddChildDialog();
      });
    },
    [dispatch, onCloseAddChildDialog],
  );

  // Adjacent site handlers
  const handleOpenAddAdjacentDialog = useCallback(() => {
    dispatch(UserActions.showAddAdjacentStopDialog());
  }, [dispatch]);

  const handleCloseAddAdjacentDialog = useCallback(() => {
    dispatch(UserActions.hideAddAdjacentStopDialog());
  }, [dispatch]);

  const handleAddAdjacentSite = useCallback(
    (stopPlaceId1: string, stopPlaceId2: string) => {
      dispatch(
        StopPlaceActions.addAdjacentConnection(stopPlaceId1, stopPlaceId2),
      );
      dispatch(UserActions.hideAddAdjacentStopDialog());
    },
    [dispatch],
  );

  const handleRemoveAdjacentSite = useCallback(
    (stopPlaceId: string, adjacentRef: string) => {
      dispatch(
        StopPlaceActions.removeAdjacentConnection(stopPlaceId, adjacentRef),
      );
    },
    [dispatch],
  );

  return {
    handleRemoveChild,
    handleAddChildren,
    handleOpenAddAdjacentDialog,
    handleCloseAddAdjacentDialog,
    handleAddAdjacentSite,
    handleRemoveAdjacentSite,
  };
};
