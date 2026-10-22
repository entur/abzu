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
import { UserActions } from "../../../actions";
import {
  deleteStopPlace,
  getStopPlaceVersions,
  terminateStop,
} from "../../../actions/TiamatActions.modern";
import { useAppDispatch } from "../../../store/hooks";

export type TerminateStopPlace = (
  shouldHardDelete: boolean,
  shouldTerminatePermanently: boolean,
  comment: string,
  dateTime: string,
) => Promise<void>;

/**
 * Deactivates or deletes a stop place (the terminate dialog's Confirm), for
 * both the stop and the multimodal editor. Rejects when Tiamat refuses, so
 * the dialog stays open and says why: before, a failure closed nothing and
 * said nothing.
 */
export const useTerminateStopPlace = (
  stopPlaceId: string | undefined,
): TerminateStopPlace => {
  const dispatch = useAppDispatch();

  return useCallback(
    async (shouldHardDelete, shouldTerminatePermanently, comment, dateTime) => {
      if (!stopPlaceId) return;

      if (shouldHardDelete) {
        const response = (await dispatch(deleteStopPlace(stopPlaceId))) as {
          data?: { deleteStopPlace?: boolean };
        };
        if (!response?.data?.deleteStopPlace) {
          throw new Error("Stop place not deleted");
        }
        dispatch(UserActions.hideDeleteStopDialog());
        dispatch(UserActions.navigateToMainAfterDelete());
        return;
      }

      await dispatch(
        terminateStop(
          stopPlaceId,
          shouldTerminatePermanently,
          comment,
          dateTime,
        ),
      );
      dispatch(getStopPlaceVersions(stopPlaceId));
      dispatch(UserActions.hideDeleteStopDialog());
    },
    [stopPlaceId, dispatch],
  );
};
