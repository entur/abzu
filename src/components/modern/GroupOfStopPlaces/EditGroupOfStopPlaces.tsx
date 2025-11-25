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
import { useSelector } from "react-redux";
import {
  GroupOfStopPlacesDialogs,
  GroupOfStopPlacesDrawerContent,
  GroupOfStopPlacesMinimizedBar,
} from "./components";
import { useEditGroupOfStopPlaces } from "./hooks/useEditGroupOfStopPlaces";
import { EditGroupOfStopPlacesProps, RootState } from "./types";

const DRAWER_WIDTH_DESKTOP = 450;
const DRAWER_WIDTH_TABLET = 380;
const DRAWER_WIDTH_MOBILE = "100%";

/**
 * Modern Edit Group of Stop Places component
 * Refactored into focused components for better maintainability
 * Features a collapsible drawer with minimized bar and full edit view
 */
export const EditGroupOfStopPlaces: React.FC<EditGroupOfStopPlacesProps> = ({
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
  const [stopPlacesDialogOpen, setStopPlacesDialogOpen] = useState(false);

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
    groupOfStopPlaces,
    originalGOS,
    isModified,
    canEdit,
    canDelete,
    confirmSaveDialogOpen,
    confirmGoBackOpen,
    confirmUndoOpen,
    confirmDeleteDialogOpen,
    handleOpenSaveDialog,
    handleCloseSaveDialog,
    handleSave,
    handleAllowUserToGoBack,
    handleGoBack,
    handleCancelGoBack,
    handleOpenUndoDialog,
    handleCloseUndoDialog,
    handleUndo,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDelete,
    handleNameChange,
    handleDescriptionChange,
    handleAddMembers,
    handleRemoveMember,
  } = useEditGroupOfStopPlaces();

  // Get centerPosition from Redux for InfoDialog
  const centerPosition = useSelector(
    (state: RootState) => state.stopPlacesGroup.centerPosition,
  );

  // Determine drawer width based on screen size
  const drawerWidth = isMobile
    ? DRAWER_WIDTH_MOBILE
    : isTablet
      ? DRAWER_WIDTH_TABLET
      : DRAWER_WIDTH_DESKTOP;

  return (
    <>
      {/* Minimized Bar */}
      <GroupOfStopPlacesMinimizedBar
        groupOfStopPlaces={groupOfStopPlaces}
        originalGOS={originalGOS}
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
        onOpenStopPlaces={() => setStopPlacesDialogOpen(true)}
        onOpenDelete={handleOpenDeleteDialog}
        onOpenUndo={handleOpenUndoDialog}
        onOpenSave={handleOpenSaveDialog}
      />

      {/* Drawer Content */}
      <GroupOfStopPlacesDrawerContent
        groupOfStopPlaces={groupOfStopPlaces}
        originalGOS={originalGOS}
        isOpen={isOpen}
        isModified={isModified}
        canEdit={canEdit}
        canDelete={canDelete}
        isMobile={isMobile}
        drawerWidth={drawerWidth}
        onGoBack={handleAllowUserToGoBack}
        onCollapse={handleToggle}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
        onAddMembers={handleAddMembers}
        onRemoveMember={handleRemoveMember}
        onOpenDelete={handleOpenDeleteDialog}
        onOpenUndo={handleOpenUndoDialog}
        onOpenSave={handleOpenSaveDialog}
      />

      {/* All Dialogs */}
      <GroupOfStopPlacesDialogs
        groupOfStopPlaces={groupOfStopPlaces}
        originalGOS={originalGOS}
        centerPosition={centerPosition}
        canEdit={canEdit}
        formatMessage={formatMessage}
        infoDialogOpen={infoDialogOpen}
        nameDescriptionDialogOpen={nameDescriptionDialogOpen}
        stopPlacesDialogOpen={stopPlacesDialogOpen}
        confirmSaveDialogOpen={confirmSaveDialogOpen}
        confirmGoBackOpen={confirmGoBackOpen}
        confirmUndoOpen={confirmUndoOpen}
        confirmDeleteDialogOpen={confirmDeleteDialogOpen}
        handleSave={handleSave}
        handleCloseSaveDialog={handleCloseSaveDialog}
        handleGoBack={handleGoBack}
        handleCancelGoBack={handleCancelGoBack}
        handleUndo={handleUndo}
        handleCloseUndoDialog={handleCloseUndoDialog}
        handleDelete={handleDelete}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        handleNameChange={handleNameChange}
        handleDescriptionChange={handleDescriptionChange}
        handleAddMembers={handleAddMembers}
        handleRemoveMember={handleRemoveMember}
        onCloseInfoDialog={() => setInfoDialogOpen(false)}
        onCloseNameDescriptionDialog={() => setNameDescriptionDialogOpen(false)}
        onCloseStopPlacesDialog={() => setStopPlacesDialogOpen(false)}
      />
    </>
  );
};
