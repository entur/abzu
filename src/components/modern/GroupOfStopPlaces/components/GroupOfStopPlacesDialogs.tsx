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

import { IntlShape } from "react-intl";
import { InfoDialog, NameDescriptionDialog, StopPlacesDialog } from ".";
import { ConfirmDialog, SaveGroupDialog } from "../../Dialogs";

interface GroupOfStopPlacesDialogsProps {
  groupOfStopPlaces: any;
  originalGOS: any;
  centerPosition: [number, number] | undefined;
  canEdit: boolean;
  formatMessage: IntlShape["formatMessage"];

  // Dialog states
  infoDialogOpen: boolean;
  nameDescriptionDialogOpen: boolean;
  stopPlacesDialogOpen: boolean;
  confirmSaveDialogOpen: boolean;
  confirmGoBackOpen: boolean;
  confirmUndoOpen: boolean;
  confirmDeleteDialogOpen: boolean;

  // Dialog handlers
  handleSave: () => void;
  handleCloseSaveDialog: () => void;
  handleGoBack: () => void;
  handleCancelGoBack: () => void;
  handleUndo: () => void;
  handleCloseUndoDialog: () => void;
  handleDelete: () => void;
  handleCloseDeleteDialog: () => void;
  handleNameChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handleAddMembers: (memberIds: string[]) => void;
  handleRemoveMember: (memberId: string) => void;
  onCloseInfoDialog: () => void;
  onCloseNameDescriptionDialog: () => void;
  onCloseStopPlacesDialog: () => void;
}

/**
 * All dialogs for group of stop places editor
 * Centralizes dialog rendering to keep main component clean
 */
export const GroupOfStopPlacesDialogs: React.FC<
  GroupOfStopPlacesDialogsProps
> = ({
  groupOfStopPlaces,
  originalGOS,
  centerPosition,
  canEdit,
  formatMessage,
  infoDialogOpen,
  nameDescriptionDialogOpen,
  stopPlacesDialogOpen,
  confirmSaveDialogOpen,
  confirmGoBackOpen,
  confirmUndoOpen,
  confirmDeleteDialogOpen,
  handleSave,
  handleCloseSaveDialog,
  handleGoBack,
  handleCancelGoBack,
  handleUndo,
  handleCloseUndoDialog,
  handleDelete,
  handleCloseDeleteDialog,
  handleNameChange,
  handleDescriptionChange,
  handleAddMembers,
  handleRemoveMember,
  onCloseInfoDialog,
  onCloseNameDescriptionDialog,
  onCloseStopPlacesDialog,
}) => {
  return (
    <>
      {/* Info Dialog */}
      <InfoDialog
        open={infoDialogOpen}
        name={originalGOS.name}
        id={originalGOS.id || ""}
        centerPosition={centerPosition}
        created={originalGOS.created}
        modified={originalGOS.modified}
        version={originalGOS.version}
        onClose={onCloseInfoDialog}
      />

      {/* Name and Description Dialog */}
      <NameDescriptionDialog
        open={nameDescriptionDialogOpen}
        name={groupOfStopPlaces.name}
        description={groupOfStopPlaces.description || ""}
        canEdit={canEdit}
        onClose={onCloseNameDescriptionDialog}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
      />

      {/* Stop Places Dialog */}
      <StopPlacesDialog
        open={stopPlacesDialogOpen}
        stopPlaces={groupOfStopPlaces.members || []}
        canEdit={canEdit}
        onClose={onCloseStopPlacesDialog}
        onAddMembers={handleAddMembers}
        onRemoveMember={handleRemoveMember}
      />

      {/* Save Confirmation Dialog */}
      <SaveGroupDialog
        open={confirmSaveDialogOpen}
        onSave={handleSave}
        onClose={handleCloseSaveDialog}
      />

      {/* Go Back Confirmation Dialog */}
      <ConfirmDialog
        open={confirmGoBackOpen}
        title={formatMessage({ id: "discard_changes_title" })}
        body={formatMessage({ id: "discard_changes_group_body" })}
        confirmText={formatMessage({ id: "discard_changes_confirm" })}
        cancelText={formatMessage({ id: "discard_changes_cancel" })}
        onConfirm={handleGoBack}
        onClose={handleCancelGoBack}
      />

      {/* Undo Confirmation Dialog */}
      <ConfirmDialog
        open={confirmUndoOpen}
        title={formatMessage({ id: "discard_changes_title" })}
        body={formatMessage({ id: "discard_changes_group_body" })}
        confirmText={formatMessage({ id: "discard_changes_confirm" })}
        cancelText={formatMessage({ id: "discard_changes_cancel" })}
        onConfirm={handleUndo}
        onClose={handleCloseUndoDialog}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDeleteDialogOpen}
        title={formatMessage({ id: "delete_group_title" })}
        body={formatMessage({ id: "delete_group_body" })}
        confirmText={formatMessage({ id: "delete_group_confirm" })}
        cancelText={formatMessage({ id: "delete_group_cancel" })}
        onConfirm={handleDelete}
        onClose={handleCloseDeleteDialog}
      />
    </>
  );
};
