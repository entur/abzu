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

import { Box, Divider } from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";
import AccessibilityStopTab from "../../../EditStopPage/AccessibilityAssessment/AccessibilityStopTab";
import AssistanceStopTab from "../../../EditStopPage/Assistance/AssistanceStopTab";
import FacilitiesStopTab from "../../../EditStopPage/Facility/FacilitiesStopTab";
import { StopPlaceViewProps } from "../types";
import { StopPlaceMembership } from "../../Shared";
import { KeyValuesTab } from "./KeyValuesTab";
import { ParkingSection } from "./ParkingSection";
import { QuaysSection } from "./QuaysSection";
import { StopPlaceGeneralSection } from "./StopPlaceGeneralSection";
import { StopPlaceActionBar } from "./StopPlaceActionBar";
import { StopPlaceHeader } from "./StopPlaceHeader";
import { StopPlaceTabStrip } from "./StopPlaceTabStrip";
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

      <Box sx={{ flexShrink: 0, bgcolor: "background.default" }}>
        <StopPlaceTabStrip activeTab={activeTab} onTabChange={onTabChange} />
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
      <StopPlaceActionBar
        stopPlace={stopPlace}
        canEdit={canEdit}
        canDelete={canDelete}
        isModified={isModified}
        onOpenTerminateDialog={onOpenTerminateDialog}
        onOpenUndoDialog={onOpenUndoDialog}
        onOpenSaveDialog={onOpenSaveDialog}
      />

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
