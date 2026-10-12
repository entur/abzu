/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { useCallback } from "react";
import { StopPlaceActions, UserActions } from "../../../../actions";
import {
  moveQuaysToNewStop,
  saveStopPlaceBasedOnType,
} from "../../../../actions/TiamatActions.modern";
import * as types from "../../../../actions/Types";
import stopTypes from "../../../../models/stopTypes";
import formatHelpers from "../../../../modelUtils/mapToClient";
import AppRoutes from "../../../../routes";
import { useAppDispatch } from "../../../../store/hooks";

export interface MoveQuaysToNewStopInput {
  quayIds: string[];
  sourceStopId: string;
  name: string;
  stopType: string;
}

export type MoveQuaysToNewStopHandler = (
  input: MoveQuaysToNewStopInput,
) => Promise<void>;

/**
 * Moves quays to a new stop and gives that stop the name and type the user
 * entered (F-40). Tiamat's move creates the stop without either, so the
 * returned stop is saved once more with them, through the same mapping as a
 * normal editor save. The new stop is then opened, freshly loaded.
 *
 * If naming fails the new stop still exists, so it is opened anyway: the
 * editor's required-field rules then ask for the missing name and type.
 */
export const useMoveQuaysToNewStop = (): MoveQuaysToNewStopHandler => {
  const dispatch = useAppDispatch();

  return useCallback(
    async ({ quayIds, sourceStopId, name, stopType }) => {
      const quayList = quayIds.join(", ");
      const versionComment = `Flyttet ${quayList} fra ${sourceStopId}`;

      const response = await dispatch(
        moveQuaysToNewStop(
          quayIds,
          `Flyttet ${quayList} til nytt stoppested`,
          versionComment,
        ),
      );
      const movedStop = response?.data?.moveQuaysToStop;
      if (!movedStop?.id) throw new Error("Moved quays returned no stop");

      // The user accepted discarding unsaved edits to the source stop.
      dispatch(StopPlaceActions.discardChangesForEditingStop());

      const namedStop = {
        ...formatHelpers.mapStopToClientStop(movedStop, true),
        name,
        stopPlaceType: stopType,
        transportMode:
          stopTypes[stopType as keyof typeof stopTypes]?.transportMode ?? null,
        submode: null,
      };
      await dispatch(
        saveStopPlaceBasedOnType(namedStop, { comment: versionComment }),
      )
        .then(() => dispatch(UserActions.openSnackbar(types.SUCCESS)))
        .catch(() => undefined);

      dispatch(
        UserActions.navigateTo(`/${AppRoutes.STOP_PLACE}/`, movedStop.id),
      );
    },
    [dispatch],
  );
};
