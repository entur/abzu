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
import DeleteIcon from "@mui/icons-material/DeleteForever";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NearMeIcon from "@mui/icons-material/NearMe";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import BusShelter from "../../../../static/icons/facilities/BusShelter";
import { useAppSelector } from "../../../../store/hooks";
import AccessibilityQuayTab from "../../../EditStopPage/AccessibilityAssessment/AccessibilityQuayTab";
import FacilitiesQuayTab from "../../../EditStopPage/Facility/FacilitiesQuayTab";
import { CopyIdButton, ImportedId } from "../../Shared";
import { QuayPanelProps } from "../types";
import { BoardingPositionsTab } from "./BoardingPositionsTab";

/**
 * Full quay editor panel.
 * Tabs mirror the legacy EditQuayAdditional structure:
 *   General | Accessibility | Facilities | Boarding Positions
 *
 * AccessibilityQuayTab and FacilitiesQuayTab are reused from the legacy
 * codebase — they are already Redux-connected and accept quay + index + disabled.
 */
export const QuayPanel: React.FC<QuayPanelProps> = ({
  quayIndex,
  stopPlace,
  canEdit,
  onBack,
  onDelete,
  onSave,
  onPublicCodeChange,
  onPrivateCodeChange,
  onDescriptionChange,
}) => {
  const BOARDING_POSITIONS_TAB = 3;

  const { formatMessage } = useIntl();

  const [activeTab, setActiveTab] = useState(0);

  const focusedBoardingPosition = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedBoardingPositionElement as
        | { index: number; quayIndex: number }
        | undefined,
  );

  // Switch to boarding positions tab when a boarding position marker is clicked
  useEffect(() => {
    if (
      focusedBoardingPosition &&
      focusedBoardingPosition.quayIndex === quayIndex &&
      focusedBoardingPosition.index >= 0
    ) {
      setActiveTab(BOARDING_POSITIONS_TAB);
    }
  }, [focusedBoardingPosition, quayIndex]);

  const quay = stopPlace.quays?.[quayIndex];
  if (!quay) return null;

  const displayCode =
    quay.publicCode ||
    quay.id ||
    `${formatMessage({ id: "quay" })} ${quayIndex + 1}`;

  const privateCodeValue =
    typeof quay.privateCode === "object"
      ? quay.privateCode?.value || ""
      : quay.privateCode || "";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 1,
          py: 0.5,
          minHeight: 48,
          gap: 0.5,
          flexShrink: 0,
        }}
      >
        <Tooltip title={formatMessage({ id: "back" })}>
          <IconButton size="small" onClick={onBack}>
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Typography
          variant="subtitle1"
          sx={{ flex: 1, fontWeight: 600 }}
          noWrap
        >
          {displayCode}
        </Typography>
        {quay.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Typography variant="caption" color="text.secondary">
              {quay.id}
            </Typography>
            <CopyIdButton idToCopy={quay.id} size="small" />
          </Box>
        )}
      </Box>

      <Divider />

      {/* ── Tabs ── */}
      <Box sx={{ flexShrink: 0, bgcolor: "background.default" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          variant="fullWidth"
          sx={{ minHeight: 40, "& .MuiTab-root": { minHeight: 40, py: 0 } }}
        >
          <Tooltip title={formatMessage({ id: "general" })} placement="bottom">
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
            title={formatMessage({ id: "boarding_positions_tab_label" })}
            placement="bottom"
          >
            <Tab icon={<NearMeIcon fontSize="small" />} value={3} />
          </Tooltip>
        </Tabs>
      </Box>

      <Divider />

      {/* ── Tab content (scrollable) ── */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {/* Tab 0 — General */}
        {activeTab === 0 && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label={formatMessage({ id: "publicCode" })}
                value={quay.publicCode || ""}
                onChange={(e) => onPublicCodeChange(quayIndex, e.target.value)}
                disabled={!canEdit}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label={formatMessage({ id: "privateCode" })}
                value={privateCodeValue}
                onChange={(e) => onPrivateCodeChange(quayIndex, e.target.value)}
                disabled={!canEdit}
                size="small"
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField
              label={formatMessage({ id: "description" })}
              value={quay.description || ""}
              onChange={(e) => onDescriptionChange(quayIndex, e.target.value)}
              disabled={!canEdit}
              size="small"
              fullWidth
            />

            {quay.importedId && quay.importedId.length > 0 && (
              <ImportedId
                text={formatMessage({ id: "importedId" })}
                id={quay.importedId}
                showCopyButtons
              />
            )}
          </Box>
        )}

        {/* Tab 1 — Accessibility (reuses legacy Redux-connected component) */}
        {activeTab === 1 && (
          <AccessibilityQuayTab
            quay={quay as any}
            index={quayIndex}
            disabled={!canEdit}
          />
        )}

        {/* Tab 2 — Facilities (reuses legacy Redux-connected component) */}
        {activeTab === 2 && (
          <FacilitiesQuayTab
            quay={quay as any}
            index={quayIndex}
            disabled={!canEdit}
          />
        )}

        {/* Tab 3 — Boarding Positions */}
        {activeTab === 3 && (
          <BoardingPositionsTab
            quay={quay}
            quayIndex={quayIndex}
            stopPlace={stopPlace}
            canEdit={canEdit}
          />
        )}
      </Box>

      {/* ── Footer ── */}
      <Divider />
      <Box
        sx={{
          display: "flex",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "background.paper",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        {canEdit && (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(quayIndex)}
          >
            {formatMessage({ id: "delete_quay" })}
          </Button>
        )}
        {canEdit && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}
            onClick={onSave}
            sx={{ ml: "auto" }}
          >
            {formatMessage({ id: "save" })}
          </Button>
        )}
      </Box>
    </Box>
  );
};
