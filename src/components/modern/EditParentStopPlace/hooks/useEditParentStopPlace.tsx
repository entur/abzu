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
import { UseEditParentStopPlaceReturn } from "../types";
import { useParentStopPlaceChildren } from "./editParent/useParentStopPlaceChildren";
import { useParentStopPlaceCRUD } from "./editParent/useParentStopPlaceCRUD";
import { useParentStopPlaceDialogs } from "./editParent/useParentStopPlaceDialogs";
import { useParentStopPlaceForm } from "./editParent/useParentStopPlaceForm";
import { useParentStopPlaceState } from "./editParent/useParentStopPlaceState";

/**
 * Main orchestrator hook for parent stop place editing
 * Combines all sub-hooks and provides unified interface
 * Refactored from 427 lines into 6 focused hooks
 */
export const useEditParentStopPlace = (): UseEditParentStopPlaceReturn => {
  // 1. State management (Redux selectors, permissions)
  const {
    stopPlace,
    originalStopPlace,
    isModified,
    versions,
    isLoading,
    activeMap,
    canEdit,
    canDelete,
  } = useParentStopPlaceState();

  // 2. Dialog state management
  const {
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
  } = useParentStopPlaceDialogs();

  // 3. CRUD operations (save, undo, go back, terminate)
  const {
    handleSave,
    handleAllowUserToGoBack: handleGoBackCheck,
    handleGoBack,
    handleUndo,
    handleOpenTerminateDialog,
    handleCloseTerminateDialog,
    handleTerminate,
  } = useParentStopPlaceCRUD(
    stopPlace,
    isModified,
    activeMap,
    handleCloseSaveDialog,
    handleCloseGoBackDialog,
    handleCloseUndoDialog,
  );

  // 4. Children and adjacent sites management
  const {
    handleRemoveChild,
    handleAddChildren,
    handleOpenAddAdjacentDialog,
    handleCloseAddAdjacentDialog,
    handleAddAdjacentSite,
    handleRemoveAdjacentSite,
  } = useParentStopPlaceChildren(
    stopPlace,
    removingChildId,
    handleCloseRemoveChildDialog,
    handleCloseAddChildDialog,
  );

  // 5. Form fields, coordinates, and tags
  const {
    handleNameChange,
    handleDescriptionChange,
    handleUrlChange,
    handleSetCoordinates,
    handleAddTag,
    handleGetTags,
    handleRemoveTag,
    handleFindTagByName,
  } = useParentStopPlaceForm(handleCloseCoordinatesDialog);

  // Wrapper for go back that opens dialog if modified
  const handleAllowUserToGoBack = useCallback(() => {
    const shouldShowDialog = handleGoBackCheck();
    if (shouldShowDialog) {
      handleOpenGoBackDialog();
    }
  }, [handleGoBackCheck, handleOpenGoBackDialog]);

  // Wrapper for cancel go back
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
    isLoading,
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
    handleOpenRemoveChildDialog,
    handleCloseRemoveChildDialog,
    handleRemoveChild,
    handleOpenAddChildDialog,
    handleCloseAddChildDialog,
    handleAddChildren,
    handleOpenAddAdjacentDialog,
    handleCloseAddAdjacentDialog,
    handleAddAdjacentSite,
    handleOpenAltNamesDialog,
    handleCloseAltNamesDialog,
    handleOpenTagsDialog,
    handleCloseTagsDialog,
    handleOpenCoordinatesDialog,
    handleCloseCoordinatesDialog,
    handleSetCoordinates,
    handleNameChange,
    handleDescriptionChange,
    handleUrlChange,
    handleRemoveAdjacentSite,
    handleAddTag,
    handleGetTags,
    handleRemoveTag,
    handleFindTagByName,
    removingChildId,
  };
};
