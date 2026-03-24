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
 * Hook for managing all dialog open/close state in the stop place editor
 * Note: terminateStopDialogOpen is managed by Redux (via useStopPlaceState)
 */
export const useStopPlaceDialogs = () => {
  const [confirmSaveDialogOpen, setConfirmSaveDialogOpen] = useState(false);
  const [confirmGoBackOpen, setConfirmGoBackOpen] = useState(false);
  const [confirmUndoOpen, setConfirmUndoOpen] = useState(false);
  const [deleteQuayDialogOpen, setDeleteQuayDialogOpen] = useState(false);
  const [deleteParkingDialogOpen, setDeleteParkingDialogOpen] = useState(false);
  const [requiredFieldsMissingOpen, setRequiredFieldsMissingOpen] =
    useState(false);
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [altNamesDialogOpen, setAltNamesDialogOpen] = useState(false);
  const [keyValuesDialogOpen, setKeyValuesDialogOpen] = useState(false);
  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [nameDescriptionDialogOpen, setNameDescriptionDialogOpen] =
    useState(false);

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

  // Delete quay dialog
  const handleOpenDeleteQuayDialog = useCallback(() => {
    setDeleteQuayDialogOpen(true);
  }, []);

  const handleCloseDeleteQuayDialog = useCallback(() => {
    setDeleteQuayDialogOpen(false);
  }, []);

  // Delete parking dialog
  const handleOpenDeleteParkingDialog = useCallback(() => {
    setDeleteParkingDialogOpen(true);
  }, []);

  const handleCloseDeleteParkingDialog = useCallback(() => {
    setDeleteParkingDialogOpen(false);
  }, []);

  // Required fields missing dialog
  const handleOpenRequiredFieldsMissing = useCallback(() => {
    setRequiredFieldsMissingOpen(true);
  }, []);

  const handleCloseRequiredFieldsMissing = useCallback(() => {
    setRequiredFieldsMissingOpen(false);
  }, []);

  // Tags dialog
  const handleOpenTagsDialog = useCallback(() => {
    setTagsDialogOpen(true);
  }, []);

  const handleCloseTagsDialog = useCallback(() => {
    setTagsDialogOpen(false);
  }, []);

  // Alt names dialog
  const handleOpenAltNamesDialog = useCallback(() => {
    setAltNamesDialogOpen(true);
  }, []);

  const handleCloseAltNamesDialog = useCallback(() => {
    setAltNamesDialogOpen(false);
  }, []);

  // Key values dialog
  const handleOpenKeyValuesDialog = useCallback(() => {
    setKeyValuesDialogOpen(true);
  }, []);

  const handleCloseKeyValuesDialog = useCallback(() => {
    setKeyValuesDialogOpen(false);
  }, []);

  // Versions dialog
  const handleOpenVersionsDialog = useCallback(() => {
    setVersionsDialogOpen(true);
  }, []);

  const handleCloseVersionsDialog = useCallback(() => {
    setVersionsDialogOpen(false);
  }, []);

  // Info dialog
  const handleOpenInfoDialog = useCallback(() => {
    setInfoDialogOpen(true);
  }, []);

  const handleCloseInfoDialog = useCallback(() => {
    setInfoDialogOpen(false);
  }, []);

  // Name/description dialog
  const handleOpenNameDescriptionDialog = useCallback(() => {
    setNameDescriptionDialogOpen(true);
  }, []);

  const handleCloseNameDescriptionDialog = useCallback(() => {
    setNameDescriptionDialogOpen(false);
  }, []);

  return {
    confirmSaveDialogOpen,
    confirmGoBackOpen,
    confirmUndoOpen,
    deleteQuayDialogOpen,
    deleteParkingDialogOpen,
    requiredFieldsMissingOpen,
    tagsDialogOpen,
    handleOpenSaveDialog,
    handleCloseSaveDialog,
    handleOpenGoBackDialog,
    handleCloseGoBackDialog,
    handleOpenUndoDialog,
    handleCloseUndoDialog,
    handleOpenDeleteQuayDialog,
    handleCloseDeleteQuayDialog,
    handleOpenDeleteParkingDialog,
    handleCloseDeleteParkingDialog,
    handleOpenRequiredFieldsMissing,
    handleCloseRequiredFieldsMissing,
    handleOpenTagsDialog,
    handleCloseTagsDialog,
    altNamesDialogOpen,
    handleOpenAltNamesDialog,
    handleCloseAltNamesDialog,
    keyValuesDialogOpen,
    handleOpenKeyValuesDialog,
    handleCloseKeyValuesDialog,
    versionsDialogOpen,
    handleOpenVersionsDialog,
    handleCloseVersionsDialog,
    infoDialogOpen,
    handleOpenInfoDialog,
    handleCloseInfoDialog,
    nameDescriptionDialogOpen,
    handleOpenNameDescriptionDialog,
    handleCloseNameDescriptionDialog,
  };
};
