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
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../actions";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { MinimizedBar } from "../Shared";
import {
  getDrawerPreference,
  setDrawerPreference,
} from "../Shared/drawerPreference";
import {
  NewStopWizard,
  ParkingPanel,
  QuayPanel,
  StopPlaceActionBar,
  StopPlaceDialogs,
  StopPlaceHeader,
  StopPlaceTabStrip,
  StopPlaceView,
} from "./components";
import { useEditStopPage } from "./hooks/useEditStopPage";
import { DEFAULT_STOP_PLACE_TAB } from "./stopPlaceTabs";
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
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [internalOpen, setInternalOpen] = useState(() => getDrawerPreference());
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const isOpenRef = useRef(isOpen);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);
  const [view, setView] = useState<View>({ type: "stopPlace" });
  /* Owned here rather than in StopPlaceView so a collapsed shortcut can select a
   * tab and expand the panel in one action. */
  const [activeTab, setActiveTab] = useState(DEFAULT_STOP_PLACE_TAB);
  const [wizardConfirmed, setWizardConfirmed] = useState(false);

  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as
        { type: string; index: number } | undefined,
  );
  const focusedBoardingPosition = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedBoardingPositionElement as
        { index: number; quayIndex: number } | undefined,
  );

  // Navigate drawer when a map marker is focused.
  // Only changes view when the drawer is already open — never force-opens from a map click.
  // useLayoutEffect (not useEffect) so the panel swap commits in the same paint as the
  // marker/popup's own focus animation, instead of one paint cycle later.
  useLayoutEffect(() => {
    if (!focusedElement) return;
    const { type, index } = focusedElement;
    if (index < 0) {
      setView({ type: "stopPlace" });
      return;
    }
    if (!isOpenRef.current) return;
    if (type === "quay") {
      setView({ type: "quay", index });
    } else if (type === "parkAndRide" || type === "bikeParking") {
      setView({ type: "parking", index });
    }
  }, [focusedElement]);

  // Navigate to quay panel when a boarding position is focused.
  // Same rule: only navigate if the drawer is open. Same useLayoutEffect reasoning as above.
  useLayoutEffect(() => {
    if (!focusedBoardingPosition || focusedBoardingPosition.quayIndex < 0)
      return;
    if (!isOpenRef.current) return;
    setView({ type: "quay", index: focusedBoardingPosition.quayIndex });
  }, [focusedBoardingPosition]);

  const handleToggle = () => {
    const next = !internalOpen;
    setDrawerPreference(next);
    setInternalOpen(next);
  };

  /**
   * A collapsed-bar shortcut: select the tab, leave any quay/parking sub-panel,
   * and expand. Editing then happens in the panel with its save button visible,
   * instead of in a dialog floating over a collapsed bar.
   */
  const handleOpenTab = useCallback((tabIndex: number) => {
    setActiveTab(tabIndex);
    /* Keep the same object when already on the stop place view, so re-selecting
       the current tab doesn't trigger a pointless re-render. */
    setView((current) =>
      current.type === "stopPlace" ? current : { type: "stopPlace" },
    );
    if (isOpenRef.current) return;
    setDrawerPreference(true);
    setInternalOpen(true);
  }, []);

  const handleBackToStopPlace = useCallback(() => {
    // Clear the focused quay so its map highlight and boarding-position markers
    // don't linger while the stop panel is shown.
    dispatch(StopPlaceActions.setElementFocus(-1, "quay"));
    setView({ type: "stopPlace" });
  }, [dispatch]);

  const {
    stopPlace,
    originalStopPlace,
    isModified,
    canEdit,
    canDelete,
    versions,
    versionsLoading,
    confirmSaveDialogOpen,
    confirmGoBackOpen,
    confirmUndoOpen,
    terminateStopDialogOpen,
    deleteQuayDialogOpen,
    pendingDeleteQuayId,
    deleteParkingDialogOpen,
    requiredFieldsMissingOpen,
    tagsDialogOpen,
    altNamesDialogOpen,
    versionsDialogOpen,
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
    handleOpenVersionsDialog,
    handleCloseVersionsDialog,
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
    handleQuayCompassBearingChange,
    handleDeleteParking,
    handleParkingNameChange,
    handleParkingTypeChange,
    handleParkingCapacityChange,
  } = useEditStopPage();

  // Whenever the current stop place identity changes (e.g. the user opens a
  // different stop from the map), return to the main stop panel — a quay/parking
  // sub-panel from the previously-open stop must not carry over.
  const currentStopId = stopPlace?.id;
  useEffect(() => {
    setView({ type: "stopPlace" });
  }, [currentStopId]);

  if (!stopPlace) return null;

  const drawerWidth = isMobile
    ? DRAWER_WIDTH_MOBILE
    : isTablet
      ? DRAWER_WIDTH_TABLET
      : DRAWER_WIDTH_DESKTOP;

  /* The live value comes first: the header, the panel field and the map bubble must
   * never disagree about the name. Falling back to the saved name only covers the
   * transient moment when the field has been cleared but not yet retyped. */
  const stopName =
    stopPlace.name ||
    originalStopPlace?.name ||
    formatMessage({ id: "new_stop_title" });

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
          onCompassBearingChange={handleQuayCompassBearingChange}
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
        activeTab={activeTab}
        onTabChange={setActiveTab}
        canEdit={canEdit}
        canDelete={canDelete}
        isModified={isModified}
        onGoBack={handleAllowUserToGoBack}
        onToggle={handleToggle}
        onDeleteQuay={handleDeleteQuay}
        onDeleteParking={handleDeleteParking}
        onNameChange={handleNameChange}
        onDescriptionChange={handleDescriptionChange}
        onSubmodeChange={handleSubmodeChange}
        onWeightingChange={handleWeightingChange}
        onOpenSaveDialog={handleOpenSaveDialog}
        onOpenUndoDialog={handleOpenUndoDialog}
        onOpenTerminateDialog={handleOpenTerminateDialog}
        onOpenTagsDialog={handleOpenTagsDialog}
        onOpenAltNamesDialog={handleOpenAltNamesDialog}
        onOpenVersionsDialog={handleOpenVersionsDialog}
      />
    );
  };

  const minimizedBar = (
    <MinimizedBar
      icon={<span />}
      hasId={!!stopPlace.id}
      onExpand={handleToggle}
      onClose={handleAllowUserToGoBack}
      isMobile={isMobile}
      customHeader={
        <StopPlaceHeader
          stopPlace={stopPlace}
          stopName={stopName}
          onClose={handleAllowUserToGoBack}
          onToggle={handleToggle}
          isExpanded={false}
        />
      }
      tabStrip={
        <StopPlaceTabStrip activeTab={activeTab} onTabChange={handleOpenTab} />
      }
      actionBar={
        <StopPlaceActionBar
          stopPlace={stopPlace}
          canEdit={canEdit}
          canDelete={canDelete}
          isModified={isModified}
          onOpenTerminateDialog={handleOpenTerminateDialog}
          onOpenUndoDialog={handleOpenUndoDialog}
          onOpenSaveDialog={handleOpenSaveDialog}
        />
      }
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
        pendingDeleteQuayId={pendingDeleteQuayId}
        deleteParkingDialogOpen={deleteParkingDialogOpen}
        requiredFieldsMissingOpen={requiredFieldsMissingOpen}
        tagsDialogOpen={tagsDialogOpen}
        altNamesDialogOpen={altNamesDialogOpen}
        versionsDialogOpen={versionsDialogOpen}
        versions={versions}
        versionsLoading={versionsLoading}
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
        handleCloseVersionsDialog={handleCloseVersionsDialog}
      />
    </>
  );
};
