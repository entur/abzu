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

import { useEffect } from "react";
import { UserActions } from "../../../../actions";
import {
  getStopPlaceWithAll,
  moveQuaysToStop,
} from "../../../../actions/TiamatActions.modern";
import * as types from "../../../../actions/Types";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import type { NeighbourStop } from "../../Map/markers/types";
import { useDialogMutation } from "./useDialogMutation";

export interface MovingQuay {
  id: string;
  publicCode?: string;
  privateCode?: string;
  stopPlaceId?: string;
}

interface MoveQuayToCurrent {
  open: boolean;
  movingQuay: MovingQuay | null;
  currentStopId?: string;
  stopHasBeenModified: boolean;
  /** Name of the quay's stop when this is its last quay (F-99), else null. */
  emptiedStopName: string | null;
  isMoving: boolean;
  errorMessageId: string | null;
  confirm: () => Promise<void>;
  close: () => void;
}

/**
 * State and actions for moving a neighbour's quay into the open stop
 * ("Flytt til gjeldende", F-46). Tiamat's refusal (403 for a source the user
 * can't edit) is shown in the dialog instead of being swallowed (F-108).
 */
export const useMoveQuayToCurrent = (): MoveQuayToCurrent => {
  const dispatch = useAppDispatch();
  const open = useAppSelector(
    (state) => !!(state as any).mapUtils?.moveQuayDialogOpen,
  );
  const movingQuay = useAppSelector(
    (state) => (state as any).mapUtils?.movingQuay as MovingQuay | null,
  );
  const currentStopId = useAppSelector(
    (state) => (state as any).stopPlace?.current?.id as string | undefined,
  );
  const stopHasBeenModified = useAppSelector(
    (state) => !!(state as any).stopPlace?.stopHasBeenModified,
  );
  const sourceQuayCount = useAppSelector((state) => {
    const sourceId = movingQuay?.stopPlaceId;
    if (!sourceId) return null;
    const quays = (state as any).stopPlace?.neighbourStopQuays?.[sourceId];
    return Array.isArray(quays) ? quays.length : null;
  });
  const sourceStop = useAppSelector((state) =>
    (((state as any).stopPlace?.neighbourStops ?? []) as NeighbourStop[]).find(
      (stop) => stop.id === movingQuay?.stopPlaceId,
    ),
  );
  const { isRunning, errorMessageId, run, resetError } =
    useDialogMutation("move_quay_failed");

  useEffect(() => {
    if (open) resetError();
  }, [open, resetError]);

  const close = () => dispatch(UserActions.closeMoveQuayDialog());

  const confirm = async () => {
    if (!movingQuay || !currentStopId) return;
    const versionComment = `Flyttet ${movingQuay.id} til ${currentStopId}`;
    const isMoved = await run(() =>
      dispatch(
        moveQuaysToStop(
          currentStopId,
          movingQuay.id,
          versionComment,
          versionComment,
        ),
      ),
    );
    if (!isMoved) return;
    dispatch(UserActions.openSnackbar(types.SUCCESS));
    close();
    dispatch(getStopPlaceWithAll(currentStopId));
  };

  const isLastQuay = sourceQuayCount === 1;
  const emptiedStopName = isLastQuay
    ? (sourceStop?.name ?? movingQuay?.stopPlaceId ?? null)
    : null;

  return {
    open,
    movingQuay,
    currentStopId,
    stopHasBeenModified,
    emptiedStopName,
    isMoving: isRunning,
    errorMessageId,
    confirm,
    close,
  };
};
