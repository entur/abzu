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

import { useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import {
  ParentStopPlaceDialogs,
  ParentStopPlaceDrawerContent,
  ParentStopPlaceMinimizedBar,
} from "./components";
import { useEditParentStopPlace } from "./hooks/useEditParentStopPlace";
import { EditParentStopPlaceProps } from "./types";

const DRAWER_WIDTH_DESKTOP = 450;
const DRAWER_WIDTH_TABLET = 380;
const DRAWER_WIDTH_MOBILE = "100%";

/**
 * Modern Edit Parent Stop Place component
 * Refactored into focused components for better maintainability
 * Features a collapsible drawer on the left side for editing
 * while allowing the map to remain visible
 */
export const EditParentStopPlace: React.FC<EditParentStopPlaceProps> = ({
  open: controlledOpen,
  onClose: controlledOnClose,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Local state for drawer and mini dialogs (default: collapsed)
  const [internalOpen, setInternalOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [nameDescriptionDialogOpen, setNameDescriptionDialogOpen] =
    useState(false);
  const [childrenDialogOpen, setChildrenDialogOpen] = useState(false);

  // Determine if we're using controlled or uncontrolled mode
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleToggle = () => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  // Get all state and handlers from custom hook
  const {
    stopPlace,
    originalStopPlace,
    isModified,
    canEdit,
    canDelete,
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
  } = useEditParentStopPlace();

  if (!stopPlace) return null;

  // Determine drawer width based on screen size
  const drawerWidth = isMobile
    ? DRAWER_WIDTH_MOBILE
    : isTablet
      ? DRAWER_WIDTH_TABLET
      : DRAWER_WIDTH_DESKTOP;

  return (
    <>
      {/* Minimized Bar */}
      <ParentStopPlaceMinimizedBar
        stopPlace={stopPlace}
        originalStopPlace={originalStopPlace}
        isOpen={isOpen}
        isModified={isModified}
        canEdit={canEdit}
        canDelete={canDelete}
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        formatMessage={formatMessage}
        onExpand={handleToggle}
        onClose={handleAllowUserToGoBack}
        onOpenInfo={() => setInfoDialogOpen(true)}
        onOpenNameDescription={() => setNameDescriptionDialogOpen(true)}
        onOpenChildren={() => setChildrenDialogOpen(true)}
        onOpenAltNames={handleOpenAltNamesDialog}
        onOpenTags={handleOpenTagsDialog}
        onOpenCoordinates={handleOpenCoordinatesDialog}
        onOpenTerminate={handleOpenTerminateDialog}
        onOpenUndo={handleOpenUndoDialog}
        onOpenSave={handleOpenSaveDialog}
      />

      {/* Drawer Content */}
      <ParentStopPlaceDrawerContent
        stopPlace={stopPlace}
        originalStopPlace={originalStopPlace}
        isOpen={isOpen}
        isModified={isModified}
        canEdit={canEdit}
        canDelete={canDelete}
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        formatMessage={formatMessage}
        onGoBack={handleAllowUserToGoBack}
        onCollapse={handleToggle}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
        onUrlChange={handleUrlChange}
        onOpenAltNames={handleOpenAltNamesDialog}
        onOpenTags={handleOpenTagsDialog}
        onOpenCoordinates={handleOpenCoordinatesDialog}
        onOpenAddChild={handleOpenAddChildDialog}
        onOpenRemoveChild={handleOpenRemoveChildDialog}
        onRemoveAdjacentSite={handleRemoveAdjacentSite}
        onOpenAddAdjacentSite={handleOpenAddAdjacentDialog}
        onOpenTerminate={handleOpenTerminateDialog}
        onOpenUndo={handleOpenUndoDialog}
        onOpenSave={handleOpenSaveDialog}
      />

      {/* All Dialogs */}
      <ParentStopPlaceDialogs
        stopPlace={stopPlace}
        originalStopPlace={originalStopPlace}
        canEdit={canEdit}
        canDelete={canDelete}
        removingChildId={removingChildId}
        formatMessage={formatMessage}
        confirmSaveDialogOpen={confirmSaveDialogOpen}
        confirmGoBackOpen={confirmGoBackOpen}
        confirmUndoOpen={confirmUndoOpen}
        terminateStopDialogOpen={terminateStopDialogOpen}
        removeChildDialogOpen={removeChildDialogOpen}
        addChildDialogOpen={addChildDialogOpen}
        addAdjacentDialogOpen={addAdjacentDialogOpen}
        altNamesDialogOpen={altNamesDialogOpen}
        tagsDialogOpen={tagsDialogOpen}
        coordinatesDialogOpen={coordinatesDialogOpen}
        infoDialogOpen={infoDialogOpen}
        nameDescriptionDialogOpen={nameDescriptionDialogOpen}
        childrenDialogOpen={childrenDialogOpen}
        handleSave={handleSave}
        handleCloseSaveDialog={handleCloseSaveDialog}
        handleGoBack={handleGoBack}
        handleCancelGoBack={handleCancelGoBack}
        handleUndo={handleUndo}
        handleCloseUndoDialog={handleCloseUndoDialog}
        handleTerminate={handleTerminate}
        handleCloseTerminateDialog={handleCloseTerminateDialog}
        handleRemoveChild={handleRemoveChild}
        handleCloseRemoveChildDialog={handleCloseRemoveChildDialog}
        handleAddChildren={handleAddChildren}
        handleCloseAddChildDialog={handleCloseAddChildDialog}
        handleAddAdjacentSite={handleAddAdjacentSite}
        handleCloseAddAdjacentDialog={handleCloseAddAdjacentDialog}
        handleCloseAltNamesDialog={handleCloseAltNamesDialog}
        handleCloseTagsDialog={handleCloseTagsDialog}
        handleSetCoordinates={handleSetCoordinates}
        handleCloseCoordinatesDialog={handleCloseCoordinatesDialog}
        handleAddTag={handleAddTag}
        handleGetTags={handleGetTags}
        handleRemoveTag={handleRemoveTag}
        handleFindTagByName={handleFindTagByName}
        handleNameChange={handleNameChange}
        handleDescriptionChange={handleDescriptionChange}
        handleUrlChange={handleUrlChange}
        handleRemoveAdjacentSite={handleRemoveAdjacentSite}
        handleOpenAddChildDialog={handleOpenAddChildDialog}
        handleOpenRemoveChildDialog={handleOpenRemoveChildDialog}
        handleOpenAddAdjacentDialog={handleOpenAddAdjacentDialog}
        onCloseInfoDialog={() => setInfoDialogOpen(false)}
        onCloseNameDescriptionDialog={() => setNameDescriptionDialogOpen(false)}
        onCloseChildrenDialog={() => setChildrenDialogOpen(false)}
      />
    </>
  );
};
