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

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  Box,
  Divider,
  Drawer,
  Fab,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { ConfirmDialog, SaveGroupDialog } from "../Dialogs";
import {
  GroupOfStopPlacesActions,
  GroupOfStopPlacesDetails,
  GroupOfStopPlacesHeader,
  GroupOfStopPlacesList,
} from "./components";
import { useEditGroupOfStopPlaces } from "./hooks/useEditGroupOfStopPlaces";
import { EditGroupOfStopPlacesProps } from "./types";

const DRAWER_WIDTH_DESKTOP = 450;
const DRAWER_WIDTH_TABLET = 380;
const DRAWER_WIDTH_MOBILE = "100%";

/**
 * Modern Edit Group of Stop Places component
 * Features a collapsible drawer on the left side for editing
 * while allowing the map to remain visible
 */
export const EditGroupOfStopPlaces: React.FC<EditGroupOfStopPlacesProps> = ({
  open: controlledOpen,
  onClose: controlledOnClose,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Local state for drawer
  const [internalOpen, setInternalOpen] = useState(true);

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

  // Determine drawer width based on screen size
  const drawerWidth = isMobile
    ? DRAWER_WIDTH_MOBILE
    : isTablet
      ? DRAWER_WIDTH_TABLET
      : DRAWER_WIDTH_DESKTOP;

  return (
    <>
      {/* Toggle Button (only shown when drawer is closed) */}
      {!isOpen && (
        <Fab
          color="primary"
          size="small"
          onClick={handleToggle}
          sx={{
            position: "fixed",
            left: 16,
            top: 80,
            zIndex: theme.zIndex.drawer - 1,
          }}
        >
          <ChevronRightIcon />
        </Fab>
      )}

      {/* Main Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={isOpen}
        onClose={handleToggle}
        sx={{
          width: isOpen ? drawerWidth : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: isMobile ? 0 : 64, // Account for header on desktop
            height: isMobile ? "100%" : "calc(100% - 64px)",
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
          {/* Header with back button and close drawer button */}
          <Box sx={{ position: "relative" }}>
            <GroupOfStopPlacesHeader
              groupOfStopPlaces={originalGOS}
              onGoBack={handleAllowUserToGoBack}
            />
            {!isMobile && (
              <Fab
                size="small"
                onClick={handleToggle}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "background.paper",
                  boxShadow: 1,
                  "&:hover": {
                    bgcolor: "background.default",
                  },
                }}
              >
                <ChevronLeftIcon />
              </Fab>
            )}
          </Box>

          <Divider />

          {/* Section Title */}
          <Box sx={{ py: 1.5, px: 2, bgcolor: "background.default" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatMessage({ id: "group_of_stop_places" })}
            </Typography>
          </Box>

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
