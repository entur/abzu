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

import {
  Box,
  Divider,
  Drawer,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Entities } from "../../../models/Entities";
import { ConfirmDialog, SaveGroupDialog } from "../Dialogs";
import {
  GroupOfStopPlacesActions,
  GroupOfStopPlacesDetails,
  GroupOfStopPlacesHeader,
  GroupOfStopPlacesList,
  InfoDialog,
  MinimizedBar,
  NameDescriptionDialog,
  StopPlacesDialog,
} from "./components";
import { useEditGroupOfStopPlaces } from "./hooks/useEditGroupOfStopPlaces";
import { EditGroupOfStopPlacesProps, RootState } from "./types";

const DRAWER_WIDTH_DESKTOP = 450;
const DRAWER_WIDTH_TABLET = 380;
const DRAWER_WIDTH_MOBILE = "100%";

/**
 * Modern Edit Group of Stop Places component
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

  // Local state for drawer and dialogs (default: collapsed)
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
      {/* Minimized Bar - Mobile: bottom, Desktop/Tablet: below header */}
      {!isOpen && (
        <>
          {isMobile ? (
            <Slide direction="up" in={!isOpen} mountOnEnter unmountOnExit>
              <Box>
                <MinimizedBar
                  name={originalGOS.name}
                  id={originalGOS.id}
                  entityType={Entities.GROUP_OF_STOP_PLACE}
                  hasId={!!groupOfStopPlaces.id}
                  isModified={isModified}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  hasName={!!groupOfStopPlaces.name}
                  isMobile={true}
                  onExpand={handleToggle}
                  onClose={handleAllowUserToGoBack}
                  onOpenInfo={() => setInfoDialogOpen(true)}
                  onOpenNameDescription={() =>
                    setNameDescriptionDialogOpen(true)
                  }
                  onOpenStopPlaces={() => setStopPlacesDialogOpen(true)}
                  onSave={handleOpenSaveDialog}
                  onUndo={handleOpenUndoDialog}
                  onRemove={handleOpenDeleteDialog}
                />
              </Box>
            </Slide>
          ) : (
            <Box
              sx={{
                position: "fixed",
                left: 0,
                top: 64,
                width: drawerWidth,
                zIndex: theme.zIndex.drawer,
              }}
            >
              <MinimizedBar
                name={originalGOS.name}
                id={originalGOS.id}
                entityType={Entities.GROUP_OF_STOP_PLACE}
                hasId={!!groupOfStopPlaces.id}
                isModified={isModified}
                canEdit={canEdit}
                canDelete={canDelete}
                hasName={!!groupOfStopPlaces.name}
                isMobile={false}
                onExpand={handleToggle}
                onClose={handleAllowUserToGoBack}
                onOpenInfo={() => setInfoDialogOpen(true)}
                onOpenNameDescription={() => setNameDescriptionDialogOpen(true)}
                onOpenStopPlaces={() => setStopPlacesDialogOpen(true)}
                onSave={handleOpenSaveDialog}
                onUndo={handleOpenUndoDialog}
                onRemove={handleOpenDeleteDialog}
              />
            </Box>
          )}
        </>
      )}

      {/* Main Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        transitionDuration={0}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: { xs: 56, sm: 64 },
            height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
            transform: isMobile
              ? isOpen
                ? "translateY(0)"
                : "translateY(100%)"
              : isOpen
                ? "translateY(0)"
                : "translateY(calc(-100% + 65px))",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            bgcolor: "background.paper",
          }}
        >
          {/* Header with close and collapse buttons */}
          <GroupOfStopPlacesHeader
            groupOfStopPlaces={originalGOS}
            onGoBack={handleAllowUserToGoBack}
            onCollapse={handleToggle}
          />

          <Divider />

          {/* Scrollable Content */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* Details Form */}
            <GroupOfStopPlacesDetails
              name={groupOfStopPlaces.name}
              description={groupOfStopPlaces.description}
              canEdit={canEdit}
              onNameChange={handleNameChange}
              onDescriptionChange={handleDescriptionChange}
            />

            {/* Stop Places List */}
            <GroupOfStopPlacesList
              stopPlaces={groupOfStopPlaces.members}
              canEdit={canEdit}
              onAddMembers={handleAddMembers}
              onRemoveMember={handleRemoveMember}
            />
          </Box>

          {/* Action Buttons */}
          <GroupOfStopPlacesActions
            hasId={!!groupOfStopPlaces.id}
            isModified={isModified}
            canEdit={canEdit}
            canDelete={canDelete}
            hasName={!!groupOfStopPlaces.name}
            onRemove={handleOpenDeleteDialog}
            onUndo={handleOpenUndoDialog}
            onSave={handleOpenSaveDialog}
          />
        </Box>
      </Drawer>

      {/* Info Dialog */}
      <InfoDialog
        open={infoDialogOpen}
        name={originalGOS.name}
        id={originalGOS.id || ""}
        centerPosition={centerPosition}
        created={originalGOS.created}
        modified={originalGOS.modified}
        version={originalGOS.version}
        onClose={() => setInfoDialogOpen(false)}
      />

      {/* Name and Description Dialog */}
      <NameDescriptionDialog
        open={nameDescriptionDialogOpen}
        name={groupOfStopPlaces.name}
        description={groupOfStopPlaces.description || ""}
        canEdit={canEdit}
        onClose={() => setNameDescriptionDialogOpen(false)}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
      />

      {/* Stop Places Dialog */}
      <StopPlacesDialog
        open={stopPlacesDialogOpen}
        stopPlaces={groupOfStopPlaces.members || []}
        canEdit={canEdit}
        onClose={() => setStopPlacesDialogOpen(false)}
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
