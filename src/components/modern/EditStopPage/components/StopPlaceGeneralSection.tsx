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

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import HistoryIcon from "@mui/icons-material/History";
import LabelIcon from "@mui/icons-material/Label";
import ShortTextIcon from "@mui/icons-material/ShortText";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { useConfig } from "../../../../config/ConfigContext";
import stopTypes from "../../../../models/stopTypes";
import weightTypes from "../../../../models/weightTypes";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import { StopPlaceMembership, TagTray } from "../../Shared";
import { StopPlaceGeneralSectionProps } from "../types";
import { generalSectionStyles as sx } from "./StopPlaceGeneralSection.styles";

/**
 * General info section: name, description, stop type, submode, tags, actions
 */
export const StopPlaceGeneralSection: React.FC<
  StopPlaceGeneralSectionProps
> = ({
  stopPlace,
  canEdit,
  onNameChange,
  onDescriptionChange,
  onModalityChange,
  onWeightingChange,
  version,
  onOpenVersions,
  onOpenTimetable,
  onOpenTags,
  onOpenAltNames,
}) => {
  const { formatMessage } = useIntl();
  const { modalityConfig } = useConfig();
  const hiddenStopTypes = modalityConfig?.hiddenStopTypes ?? [];

  const pickerValue = `${stopPlace.stopPlaceType ?? ""}|${stopPlace.submode ?? ""}`;

  const handlePickerChange = (value: string) => {
    const separatorIndex = value.indexOf("|");
    const type = value.slice(0, separatorIndex);
    const submode = value.slice(separatorIndex + 1);
    // Single atomic change: the reducer sets stopPlaceType + submode together,
    // so dispatching type and submode separately would let the second overwrite
    // the first with a stale type.
    onModalityChange(type, submode);
  };

  const unifiedOptions = Object.entries(stopTypes)
    .filter(([key]) => !hiddenStopTypes.includes(key))
    .flatMap(([key, config]) => {
      const typeLabel = formatMessage({ id: `stopTypes_${key}_name` });
      const submodes = (config as any).submodes as string[] | null | undefined;
      const bare = { value: `${key}|`, label: typeLabel };
      const submodeItems = (submodes ?? []).map((sub) => ({
        value: `${key}|${sub}`,
        label: formatMessage({ id: `stopTypes_${key}_submodes_${sub}` }),
      }));
      return [bare, ...submodeItems];
    });

  return (
    <Box sx={sx.container}>
      {/* Parent / group memberships — layout chosen under Utseende */}
      <StopPlaceMembership
        parentStop={
          stopPlace.isChildOfParent ? stopPlace.parentStop : undefined
        }
        groups={stopPlace.groups}
        currentName={stopPlace.name}
      />

      {/* Name */}
      <Box sx={sx.fieldRow}>
        <TextField
          label={`${formatMessage({ id: "name" })} *`}
          value={stopPlace.name || ""}
          onChange={(e) => onNameChange(e.target.value)}
          disabled={!canEdit}
          fullWidth
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Description */}
      <Box sx={sx.fieldRow}>
        <TextField
          label={formatMessage({ id: "description" })}
          value={stopPlace.description || ""}
          onChange={(e) => onDescriptionChange(e.target.value)}
          disabled={!canEdit}
          fullWidth
          size="small"
          variant="outlined"
          multiline
          rows={2}
        />
      </Box>

      {/* Unified stop type + submode picker */}
      <Box
        sx={{ ...sx.fieldRow, display: "flex", alignItems: "center", gap: 1 }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ModalityIconImg
            type={stopPlace.stopPlaceType || "other"}
            submode={stopPlace.submode}
            svgStyle={{ width: 28, height: 28 }}
          />
        </Box>
        <FormControl size="small" disabled={!canEdit} fullWidth>
          <InputLabel>{`${formatMessage({ id: "stopPlaceType" })} *`}</InputLabel>
          <Select
            value={pickerValue}
            label={`${formatMessage({ id: "stopPlaceType" })} *`}
            onChange={(e) => handlePickerChange(e.target.value)}
          >
            {unifiedOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Interchange weighting */}
      <Box sx={sx.fieldRow}>
        <FormControl size="small" disabled={!canEdit} fullWidth>
          <InputLabel>
            {formatMessage({ id: "interchange_weighting" })}
          </InputLabel>
          <Select
            value={stopPlace.weighting || ""}
            label={formatMessage({ id: "interchange_weighting" })}
            onChange={(e) => onWeightingChange(e.target.value)}
          >
            <MenuItem value="">
              <em>{formatMessage({ id: "weightTypes_noValue" })}</em>
            </MenuItem>
            {weightTypes.map((wt) => (
              <MenuItem key={wt} value={wt}>
                {formatMessage({ id: `weightTypes_${wt}` })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Municipality (read-only) */}
      <Box sx={{ ...sx.fieldRow, display: "flex", gap: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ minWidth: 80, pt: 0.25 }}
        >
          {formatMessage({ id: "municipality" })}
        </Typography>
        <Typography
          variant="body2"
          color={stopPlace.topographicPlace ? "text.primary" : "text.disabled"}
        >
          {stopPlace.topographicPlace
            ? stopPlace.parentTopographicPlace
              ? `${stopPlace.topographicPlace} (${stopPlace.parentTopographicPlace})`
              : stopPlace.topographicPlace
            : formatMessage({ id: "not_present" })}
        </Typography>
      </Box>

      {/* Tariff zones (read-only) */}
      <Box sx={{ ...sx.fieldRow, display: "flex", gap: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ minWidth: 80, pt: 0.25 }}
        >
          {formatMessage({ id: "tariffZones" })}
        </Typography>
        <Typography
          variant="body2"
          color={
            (stopPlace.tariffZones ?? []).length > 0
              ? "text.primary"
              : "text.disabled"
          }
        >
          {(stopPlace.tariffZones ?? []).length > 0
            ? stopPlace
                .tariffZones!.map((tz) => tz.name?.value ?? tz.id)
                .join(", ")
            : formatMessage({ id: "not_present" })}
        </Typography>
      </Box>

      {/* Tags tray (read-only display) */}
      {stopPlace.tags && stopPlace.tags.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <TagTray tags={stopPlace.tags} />
        </Box>
      )}

      {/* Tags + Alt Names + Key Values + Versions — all in one row */}
      <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
        {canEdit && (
          <Button
            size="small"
            startIcon={<LabelIcon fontSize="small" />}
            onClick={onOpenTags}
            variant="outlined"
          >
            {formatMessage({ id: "tags" })}
          </Button>
        )}
        <Button
          size="small"
          startIcon={<ShortTextIcon fontSize="small" />}
          onClick={onOpenAltNames}
          variant="outlined"
        >
          {formatMessage({ id: "alternative_names" })}
        </Button>
        {version !== undefined &&
          version !== null &&
          !stopPlace.isChildOfParent && (
            <Button
              size="small"
              startIcon={<HistoryIcon fontSize="small" />}
              onClick={onOpenVersions}
              variant="outlined"
            >
              {formatMessage({ id: "version" })} {version}
            </Button>
          )}
        {onOpenTimetable && (
          <Button
            size="small"
            startIcon={<CalendarMonthIcon fontSize="small" />}
            onClick={onOpenTimetable}
            variant="outlined"
          >
            {formatMessage({ id: "timetable" })}
          </Button>
        )}
      </Box>
    </Box>
  );
};
