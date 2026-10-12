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
import { replace } from "redux-first-history";
import {
  deleteParking,
  deleteQuay,
  getNeighbourStops,
  getStopPlaceVersions,
  getStopPlaceWithAll,
  saveParking,
  savePathLink,
  saveStopPlaceBasedOnType,
} from "../../../../actions/TiamatActions.modern";
import { MutationErrorCodes } from "../../../../models/ErrorCodes";
import mapToMutationVariables from "../../../../modelUtils/mapToQueryVariables";
import {
  shouldMutateParking,
  shouldMutatePathLinks,
} from "../../../../modelUtils/shouldMutate";
import AppRoutes from "../../../../routes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { findStagedDeletions } from "../utils/stagedDeletions";

/** Rejects with a MutationErrorCodes value so SaveDialog can show it. */
const failWith = (errorCode: string) => () => {
  throw errorCode;
};

export type StopPlaceSaveHandler = (userInput: {
  comment: string;
}) => Promise<void>;

/**
 * Saves the whole stop place structure as one unit: staged quay/parking
 * deletions, the stop itself, then path links and parking. The save dialog
 * stays open until every step has succeeded; a failing step rejects with its
 * error code so the dialog can show it and let the user retry (F-19).
 */
export const useStopPlaceSave = (
  stopPlace: any,
  activeMap: any,
  onCloseSaveDialog: () => void,
  onOpenRequiredFieldsMissing: () => void,
): StopPlaceSaveHandler => {
  const dispatch = useAppDispatch();
  const pathLink = useAppSelector((state) => (state.stopPlace as any).pathLink);
  const originalPathLink = useAppSelector(
    (state) => (state.stopPlace as any).originalPathLink,
  );
  const originalStopPlace = useAppSelector(
    (state) => (state.stopPlace as any).originalCurrent,
  );

  const reloadAfterSave = useCallback(
    (id: string, wasNewStop: boolean) => {
      dispatch(getStopPlaceVersions(id));
      dispatch(getNeighbourStops(id, activeMap?.getBounds()));
      if (wasNewStop) {
        /* Move off /stop_place/new so reload and shared links work (F-22);
           the route loader then fetches the saved stop. */
        dispatch(
          replace(`${import.meta.env.BASE_URL}${AppRoutes.STOP_PLACE}/${id}`),
        );
        return;
      }
      dispatch(getStopPlaceWithAll(id));
    },
    [dispatch, activeMap],
  );

  return useCallback(
    async (userInput) => {
      if (!stopPlace) return;

      if (!stopPlace.name?.trim() || !stopPlace.stopPlaceType) {
        onCloseSaveDialog();
        onOpenRequiredFieldsMissing();
        return;
      }

      const pathLinkVariables = mapToMutationVariables.mapPathLinkToVariables(
        pathLink ?? [],
      );
      const needsPathLinkSave = shouldMutatePathLinks(
        pathLinkVariables,
        pathLink,
        originalPathLink,
      );
      const needsParkingSave = shouldMutateParking(stopPlace.parking);

      // Quay and parking removals are staged in local state only, so commit them
      // first. Parking especially needs the explicit call: shouldMutateParking()
      // is false for an empty list, so removing the last parking would otherwise
      // save nothing.
      const stagedDeletions = [
        ...findStagedDeletions(originalStopPlace?.quays, stopPlace.quays).map(
          (quayId) => deleteQuay({ stopPlaceId: stopPlace.id, quayId }),
        ),
        ...findStagedDeletions(
          originalStopPlace?.parking,
          stopPlace.parking,
        ).map((parkingId) => deleteParking(parkingId)),
      ];
      await Promise.all(
        stagedDeletions.map((deletion) => dispatch(deletion)),
      ).catch(failWith(MutationErrorCodes.ERROR_STOP_PLACE));

      const id: string = await dispatch(
        saveStopPlaceBasedOnType(stopPlace, userInput),
      ).catch(failWith(MutationErrorCodes.ERROR_STOP_PLACE));

      if (needsPathLinkSave) {
        await dispatch(savePathLink(pathLinkVariables)).catch(
          failWith(MutationErrorCodes.ERROR_PATH_LINKS),
        );
      }
      if (needsParkingSave) {
        const parkingVariables = mapToMutationVariables.mapParkingToVariables(
          stopPlace.parking,
          stopPlace.id || id,
        );
        await dispatch(saveParking(parkingVariables)).catch(
          failWith(MutationErrorCodes.ERROR_PARKING),
        );
      }

      onCloseSaveDialog();
      reloadAfterSave(id, !stopPlace.id);
    },
    [
      stopPlace,
      originalStopPlace,
      pathLink,
      originalPathLink,
      dispatch,
      onCloseSaveDialog,
      onOpenRequiredFieldsMissing,
      reloadAfterSave,
    ],
  );
};
