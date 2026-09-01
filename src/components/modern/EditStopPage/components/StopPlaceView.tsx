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

import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import { Box, Button, Divider, Tab, Tabs, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";
import AccessibilityStopTab from "../../../EditStopPage/AccessibilityAssessment/AccessibilityStopTab";
import AssistanceStopTab from "../../../EditStopPage/Assistance/AssistanceStopTab";
import FacilitiesStopTab from "../../../EditStopPage/Facility/FacilitiesStopTab";
import { StopPlaceViewProps } from "../types";
import { DirtyBadge } from "../../Shared/ElementStatus";
import { useStopPlaceTabDirty } from "../hooks/useStopPlaceTabDirty";
import { STOP_PLACE_TABS } from "../stopPlaceTabs";
import { StopPlaceMembership } from "../../Shared";
import { KeyValuesTab } from "./KeyValuesTab";
import { ParkingSection } from "./ParkingSection";
import { QuaysSection } from "./QuaysSection";
import { StopPlaceGeneralSection } from "./StopPlaceGeneralSection";
import { StopPlaceHeader } from "./StopPlaceHeader";
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
  activeTab,
  onTabChange,
  canEdit,
  canDelete,
  isModified,
  onGoBack,
  onToggle,
  onDeleteQuay,
  onDeleteParking,
  onNameChange,
  onDescriptionChange,
  onSubmodeChange,
  onWeightingChange,
  onOpenSaveDialog,
  onOpenUndoDialog,
  onOpenTerminateDialog,
  onOpenTagsDialog,
  onOpenAltNamesDialog,
  onOpenVersionsDialog,
}) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const isTabDirty = useStopPlaceTabDirty();
  const [timetableOpen, setTimetableOpen] = useState(false);

  return (
    <>
      <StopPlaceHeader
        stopPlace={stopPlace}
        stopName={stopName}
        onClose={onGoBack}
        onToggle={onToggle}
        isExpanded={true}
      />

      <Divider />

      {/* Tabs — generated from STOP_PLACE_TABS, the same list that builds the
          collapsed bar's shortcuts, so the two can never drift apart. */}
      <Box sx={{ flexShrink: 0, bgcolor: "background.default" }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => onTabChange(value)}
          variant="fullWidth"
          sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, py: 0 } }}
        >
          {STOP_PLACE_TABS.map((tab) => (
            <Tooltip
              key={tab.id}
              title={formatMessage({ id: tab.labelId })}
              placement="bottom"
            >
              <Tab
                icon={
                  <DirtyBadge dirty={isTabDirty(tab.dirtyKeys)}>
                    {tab.renderIcon()}
                  </DirtyBadge>
                }
                value={tab.index}
              />
            </Tooltip>
          ))}
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
              onModalityChange={onSubmodeChange}
              onWeightingChange={onWeightingChange}
              version={stopPlace.version}
              onOpenVersions={onOpenVersionsDialog}
              onOpenTimetable={
                stopPlace.id ? () => setTimetableOpen(true) : undefined
              }
              onOpenTags={onOpenTagsDialog}
              onOpenAltNames={onOpenAltNamesDialog}
            />
            <QuaysSection
              quays={stopPlace.quays || []}
              canEdit={canEdit}
              onDeleteQuay={onDeleteQuay}
              onNavigateToQuay={(index) =>
                dispatch(StopPlaceActions.setElementFocus(index, "quay"))
              }
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
            />
            {/* Only renders for the "stack" variant — the other membership
                layouts mount inline inside StopPlaceGeneralSection. */}
            <StopPlaceMembership
              placement="section"
              parentStop={
                stopPlace.isChildOfParent ? stopPlace.parentStop : undefined
              }
              groups={stopPlace.groups}
              currentName={stopPlace.name}
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
        {activeTab === 4 && (
          <KeyValuesTab
            keyValues={stopPlace.keyValues || []}
            disabled={!canEdit}
            origin={{ type: "stopPlace", index: 0 }}
          />
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
