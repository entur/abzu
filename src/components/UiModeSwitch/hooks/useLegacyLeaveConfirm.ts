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

import { useCallback, useState } from "react";
import { StopPlaceActions, StopPlacesGroupActions } from "../../../actions";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import type { ConfirmLeave } from "./useUiModeSwitch";

const STOP_PLACE_PATH = "/stop_place/";
const GROUP_PATH = "/group/";

export interface LegacyLeaveConfirm {
  confirmLeave: ConfirmLeave;
  isConfirmOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * The classic UI's unsaved-changes check for leaving the app (the switch to
 * the modern UI unmounts it): an edited stop place or group asks first, the
 * same way the classic header does before it navigates (F-123). Confirming
 * discards the edits first: the store outlives the switch, and the modern UI
 * must not open with the classic UI's unsaved changes.
 */
export const useLegacyLeaveConfirm = (): LegacyLeaveConfirm => {
  const dispatch = useAppDispatch();
  const pathname = useAppSelector(
    (state) => (state as any).router?.location?.pathname as string | undefined,
  );
  const isStopPlaceModified = useAppSelector(
    (state) => !!(state.stopPlace as any).stopHasBeenModified,
  );
  const isGroupModified = useAppSelector(
    (state) => !!(state as any).stopPlacesGroup?.isModified,
  );
  const [pendingLeave, setPendingLeave] = useState<(() => void) | null>(null);

  const hasUnsavedChanges =
    (isStopPlaceModified && !!pathname?.includes(STOP_PLACE_PATH)) ||
    (isGroupModified && !!pathname?.includes(GROUP_PATH));

  const confirmLeave = useCallback<ConfirmLeave>(
    (leave) => {
      if (!hasUnsavedChanges) {
        leave();
        return;
      }
      setPendingLeave(() => leave);
    },
    [hasUnsavedChanges],
  );

  const onConfirm = useCallback(() => {
    dispatch(
      isGroupModified
        ? StopPlacesGroupActions.discardChanges()
        : StopPlaceActions.discardChangesForEditingStop(),
    );
    pendingLeave?.();
    setPendingLeave(null);
  }, [dispatch, isGroupModified, pendingLeave]);

  const onCancel = useCallback(() => setPendingLeave(null), []);

  return {
    confirmLeave,
    isConfirmOpen: pendingLeave !== null,
    onConfirm,
    onCancel,
  };
};
