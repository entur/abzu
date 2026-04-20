/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { Box, Drawer, Slide, useMediaQuery, useTheme } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Entities } from "../../../models/Entities";
import { useAppSelector } from "../../../store/hooks";
import ModalityIconImg from "../../MainPage/ModalityIconImg";
import { MinimizedBar } from "../Shared";
import {
  getDrawerPreference,
  setDrawerPreference,
} from "../Shared/drawerPreference";
import {
  NewStopWizard,
  ParkingPanel,
  QuayPanel,
  StopPlaceDialogs,
  StopPlaceView,
} from "./components";
import { useEditStopPage } from "./hooks/useEditStopPage";
import { useMinimizedBarActions } from "./hooks/useMinimizedBarActions";
import { EditStopPageProps } from "./types";

const DRAWER_WIDTH_DESKTOP = 450;
const DRAWER_WIDTH_TABLET = 380;
const DRAWER_WIDTH_MOBILE = "100%";

type View =
  | { type: "stopPlace" }
  | { type: "quay"; index: number }
  | { type: "parking"; index: number };

/**
 * Modern stop place editor shell.
 * Owns drawer open/close state, view routing (stop / quay / parking), and responsive layout.
 * Content is delegated to StopPlaceView, QuayPanel, and ParkingPanel.
 */
export const EditStopPage: React.FC<EditStopPageProps> = ({
  open: controlledOpen,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [internalOpen, setInternalOpen] = useState(() => getDrawerPreference());
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const [view, setView] = useState<View>({ type: "stopPlace" });
  const [wizardConfirmed, setWizardConfirmed] = useState(false);

  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as
        | { type: string; index: number }
        | undefined,
  );
  const focusedBoardingPosition = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedBoardingPositionElement as
        | { index: number; quayIndex: number }
        | undefined,
  );

  // Navigate drawer when a map marker is focused
  useEffect(() => {
    if (!focusedElement) return;
    const { type, index } = focusedElement;
    if (index < 0) {
      setView({ type: "stopPlace" });
    } else if (type === "quay") {
      setView({ type: "quay", index });
      setInternalOpen(true);
    } else if (type === "parkAndRide" || type === "bikeParking") {
      setView({ type: "parking", index });
      setInternalOpen(true);
    }
  }, [focusedElement]);

  // Navigate to quay panel when a boarding position is focused
  useEffect(() => {
    if (!focusedBoardingPosition || focusedBoardingPosition.quayIndex < 0)
      return;
    setView({ type: "quay", index: focusedBoardingPosition.quayIndex });
    setInternalOpen(true);
  }, [focusedBoardingPosition]);

  const handleToggle = () => {
    const next = !internalOpen;
    setDrawerPreference(next);
    setInternalOpen(next);
  };

  const handleBackToStopPlace = useCallback(
    () => setView({ type: "stopPlace" }),
    [],
  );

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
    deleteQuayDialogOpen,
    deleteParkingDialogOpen,
    requiredFieldsMissingOpen,
    tagsDialogOpen,
    altNamesDialogOpen,
    keyValuesDialogOpen,
    versionsDialogOpen,
    infoDialogOpen,
    nameDescriptionDialogOpen,
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
    handleCloseDeleteQuayDialog,
    handleConfirmDeleteQuay,
    handleCloseDeleteParkingDialog,
    handleConfirmDeleteParking,
    handleCloseRequiredFieldsMissing,
    handleOpenTagsDialog,
    handleCloseTagsDialog,
    handleOpenAltNamesDialog,
    handleCloseAltNamesDialog,
    handleOpenKeyValuesDialog,
    handleCloseKeyValuesDialog,
    handleOpenVersionsDialog,
    handleCloseVersionsDialog,
    handleOpenInfoDialog,
    handleCloseInfoDialog,
    handleOpenNameDescriptionDialog,
    handleCloseNameDescriptionDialog,
    handleNameChange,
    handleDescriptionChange,
    handleTypeChange,
    handleSubmodeChange,
    handleWeightingChange,
    handleAddTag,
    handleGetTags,
    handleRemoveTag,
    handleFindTagByName,
    handleDeleteQuay,
    handleQuayPublicCodeChange,
    handleQuayPrivateCodeChange,
    handleQuayDescriptionChange,
    handleAddQuay,
    handleDeleteParking,
    handleParkingNameChange,
    handleParkingTypeChange,
    handleParkingCapacityChange,
    handleAddParking,
  } = useEditStopPage();

  // useMinimizedBarActions uses useIntl internally — must be called before any early return
  const minimizedBarActions = useMinimizedBarActions({
    stopPlace: stopPlace ?? ({ name: "" } as any),
    versions,
    isModified,
    canEdit,
    canDelete,
    onOpenInfoDialog: handleOpenInfoDialog,
    onOpenNameDescriptionDialog: handleOpenNameDescriptionDialog,
    onOpenTagsDialog: handleOpenTagsDialog,
    onOpenAltNamesDialog: handleOpenAltNamesDialog,
    onOpenKeyValuesDialog: handleOpenKeyValuesDialog,
    onOpenVersionsDialog: handleOpenVersionsDialog,
    onOpenTerminateDialog: handleOpenTerminateDialog,
    onOpenUndoDialog: handleOpenUndoDialog,
    onOpenSaveDialog: handleOpenSaveDialog,
  });

  if (!stopPlace) return null;

  const drawerWidth = isMobile
    ? DRAWER_WIDTH_MOBILE
    : isTablet
      ? DRAWER_WIDTH_TABLET
      : DRAWER_WIDTH_DESKTOP;

  const stopName =
    originalStopPlace?.name ||
    stopPlace.name ||
    formatMessage({ id: "new_stop_title" });

  const handleAddAndNavigateToQuay = () => {
    const newIndex = stopPlace.quays?.length ?? 0;
    handleAddQuay(stopPlace.location || [0, 0]);
    setView({ type: "quay", index: newIndex });
  };

  const handleAddAndNavigateToParking = (type: string) => {
    const newIndex = stopPlace.parking?.length ?? 0;
    handleAddParking(type, stopPlace.location || [0, 0]);
    setView({ type: "parking", index: newIndex });
  };

  const handleConfirmDeleteQuayAndBack = () => {
    handleConfirmDeleteQuay();
    handleBackToStopPlace();
  };

  const handleConfirmDeleteParkingAndBack = () => {
    handleConfirmDeleteParking();
    handleBackToStopPlace();
  };

  const renderDrawerContent = () => {
    if (view.type === "quay") {
      return (
        <QuayPanel
          quayIndex={view.index}
          stopPlace={stopPlace}
          canEdit={canEdit}
          onBack={handleBackToStopPlace}
          onDelete={handleDeleteQuay}
          onSave={handleOpenSaveDialog}
          onPublicCodeChange={handleQuayPublicCodeChange}
          onPrivateCodeChange={handleQuayPrivateCodeChange}
          onDescriptionChange={handleQuayDescriptionChange}
        />
      );
    }

    if (view.type === "parking") {
      return (
        <ParkingPanel
          parkingIndex={view.index}
          stopPlace={stopPlace}
          canEdit={canEdit}
          onBack={handleBackToStopPlace}
          onDelete={handleDeleteParking}
          onNameChange={handleParkingNameChange}
          onTypeChange={handleParkingTypeChange}
          onCapacityChange={handleParkingCapacityChange}
        />
      );
    }

    return (
      <StopPlaceView
        stopPlace={stopPlace}
        stopName={stopName}
        canEdit={canEdit}
        canDelete={canDelete}
        isModified={isModified}
        onGoBack={handleAllowUserToGoBack}
        onToggle={handleToggle}
        onAddQuay={handleAddAndNavigateToQuay}
        onAddParking={handleAddAndNavigateToParking}
        onDeleteQuay={handleDeleteQuay}
        onDeleteParking={handleDeleteParking}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
        onTypeChange={handleTypeChange}
        onSubmodeChange={handleSubmodeChange}
        onWeightingChange={handleWeightingChange}
        onOpenSaveDialog={handleOpenSaveDialog}
        onOpenUndoDialog={handleOpenUndoDialog}
        onOpenTerminateDialog={handleOpenTerminateDialog}
        onOpenTagsDialog={handleOpenTagsDialog}
        onOpenAltNamesDialog={handleOpenAltNamesDialog}
        onOpenKeyValuesDialog={handleOpenKeyValuesDialog}
        onOpenVersionsDialog={handleOpenVersionsDialog}
      />
    );
  };

  const minimizedBar = (
    <MinimizedBar
      icon={
        <ModalityIconImg
          type={stopPlace.stopPlaceType || "other"}
          submode={stopPlace.submode}
          svgStyle={{ width: 24, height: 24 }}
          iconStyle={{ display: "flex" }}
        />
      }
      name={stopName}
      id={originalStopPlace?.id}
      entityType={Entities.STOP_PLACE}
      hasId={!!stopPlace.id}
      actions={minimizedBarActions}
      onExpand={handleToggle}
      onClose={handleAllowUserToGoBack}
      centerLocation={stopPlace.location}
      isMobile={isMobile}
    />
  );

  return (
    <>
      {/* MinimizedBar — visible only when drawer is collapsed */}
      {!isOpen && originalStopPlace && (
        <>
          {isMobile ? (
            <Slide direction="up" in={!isOpen} mountOnEnter unmountOnExit>
              <Box>{minimizedBar}</Box>
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
              {minimizedBar}
            </Box>
          )}
        </>
      )}

      {/* Drawer */}
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
          {renderDrawerContent()}
        </Box>
      </Drawer>

      {/* New stop wizard — shown automatically when a freshly placed stop loads */}
      <NewStopWizard
        open={!!stopPlace.isNewStop && !wizardConfirmed}
        onConfirm={(name, stopType) => {
          handleNameChange(name);
          handleTypeChange(stopType);
          setWizardConfirmed(true);
        }}
        onCancel={handleGoBack}
      />

      {/* All dialogs */}
      <StopPlaceDialogs
        stopPlace={stopPlace}
        canEdit={canEdit}
        canDelete={canDelete}
        formatMessage={formatMessage}
        confirmSaveDialogOpen={confirmSaveDialogOpen}
        confirmGoBackOpen={confirmGoBackOpen}
        confirmUndoOpen={confirmUndoOpen}
        terminateStopDialogOpen={terminateStopDialogOpen}
        deleteQuayDialogOpen={deleteQuayDialogOpen}
        deleteParkingDialogOpen={deleteParkingDialogOpen}
        requiredFieldsMissingOpen={requiredFieldsMissingOpen}
        tagsDialogOpen={tagsDialogOpen}
        altNamesDialogOpen={altNamesDialogOpen}
        keyValuesDialogOpen={keyValuesDialogOpen}
        versionsDialogOpen={versionsDialogOpen}
        infoDialogOpen={infoDialogOpen}
        nameDescriptionDialogOpen={nameDescriptionDialogOpen}
        versions={versions}
        handleSave={handleSave}
        handleCloseSaveDialog={handleCloseSaveDialog}
        handleGoBack={handleGoBack}
        handleCancelGoBack={handleCancelGoBack}
        handleUndo={handleUndo}
        handleCloseUndoDialog={handleCloseUndoDialog}
        handleTerminate={handleTerminate}
        handleCloseTerminateDialog={handleCloseTerminateDialog}
        handleConfirmDeleteQuay={handleConfirmDeleteQuayAndBack}
        handleCloseDeleteQuayDialog={handleCloseDeleteQuayDialog}
        handleConfirmDeleteParking={handleConfirmDeleteParkingAndBack}
        handleCloseDeleteParkingDialog={handleCloseDeleteParkingDialog}
        handleCloseRequiredFieldsMissing={handleCloseRequiredFieldsMissing}
        handleCloseTagsDialog={handleCloseTagsDialog}
        handleAddTag={handleAddTag}
        handleGetTags={handleGetTags}
        handleRemoveTag={handleRemoveTag}
        handleFindTagByName={handleFindTagByName}
        handleCloseAltNamesDialog={handleCloseAltNamesDialog}
        handleCloseKeyValuesDialog={handleCloseKeyValuesDialog}
        handleCloseVersionsDialog={handleCloseVersionsDialog}
        handleCloseInfoDialog={handleCloseInfoDialog}
        handleCloseNameDescriptionDialog={handleCloseNameDescriptionDialog}
        handleNameChange={handleNameChange}
        handleDescriptionChange={handleDescriptionChange}
      />
    </>
  );
};
