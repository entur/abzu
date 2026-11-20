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
  removeStopPlaceFromMultiModalStop,
  terminateStop,
} from "../../../actions/TiamatActions.modern";
import { useAppDispatch } from "../../../store/hooks";
import { useReloadStopPlace } from "./hooks/useReloadStopPlace";
import { requireMutationResult } from "./requireMutationResult";

export type TerminateStopPlace = (
  shouldHardDelete: boolean,
  shouldTerminatePermanently: boolean,
  comment: string,
  dateTime: string,
) => Promise<void>;

const NO_CHILDREN: string[] = [];

const requireResult = requireMutationResult(
  new Error("Tiamat refused the change"),
);

/**
 * Deactivates or deletes a stop place (the terminate dialog's Confirm), for
 * both the stop and the multimodal editor. Rejects when Tiamat refuses, so
 * the dialog stays open and says why.
 *
 * A multimodal parent's saved children are detached first, so they stay
 * active as ordinary stops instead of expiring with the parent. If the
 * deactivation then fails, the detach is already stored and the parent in
 * the store has no children left, so a retry only deactivates.
 *
 * Afterwards the stop and its map surroundings are reloaded: the mutation
 * response alone left the editor looking active and the multimodal lines on
 * the map (F-118).
 */
export const useTerminateStopPlace = (
  stopPlaceId: string | undefined,
  childIdsToDetach: string[] = NO_CHILDREN,
): TerminateStopPlace => {
  const dispatch = useAppDispatch();
  const reloadStopPlace = useReloadStopPlace();

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

      if (childIdsToDetach.length) {
        requireResult(
          await dispatch(
            removeStopPlaceFromMultiModalStop(stopPlaceId, childIdsToDetach),
          ),
        );
      }

      requireResult(
        await dispatch(
          terminateStop(
            stopPlaceId,
            shouldTerminatePermanently,
            comment,
            dateTime,
          ),
        ),
      );
      dispatch(UserActions.hideDeleteStopDialog());
      reloadStopPlace(stopPlaceId);
    },
    [stopPlaceId, childIdsToDetach, dispatch, reloadStopPlace],
  );
};
