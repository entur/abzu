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
import { UserActions } from "../../../../../actions";
import {
  addToMultiModalStopPlace,
  createParentStopPlace,
  getNeighbourStops,
  getStopPlaceVersions,
  getStopPlaceWithAll,
  removeStopPlaceFromMultiModalStop,
  saveParentStopPlace,
  savePathLink,
} from "../../../../../actions/TiamatActions.modern";
import { MutationErrorCodes } from "../../../../../models/ErrorCodes";
import mapToMutationVariables from "../../../../../modelUtils/mapToQueryVariables";
import { shouldMutatePathLinks } from "../../../../../modelUtils/shouldMutate";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { findStagedChildChanges } from "../../utils/stagedChildChanges";

/** Rejects with a MutationErrorCodes value so SaveDialog can show it. */
const failWith = (errorCode: string) => () => {
  throw errorCode;
};

export type ParentStopPlaceSaveHandler = (userInput: {
  comment: string;
}) => Promise<void>;

/**
 * Saves a multimodal stop place as one unit. Attaching and detaching children
 * are both staged until Save (F-37), then sent as add → remove → parent save,
 * so a swap never leaves the parent with zero children in between. Afterwards
 * the parent is reloaded from the server, so the editor shows what Tiamat
 * actually stored, including an expiry it may have applied (F-49).
 */
export const useParentStopPlaceSave = (
  stopPlace: any,
  activeMap: any,
  onCloseSaveDialog: () => void,
): ParentStopPlaceSaveHandler => {
  const dispatch = useAppDispatch();
  const pathLink = useAppSelector((state) => (state.stopPlace as any).pathLink);
  const originalPathLink = useAppSelector(
    (state) => (state.stopPlace as any).originalPathLink,
  );
  const originalStopPlace = useAppSelector(
    (state) => (state.stopPlace as any).originalCurrent,
  );

  const savePathLinkIfNeeded = useCallback(async () => {
    const pathLinkVariables = mapToMutationVariables.mapPathLinkToVariables(
      pathLink ?? [],
    );
    if (!shouldMutatePathLinks(pathLinkVariables, pathLink, originalPathLink)) {
      return;
    }
    await dispatch(savePathLink(pathLinkVariables)).catch(
      failWith(MutationErrorCodes.ERROR_PATH_LINKS),
    );
  }, [dispatch, pathLink, originalPathLink]);

  const reloadAfterSave = useCallback(
    (id: string) => {
      dispatch(getStopPlaceVersions(id));
      dispatch(getNeighbourStops(id, activeMap?.getBounds()));
      dispatch(getStopPlaceWithAll(id));
    },
    [dispatch, activeMap],
  );

  const createParent = useCallback(
    async (userInput: { comment: string }) => {
      const variables = mapToMutationVariables.mapParentStopToVariables(
        stopPlace,
        userInput,
      );
      const response = await dispatch(
        createParentStopPlace(variables as any),
      ).catch(failWith(MutationErrorCodes.ERROR_STOP_PLACE));
      const id = response?.data?.createMultiModalStopPlace?.id;
      if (!id) throw MutationErrorCodes.ERROR_STOP_PLACE;
      onCloseSaveDialog();
      dispatch(UserActions.navigateTo(`/stop_place/`, id));
    },
    [stopPlace, dispatch, onCloseSaveDialog],
  );

  const updateParent = useCallback(
    async (userInput: { comment: string }) => {
      const parentId: string = stopPlace.id;
      const { childrenToAdd, childrenToRemove } = findStagedChildChanges(
        originalStopPlace?.children,
        stopPlace.children,
      );
      const variables = mapToMutationVariables.mapParentStopToVariables(
        stopPlace,
        userInput,
      );

      if (childrenToAdd.length) {
        await dispatch(addToMultiModalStopPlace(parentId, childrenToAdd)).catch(
          failWith(MutationErrorCodes.ERROR_STOP_PLACE),
        );
      }
      if (childrenToRemove.length) {
        await dispatch(
          removeStopPlaceFromMultiModalStop(parentId, childrenToRemove),
        ).catch(failWith(MutationErrorCodes.ERROR_STOP_PLACE));
      }
      await dispatch(saveParentStopPlace(variables)).catch(
        failWith(MutationErrorCodes.ERROR_STOP_PLACE),
      );
      await savePathLinkIfNeeded();

      onCloseSaveDialog();
      reloadAfterSave(parentId);
    },
    [
      stopPlace,
      originalStopPlace,
      dispatch,
      onCloseSaveDialog,
      savePathLinkIfNeeded,
      reloadAfterSave,
    ],
  );

  return useCallback(
    async (userInput) => {
      if (!stopPlace) return;
      if (stopPlace.isNewStop) {
        await createParent(userInput);
        return;
      }
      await updateParent(userInput);
    },
    [stopPlace, createParent, updateParent],
  );
};
