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
import { StopPlaceActions } from "../../../../../actions";
import { moveStopIfAllowed } from "../../../../../actions/StopPlaceActions.modern";
import {
  addTag,
  findTagByName,
  getTags,
  removeTag,
} from "../../../../../actions/TiamatActions.modern";
import { useAppDispatch } from "../../../../../store/hooks";
import { useMapNotice } from "../../../Map/notices/useMapNotice";

const OUTSIDE_AREA_MESSAGE_ID = "create_not_allowed";

/**
 * Hook for managing form field changes, coordinates, and tags
 * Handles all user input operations for parent stop place
 */
export const useParentStopPlaceForm = (
  onCloseCoordinatesDialog: () => void,
) => {
  const dispatch = useAppDispatch();
  const showNotice = useMapNotice();

  // Field change handlers
  const handleNameChange = useCallback(
    (value: string) => {
      dispatch(StopPlaceActions.changeStopName(value));
    },
    [dispatch],
  );

  const handleDescriptionChange = useCallback(
    (value: string) => {
      dispatch(StopPlaceActions.changeStopDescription(value));
    },
    [dispatch],
  );

  const handleUrlChange = useCallback(
    (value: string) => {
      dispatch(StopPlaceActions.changeStopUrl(value));
    },
    [dispatch],
  );

  // Coordinates handler: only inside the user's edit area (F-106).
  const handleSetCoordinates = useCallback(
    async (position: [number, number]) => {
      onCloseCoordinatesDialog();
      const isMoved = await dispatch(moveStopIfAllowed(position)).catch(
        () => false,
      );
      if (!isMoved) {
        showNotice(OUTSIDE_AREA_MESSAGE_ID);
        return;
      }
      dispatch(StopPlaceActions.changeMapCenter(position, 14));
    },
    [dispatch, onCloseCoordinatesDialog, showNotice],
  );

  // Tag operation handlers
  const handleAddTag = useCallback(
    (idReference: string, name: string, comment: string) => {
      return dispatch(addTag(idReference, name, comment));
    },
    [dispatch],
  );

  const handleGetTags = useCallback(
    (idReference: string) => {
      return dispatch(getTags(idReference));
    },
    [dispatch],
  );

  const handleRemoveTag = useCallback(
    (name: string, idReference: string) => {
      return dispatch(removeTag(name, idReference));
    },
    [dispatch],
  );

  const handleFindTagByName = useCallback(
    (name: string) => {
      return dispatch(findTagByName(name));
    },
    [dispatch],
  );

  return {
    handleNameChange,
    handleDescriptionChange,
    handleUrlChange,
    handleSetCoordinates,
    handleAddTag,
    handleGetTags,
    handleRemoveTag,
    handleFindTagByName,
  };
};
