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
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";

/**
 * Hook for managing parking expand/collapse, deletion, and field edits
 */
export const useStopPlaceParking = (
  stopPlace: any,
  onOpenDeleteParkingDialog: () => void,
  onCloseDeleteParkingDialog: () => void,
) => {
  const dispatch = useAppDispatch();
  const [pendingDeleteParkingIndex, setPendingDeleteParkingIndex] = useState<
    number | null
  >(null);

  const handleDeleteParking = useCallback(
    (index: number) => {
      setPendingDeleteParkingIndex(index);
      onOpenDeleteParkingDialog();
    },
    [onOpenDeleteParkingDialog],
  );

  /**
   * Removes the parking from local state only — saved and unsaved parking behave
   * identically. Deletions of already-saved parking are derived at save time by
   * diffing against `originalCurrent` (see `findStagedDeletions`), so the server
   * is not touched until the user presses Save, and Undo restores it.
   */
  const handleConfirmDeleteParking = useCallback(() => {
    if (pendingDeleteParkingIndex === null || !stopPlace?.parking) return;

    onCloseDeleteParkingDialog();
    dispatch(
      StopPlaceActions.removeElementByType(
        pendingDeleteParkingIndex,
        "parking",
      ),
    );
    setPendingDeleteParkingIndex(null);
  }, [
    pendingDeleteParkingIndex,
    stopPlace,
    dispatch,
    onCloseDeleteParkingDialog,
  ]);

  const handleParkingNameChange = useCallback(
    (index: number, value: string) => {
      dispatch(StopPlaceActions.changeParkingName(index, value));
    },
    [dispatch],
  );

  const handleParkingTypeChange = useCallback(
    (index: number, value: string) => {
      dispatch(StopPlaceActions.changeParkingLayout(index, value));
    },
    [dispatch],
  );

  const handleParkingCapacityChange = useCallback(
    (index: number, value: string) => {
      dispatch(
        StopPlaceActions.changeParkingTotalCapacity(index, Number(value)),
      );
    },
    [dispatch],
  );

  return {
    handleDeleteParking,
    handleConfirmDeleteParking,
    handleParkingNameChange,
    handleParkingTypeChange,
    handleParkingCapacityChange,
  };
};
