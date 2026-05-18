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

import AccessibleIcon from "@mui/icons-material/Accessible";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SaveIcon from "@mui/icons-material/Save";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { Entities } from "../../../../models/Entities";
import BusShelter from "../../../../static/icons/facilities/BusShelter";
import { useAppDispatch } from "../../../../store/hooks";
import AccessibilityStopTab from "../../../EditStopPage/AccessibilityAssessment/AccessibilityStopTab";
import AssistanceStopTab from "../../../EditStopPage/Assistance/AssistanceStopTab";
import FacilitiesStopTab from "../../../EditStopPage/Facility/FacilitiesStopTab";
import { CenterMapButton, CopyIdButton, FavoriteButton } from "../../Shared";
import { StopPlaceViewProps } from "../types";
import { ParkingSection } from "./ParkingSection";
import { QuaysSection } from "./QuaysSection";
import { StopPlaceGeneralSection } from "./StopPlaceGeneralSection";
import { TimetableDialog } from "./TimetableDialog";

/**
 * The stop-place drawer view: header, tabs (info / accessibility / facilities / assistance),
 * scrollable content, and footer actions.
 *
 * Extracted from EditStopPage to keep that component focused on routing and layout.
 * Owns `activeTab` and `timetableOpen` state; all parent-facing navigation happens
 * via Redux dispatch or callbacks passed in as props.
 */
export const StopPlaceView: React.FC<StopPlaceViewProps> = ({
  stopPlace,
  stopName,
  canEdit,
  canDelete,
  isModified,
  onGoBack,
  onToggle,
  onAddQuay,
  onAddParking,
  onDeleteQuay,
  onDeleteParking,
  onNameChange,
  onDescriptionChange,
  onTypeChange,
  onSubmodeChange,
  onWeightingChange,
  onOpenSaveDialog,
  onOpenUndoDialog,
  onOpenTerminateDialog,
  onOpenTagsDialog,
  onOpenAltNamesDialog,
  onOpenKeyValuesDialog,
  onOpenVersionsDialog,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [timetableOpen, setTimetableOpen] = useState(false);

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
          <IconButton size="small" onClick={onGoBack}>
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
        <CenterMapButton location={stopPlace.location} />
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
          <IconButton size="small" onClick={onToggle}>
            <ExpandLessIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Tabs */}
      <Box sx={{ flexShrink: 0, bgcolor: "background.default" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
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
            <Tab icon={<BusShelter sx={{ fontSize: "1.25rem" }} />} value={2} />
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
        {activeTab === 0 && (
          <>
            <StopPlaceGeneralSection
              stopPlace={stopPlace}
              canEdit={canEdit}
              onNameChange={onNameChange}
              onDescriptionChange={onDescriptionChange}
              onTypeChange={onTypeChange}
              onSubmodeChange={(submode) =>
                onSubmodeChange(stopPlace.stopPlaceType || "", submode)
              }
              onWeightingChange={onWeightingChange}
              version={stopPlace.version}
              onOpenVersions={onOpenVersionsDialog}
              onOpenTimetable={
                stopPlace.id ? () => setTimetableOpen(true) : undefined
              }
              onOpenTags={onOpenTagsDialog}
              onOpenAltNames={onOpenAltNamesDialog}
              onOpenKeyValues={onOpenKeyValuesDialog}
            />
            <QuaysSection
              quays={stopPlace.quays || []}
              canEdit={canEdit}
              onDeleteQuay={onDeleteQuay}
              onNavigateToQuay={(index) =>
                dispatch(StopPlaceActions.setElementFocus(index, "quay"))
              }
              onAddQuay={onAddQuay}
            />
            <ParkingSection
              parking={stopPlace.parking || []}
              canEdit={canEdit}
              onDeleteParking={onDeleteParking}
              onNavigateToParking={(index) => {
                const parkingType =
                  stopPlace.parking?.[index]?.parkingType ?? "parkAndRide";
                dispatch(StopPlaceActions.setElementFocus(index, parkingType));
              }}
              onAddParking={onAddParking}
            />
          </>
        )}
        {activeTab === 1 && <AccessibilityStopTab disabled={!canEdit} />}
        {activeTab === 2 && (
          <FacilitiesStopTab disabled={!canEdit} stopPlace={stopPlace as any} />
        )}
        {activeTab === 3 && (
          <AssistanceStopTab disabled={!canEdit} stopPlace={stopPlace as any} />
        )}
      </Box>

      {/* Footer */}
      <Divider />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "background.paper",
          flexWrap: "wrap",
          flexShrink: 0,
        }}
      >
        {stopPlace.id && canDelete && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onOpenTerminateDialog}
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
              onClick={onOpenUndoDialog}
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
              onClick={onOpenSaveDialog}
              disabled={!isModified || !stopPlace.name}
            >
              {formatMessage({ id: "save" })}
            </Button>
          </>
        )}
      </Box>

      {/* Timetable dialog — owned locally since it's only relevant in stop view */}
      {stopPlace.id && (
        <TimetableDialog
          open={timetableOpen}
          onClose={() => setTimetableOpen(false)}
          stopPlaceId={stopPlace.id}
          stopPlaceName={stopName}
        />
      )}
    </>
  );
};
