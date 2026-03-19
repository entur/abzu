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
import {
  deleteQuay,
  getStopPlaceWithAll,
} from "../../../../actions/TiamatActions";
import { useAppDispatch } from "../../../../store/hooks";

/**
 * Hook for managing quay expand/collapse, deletion, and field edits
 * Index-based approach matches the Redux state shape for quays
 */
export const useStopPlaceQuays = (
  stopPlace: any,
  onOpenDeleteQuayDialog: () => void,
  onCloseDeleteQuayDialog: () => void,
) => {
  const dispatch = useAppDispatch();
  const [pendingDeleteQuayIndex, setPendingDeleteQuayIndex] = useState<
    number | null
  >(null);

  const handleDeleteQuay = useCallback(
    (index: number) => {
      setPendingDeleteQuayIndex(index);
      onOpenDeleteQuayDialog();
    },
    [onOpenDeleteQuayDialog],
  );

  const handleConfirmDeleteQuay = useCallback(() => {
    if (pendingDeleteQuayIndex === null || !stopPlace?.quays) return;
    const quay = stopPlace.quays[pendingDeleteQuayIndex];

    onCloseDeleteQuayDialog();

    if (!quay?.id) {
      // Unsaved quay — remove from local state only
      dispatch(
        StopPlaceActions.removeElementByType(pendingDeleteQuayIndex, "quay"),
      );
    } else {
      // Saved quay — server delete then reload
      dispatch(deleteQuay({ id: quay.id })).then(() => {
        if (stopPlace.id) {
          dispatch(getStopPlaceWithAll(stopPlace.id));
        }
      });
    }
    setPendingDeleteQuayIndex(null);
  }, [pendingDeleteQuayIndex, stopPlace, dispatch, onCloseDeleteQuayDialog]);

  const handleQuayPublicCodeChange = useCallback(
    (index: number, value: string) => {
      dispatch(StopPlaceActions.changePublicCodeName(index, value, "quay"));
    },
    [dispatch],
  );

  const handleQuayPrivateCodeChange = useCallback(
    (index: number, value: string) => {
      dispatch(StopPlaceActions.changePrivateCodeName(index, value, "quay"));
    },
    [dispatch],
  );

  const handleQuayDescriptionChange = useCallback(
    (index: number, value: string) => {
      dispatch(StopPlaceActions.changeElementDescription(index, value, "quay"));
    },
    [dispatch],
  );

  const handleAddQuay = useCallback(
    (position: [number, number]) => {
      dispatch(StopPlaceActions.addElementToStop("quay", position));
    },
    [dispatch],
  );

  return {
    handleDeleteQuay,
    handleConfirmDeleteQuay,
    handleQuayPublicCodeChange,
    handleQuayPrivateCodeChange,
    handleQuayDescriptionChange,
    handleAddQuay,
  };
};
