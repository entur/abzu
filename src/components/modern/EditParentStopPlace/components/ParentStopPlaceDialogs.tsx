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
import { ChildrenDialog } from ".";
import {
  AddAdjacentStopsDialog,
  AddStopPlaceToParentDialog,
  AltNamesDialog,
  ConfirmDialog,
  CoordinatesDialog,
  RemoveStopFromParentDialog,
  SaveDialog,
  TagsDialog,
  TerminateStopPlaceDialog,
  VersionsDialog,
} from "../../Dialogs";
import { useAppSelector } from "../../../../store/hooks";

interface ParentStopPlaceDialogsProps {
  stopPlace: any;
  originalStopPlace: any;
  canEdit: boolean;
  canDelete: boolean;
  removingChildId: string;
  formatMessage: IntlShape["formatMessage"];

  // Dialog states
  confirmSaveDialogOpen: boolean;
  confirmGoBackOpen: boolean;
  confirmUndoOpen: boolean;
  terminateStopDialogOpen: boolean;
  removeChildDialogOpen: boolean;
  addChildDialogOpen: boolean;
  altNamesDialogOpen: boolean;
  tagsDialogOpen: boolean;
  coordinatesDialogOpen: boolean;
  childrenDialogOpen: boolean;
  versionsDialogOpen: boolean;
  versions: any[];
  versionsLoading?: boolean;

  // Dialog handlers
  handleSave: (userInput: any) => void;
  handleCloseSaveDialog: () => void;
  handleGoBack: () => void;
  handleCancelGoBack: () => void;
  handleUndo: () => void;
  handleCloseUndoDialog: () => void;
  handleTerminate: (
    shouldHardDelete: boolean,
    shouldTerminatePermanently: boolean,
    comment: string,
    dateTime: string,
  ) => void;
  handleCloseTerminateDialog: () => void;
  handleRemoveChild: () => void;
  handleCloseRemoveChildDialog: () => void;
  handleAddChildren: (stopPlaceIds: string[]) => void;
  handleCloseAddChildDialog: () => void;
  handleCloseAltNamesDialog: () => void;
  handleCloseTagsDialog: () => void;
  handleSetCoordinates: (position: [number, number]) => void;
  handleCloseCoordinatesDialog: () => void;
  handleAddTag: (idReference: string, name: string, comment: string) => any;
  handleGetTags: (idReference: string) => any;
  handleRemoveTag: (name: string, idReference: string) => any;
  handleFindTagByName: (name: string) => any;
  handleNameChange: (value: string) => void;
  handleDescriptionChange: (value: string) => void;
  handleUrlChange: (value: string) => void;
  handleRemoveAdjacentSite: (stopPlaceId: string, adjacentRef: string) => void;
  handleOpenAddChildDialog: () => void;
  handleOpenRemoveChildDialog: (childId: string) => void;
  handleOpenAddAdjacentDialog: () => void;
  onCloseChildrenDialog: () => void;
  handleCloseVersionsDialog: () => void;
}

/**
 * All dialogs for parent stop place editor
 * Centralizes dialog rendering to keep main component clean
 */
export const ParentStopPlaceDialogs: React.FC<ParentStopPlaceDialogsProps> = ({
  stopPlace,
  originalStopPlace,
  canEdit,
  canDelete,
  removingChildId,
  formatMessage,
  confirmSaveDialogOpen,
  confirmGoBackOpen,
  confirmUndoOpen,
  terminateStopDialogOpen,
  removeChildDialogOpen,
  addChildDialogOpen,
  altNamesDialogOpen,
  tagsDialogOpen,
  coordinatesDialogOpen,
  childrenDialogOpen,
  versionsDialogOpen,
  versions,
  versionsLoading,
  handleSave,
  handleCloseSaveDialog,
  handleGoBack,
  handleCancelGoBack,
  handleUndo,
  handleCloseUndoDialog,
  handleTerminate,
  handleCloseTerminateDialog,
  handleRemoveChild,
  handleCloseRemoveChildDialog,
  handleAddChildren,
  handleCloseAddChildDialog,
  handleCloseAltNamesDialog,
  handleCloseTagsDialog,
  handleSetCoordinates,
  handleCloseCoordinatesDialog,
  handleAddTag,
  handleGetTags,
  handleRemoveTag,
  handleFindTagByName,
  handleNameChange,
  handleDescriptionChange,
  handleUrlChange,
  handleRemoveAdjacentSite,
  handleOpenAddChildDialog,
  handleOpenRemoveChildDialog,
  handleOpenAddAdjacentDialog,
  onCloseChildrenDialog,
  handleCloseVersionsDialog,
}) => {
  // Populated by UserActions.requestTerminateStopPlace, which handleOpenTerminateDialog
  // dispatches — the OTP usage lookup that warns before a stop place is terminated.
  const terminateWarning = useAppSelector(
    (state) => (state.user as any).deleteStopDialogWarning,
  );
  const serverTimeDiff = useAppSelector(
    (state) => (state.user as any).serverTimeDiff,
  );

  return (
    <>
      {/* Save Confirmation Dialog */}
      <SaveDialog
        open={confirmSaveDialogOpen}
        handleConfirm={handleSave}
        handleClose={handleCloseSaveDialog}
        errorMessage=""
      />

      {/* Go Back Confirmation Dialog */}
      <ConfirmDialog
        open={confirmGoBackOpen}
        title={formatMessage({ id: "discard_changes_title" })}
        body={formatMessage({ id: "discard_changes_body" })}
        confirmText={formatMessage({ id: "discard_changes_confirm" })}
        cancelText={formatMessage({ id: "discard_changes_cancel" })}
        onConfirm={handleGoBack}
        onClose={handleCancelGoBack}
      />

      {/* Undo Confirmation Dialog */}
      <ConfirmDialog
        open={confirmUndoOpen}
        title={formatMessage({ id: "discard_changes_title" })}
        body={formatMessage({ id: "discard_changes_body" })}
        confirmText={formatMessage({ id: "discard_changes_confirm" })}
        cancelText={formatMessage({ id: "discard_changes_cancel" })}
        onConfirm={handleUndo}
        onClose={handleCloseUndoDialog}
      />

      {/* Terminate/Delete Stop Place Dialog */}
      <TerminateStopPlaceDialog
        open={terminateStopDialogOpen}
        handleClose={handleCloseTerminateDialog}
        handleConfirm={handleTerminate}
        previousValidBetween={stopPlace?.validBetween}
        stopPlace={stopPlace as any}
        canDeleteStop={canDelete}
        isLoading={false}
        serverTimeDiff={serverTimeDiff}
        warningInfo={terminateWarning}
      />

      {/* Remove Child from Parent Dialog */}
      {removeChildDialogOpen && (
        <RemoveStopFromParentDialog
          open={removeChildDialogOpen}
          handleClose={handleCloseRemoveChildDialog}
          handleConfirm={handleRemoveChild}
          stopPlaceId={removingChildId}
          isLastChild={stopPlace?.children?.length === 1}
          isLoading={false}
        />
      )}

      {/* Add Child to Parent Dialog */}
      {addChildDialogOpen && (
        <AddStopPlaceToParentDialog
          open={addChildDialogOpen}
          handleClose={handleCloseAddChildDialog}
          handleConfirm={handleAddChildren}
        />
      )}

      {/* Add Adjacent Stop Dialog */}
      <AddAdjacentStopsDialog />

      {/* Alternative Names Dialog */}
      <AltNamesDialog
        open={altNamesDialogOpen}
        altNames={stopPlace?.alternativeNames || []}
        disabled={!canEdit}
        handleClose={handleCloseAltNamesDialog}
      />

      {/* Tags Dialog */}
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

      {/* Coordinates Dialog */}
      <CoordinatesDialog
        open={coordinatesDialogOpen}
        coordinates={
          stopPlace?.position
            ? `${stopPlace.position[0]}, ${stopPlace.position[1]}`
            : undefined
        }
        handleClose={handleCloseCoordinatesDialog}
        handleConfirm={handleSetCoordinates}
      />

      {/* Versions Dialog */}
      <VersionsDialog
        open={versionsDialogOpen}
        versions={versions}
        loading={versionsLoading}
        handleClose={handleCloseVersionsDialog}
        stopPlaceId={stopPlace?.id || ""}
        currentVersion={stopPlace?.version}
      />

      {/* Children Dialog */}
      {stopPlace && (
        <ChildrenDialog
          open={childrenDialogOpen}
          children={stopPlace.children}
          adjacentSites={stopPlace.adjacentSites}
          canEdit={canEdit}
          onClose={onCloseChildrenDialog}
          onAddChildren={handleOpenAddChildDialog}
          onRemoveChild={handleOpenRemoveChildDialog}
          onRemoveAdjacentSite={handleRemoveAdjacentSite}
          onAddAdjacentSite={handleOpenAddAdjacentDialog}
        />
      )}
    </>
  );
};
