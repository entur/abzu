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

import AccessibleIcon from "@mui/icons-material/Accessible";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import HistoryIcon from "@mui/icons-material/History";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LabelIcon from "@mui/icons-material/Label";
import SaveIcon from "@mui/icons-material/Save";
import ShortTextIcon from "@mui/icons-material/ShortText";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import TrafficIcon from "@mui/icons-material/Traffic";
import UndoIcon from "@mui/icons-material/Undo";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Slide,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { Entities } from "../../../models/Entities";
import BusShelter from "../../../static/icons/facilities/BusShelter";
import AccessibilityStopTab from "../../EditStopPage/AccessibilityAssessment/AccessibilityStopTab";
import AssistanceStopTab from "../../EditStopPage/Assistance/AssistanceStopTab";
import FacilitiesStopTab from "../../EditStopPage/Facility/FacilitiesStopTab";
import {
  CopyIdButton,
  FavoriteButton,
  MinimizedBar,
  MinimizedBarAction,
} from "../Shared";
import {
  ParkingPanel,
  ParkingSection,
  QuayPanel,
  QuaysSection,
  StopPlaceDialogs,
  StopPlaceGeneralSection,
  TimetableDialog,
} from "./components";
import { useEditStopPage } from "./hooks/useEditStopPage";
import { EditStopPageProps } from "./types";

const DRAWER_WIDTH_DESKTOP = 450;
const DRAWER_WIDTH_TABLET = 380;
const DRAWER_WIDTH_MOBILE = "100%";

type View =
  | { type: "stopPlace" }
  | { type: "quay"; index: number }
  | { type: "parking"; index: number };

/**
 * Modern stop place editor — Phase 3
 * Quays and parking are first-class panels navigated to via replace pattern
 */
export const EditStopPage: React.FC<EditStopPageProps> = ({
  open: controlledOpen,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const [view, setView] = useState<View>({ type: "stopPlace" });
  const [activeStopTab, setActiveStopTab] = useState(0);
  const [timetableDialogOpen, setTimetableDialogOpen] = useState(false);

  const handleToggle = () => setInternalOpen((prev) => !prev);
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

  // Navigate to quay panel and add if not yet added
  const handleAddAndNavigateToQuay = () => {
    const newIndex = stopPlace.quays?.length ?? 0;
    handleAddQuay(stopPlace.location || [0, 0]);
    setView({ type: "quay", index: newIndex });
  };

  // Navigate to parking panel and add if not yet added
  const handleAddAndNavigateToParking = (type: string) => {
    const newIndex = stopPlace.parking?.length ?? 0;
    handleAddParking(type, stopPlace.location || [0, 0]);
    setView({ type: "parking", index: newIndex });
  };

  // Delete quay and return to stop place view
  const handleDeleteQuayAndBack = (index: number) => {
    handleDeleteQuay(index);
    // navigation back happens after confirm dialog closes
  };

  // Delete parking and return to stop place view
  const handleDeleteParkingAndBack = (index: number) => {
    handleDeleteParking(index);
  };

  // Wrap the confirm handlers to also navigate back
  const handleConfirmDeleteQuayAndBack = () => {
    handleConfirmDeleteQuay();
    handleBackToStopPlace();
  };

  const handleConfirmDeleteParkingAndBack = () => {
    handleConfirmDeleteParking();
    handleBackToStopPlace();
  };

  // Actions for MinimizedBar
  const minimizedBarActions: MinimizedBarAction[] = [
    {
      id: "tags",
      icon: <LabelIcon fontSize="small" />,
      label: formatMessage({ id: "tags" }),
      onClick: handleOpenTagsDialog,
      tooltip: formatMessage({ id: "tags" }),
    },
    {
      id: "alt-names",
      icon: <ShortTextIcon fontSize="small" />,
      label: formatMessage({ id: "alternative_names" }),
      onClick: handleOpenAltNamesDialog,
      tooltip: formatMessage({ id: "alternative_names" }),
    },
    {
      id: "key-values",
      icon: <VpnKeyIcon fontSize="small" />,
      label: formatMessage({ id: "key_values_hint" }),
      onClick: handleOpenKeyValuesDialog,
      tooltip: formatMessage({ id: "key_values_hint" }),
    },
    {
      id: "versions",
      icon: <HistoryIcon fontSize="small" />,
      label: formatMessage({ id: "versions" }),
      onClick: handleOpenVersionsDialog,
      tooltip: `${formatMessage({ id: "versions" })}${versions.length > 0 ? ` (${versions.length})` : ""}`,
    },
    ...(stopPlace.id
      ? [
          {
            id: "terminate",
            icon: <DeleteIcon fontSize="small" />,
            label: formatMessage({
              id: stopPlace.hasExpired
                ? "delete_stop_place"
                : "terminate_stop_place",
            }),
            onClick: handleOpenTerminateDialog,
            disabled: !canDelete && !stopPlace.hasExpired,
            color: "error" as const,
            tooltip: formatMessage({
              id: stopPlace.hasExpired
                ? "delete_stop_place"
                : "terminate_stop_place",
            }),
          },
        ]
      : []),
    ...(canEdit
      ? [
          {
            id: "undo",
            icon: <UndoIcon fontSize="small" />,
            label: formatMessage({ id: "undo_changes" }),
            onClick: handleOpenUndoDialog,
            disabled: !isModified,
            tooltip: formatMessage({ id: "undo_changes" }),
          },
          {
            id: "save",
            icon: <SaveIcon fontSize="small" />,
            label: formatMessage({ id: "save" }),
            onClick: handleOpenSaveDialog,
            disabled: !isModified || !stopPlace.name,
            color: "primary" as const,
            tooltip: formatMessage({ id: "save" }),
          },
        ]
      : []),
  ];

  const minimizedBar = (
    <MinimizedBar
      icon={<TrafficIcon />}
      name={stopName}
      id={originalStopPlace?.id}
      entityType={Entities.STOP_PLACE}
      hasId={!!stopPlace.id}
      actions={minimizedBarActions}
      onExpand={handleToggle}
      onClose={handleAllowUserToGoBack}
      isMobile={isMobile}
    />
  );

  // Drawer body varies by view
  const renderDrawerContent = () => {
    if (view.type === "quay") {
      return (
        <QuayPanel
          quayIndex={view.index}
          stopPlace={stopPlace}
          canEdit={canEdit}
          onBack={handleBackToStopPlace}
          onDelete={handleDeleteQuayAndBack}
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
          onDelete={handleDeleteParkingAndBack}
          onNameChange={handleParkingNameChange}
          onTypeChange={handleParkingTypeChange}
          onCapacityChange={handleParkingCapacityChange}
        />
      );
    }

    // Default: stop place view
    return (
      <>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            py: 0.5,
            minHeight: 48,
            gap: 0.5,
          }}
        >
          <Tooltip title={formatMessage({ id: "go_back" })}>
            <IconButton size="small" onClick={handleAllowUserToGoBack}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
              {stopName}
            </Typography>
            {stopPlace.id && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                  mt: -0.25,
                }}
              >
                <Typography variant="caption" color="text.secondary" noWrap>
                  {stopPlace.id}
                </Typography>
                <CopyIdButton idToCopy={stopPlace.id} size="small" />
              </Box>
            )}
          </Box>
          {stopPlace.id && (
            <FavoriteButton
              id={stopPlace.id}
              name={stopPlace.name}
              entityType={Entities.STOP_PLACE}
              stopPlaceType={stopPlace.stopPlaceType}
              submode={stopPlace.submode}
              topographicPlace={stopPlace.topographicPlace}
              parentTopographicPlace={stopPlace.parentTopographicPlace}
              location={stopPlace.location}
            />
          )}
          <Tooltip title={formatMessage({ id: "collapse" })}>
            <IconButton size="small" onClick={handleToggle}>
              <ExpandLessIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider />

        {/* Stop place tabs */}
        <Box sx={{ flexShrink: 0, bgcolor: "background.default" }}>
          <Tabs
            value={activeStopTab}
            onChange={(_, v) => setActiveStopTab(v)}
            variant="fullWidth"
            sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, py: 0 } }}
          >
            <Tooltip
              title={formatMessage({ id: "stopPlace" })}
              placement="bottom"
            >
              <Tab icon={<InfoOutlinedIcon fontSize="small" />} value={0} />
            </Tooltip>
            <Tooltip
              title={formatMessage({ id: "accessibility" })}
              placement="bottom"
            >
              <Tab icon={<AccessibleIcon fontSize="small" />} value={1} />
            </Tooltip>
            <Tooltip
              title={formatMessage({ id: "facilities" })}
              placement="bottom"
            >
              <Tab
                icon={<BusShelter sx={{ fontSize: "1.25rem" }} />}
                value={2}
              />
            </Tooltip>
            <Tooltip
              title={formatMessage({ id: "assistance" })}
              placement="bottom"
            >
              <Tab icon={<SupportAgentIcon fontSize="small" />} value={3} />
            </Tooltip>
          </Tabs>
        </Box>

        <Divider />

        {/* Scrollable content */}
        <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {activeStopTab === 0 && (
            <>
              <StopPlaceGeneralSection
                stopPlace={stopPlace}
                canEdit={canEdit}
                onNameChange={handleNameChange}
                onDescriptionChange={handleDescriptionChange}
                onTypeChange={handleTypeChange}
                onSubmodeChange={(submode) =>
                  handleSubmodeChange(stopPlace.stopPlaceType || "", submode)
                }
                onWeightingChange={handleWeightingChange}
                version={stopPlace.version}
                onOpenVersions={handleOpenVersionsDialog}
                onOpenTimetable={
                  stopPlace.id ? () => setTimetableDialogOpen(true) : undefined
                }
                onOpenTags={handleOpenTagsDialog}
                onOpenAltNames={handleOpenAltNamesDialog}
                onOpenKeyValues={handleOpenKeyValuesDialog}
              />
              <QuaysSection
                quays={stopPlace.quays || []}
                canEdit={canEdit}
                onDeleteQuay={handleDeleteQuay}
                onNavigateToQuay={(index) => setView({ type: "quay", index })}
                onAddQuay={handleAddAndNavigateToQuay}
              />
              <ParkingSection
                parking={stopPlace.parking || []}
                canEdit={canEdit}
                onDeleteParking={handleDeleteParking}
                onNavigateToParking={(index) =>
                  setView({ type: "parking", index })
                }
                onAddParking={handleAddAndNavigateToParking}
              />
            </>
          )}
          {activeStopTab === 1 && <AccessibilityStopTab disabled={!canEdit} />}
          {activeStopTab === 2 && (
            <FacilitiesStopTab
              disabled={!canEdit}
              stopPlace={stopPlace as any}
            />
          )}
          {activeStopTab === 3 && (
            <AssistanceStopTab
              disabled={!canEdit}
              stopPlace={stopPlace as any}
            />
          )}
        </Box>

        {/* Fixed footer actions */}
        <Divider />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            px: 2,
            py: 1.5,
            bgcolor: "background.paper",
            flexWrap: "wrap",
          }}
        >
          {stopPlace.id && canDelete && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleOpenTerminateDialog}
            >
              {formatMessage({
                id: stopPlace.hasExpired
                  ? "delete_stop_place"
                  : "terminate_stop_place",
              })}
            </Button>
          )}
          {canEdit && (
            <>
              <Button
                variant="outlined"
                size="small"
                startIcon={<UndoIcon />}
                onClick={handleOpenUndoDialog}
                disabled={!isModified}
                sx={{ ml: "auto" }}
              >
                {formatMessage({ id: "undo_changes" })}
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<SaveIcon />}
                onClick={handleOpenSaveDialog}
                disabled={!isModified || !stopPlace.name}
              >
                {formatMessage({ id: "save" })}
              </Button>
            </>
          )}
        </Box>
      </>
    );
  };

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

      {/* Timetable dialog */}
      {stopPlace.id && (
        <TimetableDialog
          open={timetableDialogOpen}
          onClose={() => setTimetableDialogOpen(false)}
          stopPlaceId={stopPlace.id}
          stopPlaceName={stopName}
        />
      )}

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
      />
    </>
  );
};
