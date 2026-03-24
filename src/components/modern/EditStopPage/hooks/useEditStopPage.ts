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
import { UseEditStopPageReturn } from "../types";
import { useStopPlaceCRUD } from "./useStopPlaceCRUD";
import { useStopPlaceDialogs } from "./useStopPlaceDialogs";
import { useStopPlaceForm } from "./useStopPlaceForm";
import { useStopPlaceParking } from "./useStopPlaceParking";
import { useStopPlaceQuays } from "./useStopPlaceQuays";
import { useStopPlaceState } from "./useStopPlaceState";

/**
 * Orchestrator hook for the modern EditStopPage
 * Combines 6 focused sub-hooks into a unified interface
 */
export const useEditStopPage = (): UseEditStopPageReturn => {
  // 1. State (Redux selectors + permissions)
  const {
    stopPlace,
    originalStopPlace,
    isModified,
    activeMap,
    canEdit,
    canDelete,
    terminateStopDialogOpen,
    versions,
  } = useStopPlaceState();

  // 2. Dialog state management (local boolean flags)
  const {
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
  } = useStopPlaceDialogs();

  // 3. CRUD (save, undo, go back, terminate)
  const {
    handleSave,
    handleAllowUserToGoBack: handleGoBackCheck,
    handleGoBack,
    handleUndo,
    handleOpenTerminateDialog,
    handleCloseTerminateDialog,
    handleTerminate,
  } = useStopPlaceCRUD(
    stopPlace,
    isModified,
    activeMap,
    handleCloseSaveDialog,
    handleCloseGoBackDialog,
    handleCloseUndoDialog,
    handleOpenRequiredFieldsMissing,
  );

  // 4. Form handlers (name, description, type, tags)
  const {
    handleNameChange,
    handleDescriptionChange,
    handleTypeChange,
    handleSubmodeChange,
    handleWeightingChange,
    handleAddTag,
    handleGetTags,
    handleRemoveTag,
    handleFindTagByName,
  } = useStopPlaceForm();

  // 5. Quay handlers
  const {
    handleDeleteQuay,
    handleConfirmDeleteQuay,
    handleQuayPublicCodeChange,
    handleQuayPrivateCodeChange,
    handleQuayDescriptionChange,
    handleAddQuay,
  } = useStopPlaceQuays(
    stopPlace,
    handleOpenDeleteQuayDialog,
    handleCloseDeleteQuayDialog,
  );

  // 6. Parking handlers
  const {
    handleDeleteParking,
    handleConfirmDeleteParking,
    handleParkingNameChange,
    handleParkingTypeChange,
    handleParkingCapacityChange,
    handleAddParking,
  } = useStopPlaceParking(
    stopPlace,
    handleOpenDeleteParkingDialog,
    handleCloseDeleteParkingDialog,
  );

  // Wrapper: open go-back dialog if modified, else navigate directly
  const handleAllowUserToGoBack = useCallback(() => {
    const shouldShowDialog = handleGoBackCheck();
    if (shouldShowDialog) {
      handleOpenGoBackDialog();
    }
  }, [handleGoBackCheck, handleOpenGoBackDialog]);

  const handleCancelGoBack = useCallback(() => {
    handleCloseGoBackDialog();
  }, [handleCloseGoBackDialog]);

  return {
    stopPlace,
    originalStopPlace,
    isModified,
    canEdit,
    canDelete,

    versions,

    confirmSaveDialogOpen,
    confirmGoBackOpen,
    confirmUndoOpen,
    terminateStopDialogOpen,
    deleteQuayDialogOpen,
    deleteParkingDialogOpen,
    requiredFieldsMissingOpen,
    tagsDialogOpen,
    altNamesDialogOpen,
    keyValuesDialogOpen,
    versionsDialogOpen,

    handleOpenSaveDialog,
    handleCloseSaveDialog,
    handleSave,
    handleAllowUserToGoBack,
    handleGoBack,
    handleCancelGoBack,
    handleOpenUndoDialog,
    handleCloseUndoDialog,
    handleUndo,
    handleOpenTerminateDialog,
    handleCloseTerminateDialog,
    handleTerminate,
    handleCloseDeleteQuayDialog,
    handleConfirmDeleteQuay,
    handleCloseDeleteParkingDialog,
    handleConfirmDeleteParking,
    handleOpenRequiredFieldsMissing,
    handleCloseRequiredFieldsMissing,
    handleOpenTagsDialog,
    handleCloseTagsDialog,
    handleOpenAltNamesDialog,
    handleCloseAltNamesDialog,
    handleOpenKeyValuesDialog,
    handleCloseKeyValuesDialog,
    handleOpenVersionsDialog,
    handleCloseVersionsDialog,
    infoDialogOpen,
    handleOpenInfoDialog,
    handleCloseInfoDialog,
    nameDescriptionDialogOpen,
    handleOpenNameDescriptionDialog,
    handleCloseNameDescriptionDialog,

    handleNameChange,
    handleDescriptionChange,
    handleTypeChange,
    handleSubmodeChange,
    handleWeightingChange,
    handleAddTag,
    handleGetTags,
    handleRemoveTag,
    handleFindTagByName,

    handleDeleteQuay,
    handleQuayPublicCodeChange,
    handleQuayPrivateCodeChange,
    handleQuayDescriptionChange,
    handleAddQuay,

    handleDeleteParking,
    handleParkingNameChange,
    handleParkingTypeChange,
    handleParkingCapacityChange,
    handleAddParking,
  };
};
