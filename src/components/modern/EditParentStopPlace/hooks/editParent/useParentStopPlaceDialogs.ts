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

/**
 * Hook for managing all dialog states in parent stop place editor
 * Handles open/close state for all dialogs and removal tracking
 */
export const useParentStopPlaceDialogs = () => {
  const [confirmSaveDialogOpen, setConfirmSaveDialogOpen] = useState(false);
  const [confirmGoBackOpen, setConfirmGoBackOpen] = useState(false);
  const [confirmUndoOpen, setConfirmUndoOpen] = useState(false);
  const [terminateStopDialogOpen, setTerminateStopDialogOpen] = useState(false);
  const [removeChildDialogOpen, setRemoveChildDialogOpen] = useState(false);
  const [addChildDialogOpen, setAddChildDialogOpen] = useState(false);
  const [addAdjacentDialogOpen, setAddAdjacentDialogOpen] = useState(false);
  const [altNamesDialogOpen, setAltNamesDialogOpen] = useState(false);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [coordinatesDialogOpen, setCoordinatesDialogOpen] = useState(false);
  const [removingChildId, setRemovingChildId] = useState("");

  // Save dialog
  const handleOpenSaveDialog = useCallback(() => {
    setConfirmSaveDialogOpen(true);
  }, []);

  const handleCloseSaveDialog = useCallback(() => {
    setConfirmSaveDialogOpen(false);
  }, []);

  // Go back dialog
  const handleOpenGoBackDialog = useCallback(() => {
    setConfirmGoBackOpen(true);
  }, []);

  const handleCloseGoBackDialog = useCallback(() => {
    setConfirmGoBackOpen(false);
  }, []);

  // Undo dialog
  const handleOpenUndoDialog = useCallback(() => {
    setConfirmUndoOpen(true);
  }, []);

  const handleCloseUndoDialog = useCallback(() => {
    setConfirmUndoOpen(false);
  }, []);

  // Remove child dialog
  const handleOpenRemoveChildDialog = useCallback((stopPlaceId: string) => {
    setRemovingChildId(stopPlaceId);
    setRemoveChildDialogOpen(true);
  }, []);

  const handleCloseRemoveChildDialog = useCallback(() => {
    setRemoveChildDialogOpen(false);
    setRemovingChildId("");
  }, []);

  // Add child dialog
  const handleOpenAddChildDialog = useCallback(() => {
    setAddChildDialogOpen(true);
  }, []);

  const handleCloseAddChildDialog = useCallback(() => {
    setAddChildDialogOpen(false);
  }, []);

  // Alt names dialog
  const handleOpenAltNamesDialog = useCallback(() => {
    setAltNamesDialogOpen(true);
  }, []);

  const handleCloseAltNamesDialog = useCallback(() => {
    setAltNamesDialogOpen(false);
  }, []);

  // Tags dialog
  const handleOpenTagsDialog = useCallback(() => {
    setTagsDialogOpen(true);
  }, []);

  const handleCloseTagsDialog = useCallback(() => {
    setTagsDialogOpen(false);
  }, []);

  // Coordinates dialog
  const handleOpenCoordinatesDialog = useCallback(() => {
    setCoordinatesDialogOpen(true);
  }, []);

  const handleCloseCoordinatesDialog = useCallback(() => {
    setCoordinatesDialogOpen(false);
  }, []);

  return {
    // States
    confirmSaveDialogOpen,
    confirmGoBackOpen,
    confirmUndoOpen,
    terminateStopDialogOpen,
    removeChildDialogOpen,
    addChildDialogOpen,
    addAdjacentDialogOpen,
    altNamesDialogOpen,
    tagsDialogOpen,
    coordinatesDialogOpen,
    removingChildId,

    // Handlers
    handleOpenSaveDialog,
    handleCloseSaveDialog,
    handleOpenGoBackDialog,
    handleCloseGoBackDialog,
    handleOpenUndoDialog,
    handleCloseUndoDialog,
    handleOpenRemoveChildDialog,
    handleCloseRemoveChildDialog,
    handleOpenAddChildDialog,
    handleCloseAddChildDialog,
    handleOpenAltNamesDialog,
    handleCloseAltNamesDialog,
    handleOpenTagsDialog,
    handleCloseTagsDialog,
    handleOpenCoordinatesDialog,
    handleCloseCoordinatesDialog,
  };
};
