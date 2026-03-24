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

import React from "react";
import {
  AltNamesDialog,
  ConfirmDialog,
  KeyValuesDialog,
  SaveDialog,
  TagsDialog,
  TerminateStopPlaceDialog,
  VersionsDialog,
} from "../../Dialogs";
import { InfoDialog } from "../../EditParentStopPlace/components/InfoDialog";
import { NameDescriptionDialog } from "../../EditParentStopPlace/components/NameDescriptionDialog";
import { StopPlaceDialogsProps } from "../types";

/**
 * Centralized dialog rendering for the modern EditStopPage
 * Renders all 8 dialogs used by the stop place editor
 */
export const StopPlaceDialogs: React.FC<StopPlaceDialogsProps> = ({
  stopPlace,
  canEdit,
  canDelete,
  formatMessage,
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
  infoDialogOpen,
  nameDescriptionDialogOpen,
  versions,
  handleSave,
  handleCloseSaveDialog,
  handleGoBack,
  handleCancelGoBack,
  handleUndo,
  handleCloseUndoDialog,
  handleTerminate,
  handleCloseTerminateDialog,
  handleConfirmDeleteQuay,
  handleCloseDeleteQuayDialog,
  handleConfirmDeleteParking,
  handleCloseDeleteParkingDialog,
  handleCloseRequiredFieldsMissing,
  handleCloseTagsDialog,
  handleAddTag,
  handleGetTags,
  handleRemoveTag,
  handleFindTagByName,
  handleCloseAltNamesDialog,
  handleCloseKeyValuesDialog,
  handleCloseVersionsDialog,
  handleCloseInfoDialog,
  handleCloseNameDescriptionDialog,
  handleNameChange,
  handleDescriptionChange,
}) => {
  return (
    <>
      {/* 1. Save Confirmation */}
      <SaveDialog
        open={confirmSaveDialogOpen}
        handleConfirm={handleSave}
        handleClose={handleCloseSaveDialog}
        errorMessage=""
      />

      {/* 2. Go Back Confirmation */}
      <ConfirmDialog
        open={confirmGoBackOpen}
        title={formatMessage({ id: "discard_changes_title" })}
        body={formatMessage({ id: "discard_changes_body" })}
        confirmText={formatMessage({ id: "discard_changes_confirm" })}
        cancelText={formatMessage({ id: "discard_changes_cancel" })}
        onConfirm={handleGoBack}
        onClose={handleCancelGoBack}
      />

      {/* 3. Undo Confirmation */}
      <ConfirmDialog
        open={confirmUndoOpen}
        title={formatMessage({ id: "discard_changes_title" })}
        body={formatMessage({ id: "discard_changes_body" })}
        confirmText={formatMessage({ id: "discard_changes_confirm" })}
        cancelText={formatMessage({ id: "discard_changes_cancel" })}
        onConfirm={handleUndo}
        onClose={handleCloseUndoDialog}
      />

      {/* 4. Terminate / Delete Stop Place */}
      <TerminateStopPlaceDialog
        open={terminateStopDialogOpen}
        handleClose={handleCloseTerminateDialog}
        handleConfirm={handleTerminate}
        previousValidBetween={stopPlace?.validBetween}
        stopPlace={stopPlace as any}
        canDeleteStop={canDelete}
        isLoading={false}
        serverTimeDiff={0}
        warningInfo=""
      />

      {/* 5. Delete Quay Confirmation */}
      <ConfirmDialog
        open={deleteQuayDialogOpen}
        title={formatMessage({ id: "delete_quay" })}
        body={formatMessage({ id: "delete_quay_confirm" })}
        confirmText={formatMessage({ id: "delete_quay" })}
        cancelText={formatMessage({ id: "cancel" })}
        onConfirm={handleConfirmDeleteQuay}
        onClose={handleCloseDeleteQuayDialog}
      />

      {/* 6. Delete Parking Confirmation */}
      <ConfirmDialog
        open={deleteParkingDialogOpen}
        title={formatMessage({ id: "delete_parking" })}
        body={formatMessage({ id: "delete_parking_confirm" })}
        confirmText={formatMessage({ id: "delete_parking" })}
        cancelText={formatMessage({ id: "cancel" })}
        onConfirm={handleConfirmDeleteParking}
        onClose={handleCloseDeleteParkingDialog}
      />

      {/* 7. Required Fields Missing */}
      <ConfirmDialog
        open={requiredFieldsMissingOpen}
        title={formatMessage({ id: "required_fields_missing_title" })}
        body={formatMessage({ id: "required_fields_missing_body" })}
        confirmText={formatMessage({ id: "close" })}
        cancelText=""
        onConfirm={handleCloseRequiredFieldsMissing}
        onClose={handleCloseRequiredFieldsMissing}
      />

      {/* 8. Tags Dialog */}
      <TagsDialog
        open={tagsDialogOpen}
        tags={stopPlace?.tags || []}
        handleClose={handleCloseTagsDialog}
        idReference={stopPlace?.id}
        addTag={handleAddTag}
        getTags={handleGetTags}
        removeTag={handleRemoveTag}
        findTagByName={handleFindTagByName}
      />

      {/* 9. Alt Names Dialog */}
      <AltNamesDialog
        open={altNamesDialogOpen}
        altNames={stopPlace?.alternativeNames || []}
        disabled={!canEdit}
        handleClose={handleCloseAltNamesDialog}
      />

      {/* 10. Key Values Dialog */}
      <KeyValuesDialog
        open={keyValuesDialogOpen}
        keyValues={stopPlace?.keyValues || []}
        disabled={!canEdit}
        handleClose={handleCloseKeyValuesDialog}
      />

      {/* 11. Versions Dialog */}
      <VersionsDialog
        open={versionsDialogOpen}
        versions={versions}
        handleClose={handleCloseVersionsDialog}
      />

      {/* 12. Info Dialog */}
      <InfoDialog
        open={infoDialogOpen}
        name={stopPlace?.name}
        id={stopPlace?.id || ""}
        position={stopPlace?.location as [number, number] | undefined}
        version={stopPlace?.version}
        onClose={handleCloseInfoDialog}
      />

      {/* 13. Name / Description Dialog */}
      <NameDescriptionDialog
        open={nameDescriptionDialogOpen}
        name={stopPlace?.name || ""}
        description={stopPlace?.description}
        canEdit={canEdit}
        onClose={handleCloseNameDescriptionDialog}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
      />
    </>
  );
};
