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
import { useDispatch } from "react-redux";
import { StopPlaceActions } from "../../../../../actions";
import { AlternativeName, EditingState, PendingOperation } from "../types";
import { useAltNamesConflictDetection } from "./useAltNamesConflictDetection";

/**
 * Hook for managing alternative names state and operations
 */
export const useAltNamesState = (altNames: AlternativeName[]) => {
  const dispatch = useDispatch();

  const [state, setState] = useState<EditingState>({
    isEditing: false,
    editingId: null,
    lang: "",
    value: "",
    type: "",
  });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingOperation, setPendingOperation] =
    useState<PendingOperation | null>(null);

  const { getConflictingIndex } = useAltNamesConflictDetection(altNames);

  /**
   * Reset form state
   */
  const resetState = useCallback(() => {
    setState({
      lang: "",
      value: "",
      type: "",
      isEditing: false,
      editingId: null,
    });
  }, []);

  /**
   * Handle adding a pending alternative name (after conflict confirmation)
   */
  const handleAddPendingAltName = useCallback(() => {
    if (!pendingOperation) return;

    dispatch(StopPlaceActions.addAltName(pendingOperation.payload) as any);
    dispatch(
      StopPlaceActions.removeAltName(pendingOperation.removeIndex) as any,
    );

    resetState();
    setConfirmDialogOpen(false);
    setPendingOperation(null);
  }, [dispatch, pendingOperation, resetState]);

  /**
   * Add a new alternative name
   */
  const handleAddAltName = useCallback(() => {
    const { lang, value, type } = state;

    const payload = {
      nameType: type,
      lang,
      value,
    };

    const conflictIndex = getConflictingIndex(lang, type);

    if (conflictIndex > -1) {
      setPendingOperation({ payload, removeIndex: conflictIndex });
      setConfirmDialogOpen(true);
    } else {
      dispatch(StopPlaceActions.addAltName(payload) as any);
      setState({
        ...state,
        lang: "",
        value: "",
        type: "",
      });
    }
  }, [state, dispatch, getConflictingIndex]);

  /**
   * Edit an existing alternative name
   */
  const handleEditAltName = useCallback(() => {
    const { lang, value, type, editingId } = state;

    if (editingId === null) return;

    const payload = {
      nameType: type,
      lang,
      value,
      id: editingId,
    };

    const conflictIndex = getConflictingIndex(lang, type, editingId);

    if (conflictIndex > -1 && conflictIndex !== editingId) {
      setPendingOperation({ payload, removeIndex: conflictIndex });
      setConfirmDialogOpen(true);
    } else {
      dispatch(StopPlaceActions.editAltName(payload) as any);
      resetState();
    }
  }, [state, dispatch, getConflictingIndex, resetState]);

  /**
   * Remove an alternative name
   */
  const handleRemoveName = useCallback(
    (index: number) => {
      dispatch(StopPlaceActions.removeAltName(index) as any);
    },
    [dispatch],
  );

  /**
   * Start editing an alternative name
   */
  const handleStartEdit = useCallback(
    (index: number) => {
      const altName = altNames[index];
      setState({
        isEditing: true,
        editingId: index,
        lang: altName.name.lang,
        value: altName.name.value,
        type: altName.nameType,
      });
    },
    [altNames],
  );

  /**
   * Cancel editing
   */
  const handleCancelEdit = useCallback(() => {
    resetState();
  }, [resetState]);

  /**
   * Close conflict confirmation dialog
   */
  const handleCloseConfirmDialog = useCallback(() => {
    setConfirmDialogOpen(false);
    setPendingOperation(null);
  }, []);

  /**
   * Update state field
   */
  const updateStateField = useCallback(
    (field: keyof EditingState, value: string) => {
      setState({ ...state, [field]: value });
    },
    [state],
  );

  return {
    state,
    confirmDialogOpen,
    updateStateField,
    handleAddAltName,
    handleEditAltName,
    handleRemoveName,
    handleStartEdit,
    handleCancelEdit,
    handleAddPendingAltName,
    handleCloseConfirmDialog,
  };
};
