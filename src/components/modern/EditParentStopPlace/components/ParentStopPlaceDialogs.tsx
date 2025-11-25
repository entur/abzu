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
import { ChildrenDialog, InfoDialog, NameDescriptionDialog } from ".";
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
} from "../../Dialogs";

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
  addAdjacentDialogOpen: boolean;
  altNamesDialogOpen: boolean;
  tagsDialogOpen: boolean;
  coordinatesDialogOpen: boolean;
  infoDialogOpen: boolean;
  nameDescriptionDialogOpen: boolean;
  childrenDialogOpen: boolean;

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
  handleAddAdjacentSite: (stopPlaceId1: string, stopPlaceId2: string) => void;
  handleCloseAddAdjacentDialog: () => void;
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
  onCloseInfoDialog: () => void;
  onCloseNameDescriptionDialog: () => void;
  onCloseChildrenDialog: () => void;
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
  addAdjacentDialogOpen,
  altNamesDialogOpen,
  tagsDialogOpen,
  coordinatesDialogOpen,
  infoDialogOpen,
  nameDescriptionDialogOpen,
  childrenDialogOpen,
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
  handleAddAdjacentSite,
  handleCloseAddAdjacentDialog,
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
  onCloseInfoDialog,
  onCloseNameDescriptionDialog,
  onCloseChildrenDialog,
}) => {
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
        serverTimeDiff={0}
        warningInfo=""
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
      <AddAdjacentStopsDialog
        open={addAdjacentDialogOpen}
        handleClose={handleCloseAddAdjacentDialog}
        handleConfirm={handleAddAdjacentSite}
      />

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

      {/* Info Dialog */}
      <InfoDialog
        open={infoDialogOpen}
        name={originalStopPlace?.name}
        id={originalStopPlace?.id || ""}
        position={stopPlace?.position}
        created={stopPlace?.validBetween?.fromDate}
        modified={stopPlace?.validBetween?.toDate}
        version={stopPlace?.version}
        onClose={onCloseInfoDialog}
      />

      {/* Name and Description Dialog */}
      <NameDescriptionDialog
        open={nameDescriptionDialogOpen}
        name={stopPlace?.name || ""}
        description={stopPlace?.description}
        url={stopPlace?.url}
        canEdit={canEdit}
        onClose={onCloseNameDescriptionDialog}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
        onUrlChange={handleUrlChange}
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
