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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
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
} from "../Dialogs";
import {
  ParentStopPlaceActions,
  ParentStopPlaceChildren,
  ParentStopPlaceDetails,
  ParentStopPlaceHeader,
} from "./components";
import { MinimizedBar } from "./components/MinimizedBar";
import { useEditParentStopPlace } from "./hooks/useEditParentStopPlace";
import { EditParentStopPlaceProps } from "./types";

const DRAWER_WIDTH_DESKTOP = 450;
const DRAWER_WIDTH_TABLET = 380;
const DRAWER_WIDTH_MOBILE = "100%";

/**
 * Modern Edit Parent Stop Place component
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
      {/* Minimized Bar - Mobile: bottom, Desktop/Tablet: below header */}
      {!isOpen && originalStopPlace && (
        <>
          {isMobile ? (
            <Slide direction="up" in={!isOpen} mountOnEnter unmountOnExit>
              <Box>
                <MinimizedBar
                  name={originalStopPlace.name}
                  id={originalStopPlace.id}
                  onExpand={handleToggle}
                  onClose={handleAllowUserToGoBack}
                  isMobile={true}
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
                name={originalStopPlace.name}
                id={originalStopPlace.id}
                onExpand={handleToggle}
                onClose={handleAllowUserToGoBack}
                isMobile={false}
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
        transitionDuration={0} // Disable default drawer transition
        sx={{
          width: drawerWidth, // Always maintain width
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            top: { xs: 56, sm: 64 }, // Match header height (56px mobile, 64px desktop)
            height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
            // Custom slide animation
            transform: isMobile
              ? isOpen
                ? "translateY(0)"
                : "translateY(100%)"
              : isOpen
                ? "translateY(0)"
                : "translateY(calc(-100% + 65px))", // 65px = minimized bar height
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
          {/* Header with close button and collapse button */}
          {originalStopPlace && (
            <ParentStopPlaceHeader
              stopPlace={stopPlace}
              originalStopPlace={originalStopPlace}
              onGoBack={handleAllowUserToGoBack}
              onCollapse={handleToggle}
            />
          )}

          <Divider />

          {/* Section Title */}
          <Box sx={{ py: 1.5, px: 2, bgcolor: "background.default" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {formatMessage({ id: "parentStopPlace" })}
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
            <ParentStopPlaceDetails
              name={stopPlace.name}
              description={stopPlace.description}
              url={stopPlace.url}
              location={stopPlace.location}
              hasExpired={stopPlace.hasExpired}
              version={stopPlace.version}
              tags={stopPlace.tags}
              importedId={stopPlace.importedId}
              alternativeNames={stopPlace.alternativeNames}
              belongsToGroup={stopPlace.belongsToGroup}
              groups={stopPlace.groups}
              canEdit={canEdit}
              onNameChange={handleNameChange}
              onDescriptionChange={handleDescriptionChange}
              onUrlChange={handleUrlChange}
              onOpenAltNames={handleOpenAltNamesDialog}
              onOpenTags={handleOpenTagsDialog}
              onOpenCoordinates={handleOpenCoordinatesDialog}
            />

            {/* Children List */}
            <ParentStopPlaceChildren
              children={stopPlace.children}
              adjacentSites={stopPlace.adjacentSites}
              canEdit={canEdit}
              onAddChildren={handleOpenAddChildDialog}
              onRemoveChild={handleOpenRemoveChildDialog}
              onRemoveAdjacentSite={handleRemoveAdjacentSite}
              onAddAdjacentSite={handleOpenAddAdjacentDialog}
            />
          </Box>

          {/* Action Buttons */}
          <ParentStopPlaceActions
            hasId={!!stopPlace.id}
            isModified={isModified}
            canEdit={canEdit}
            canDelete={canDelete}
            hasName={!!stopPlace.name}
            hasExpired={!!stopPlace.hasExpired}
            hasChildren={stopPlace.children.length > 0}
            onTerminate={handleOpenTerminateDialog}
            onUndo={handleOpenUndoDialog}
            onSave={handleOpenSaveDialog}
          />
        </Box>
      </Drawer>

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
    </>
  );
};
