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
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import stopTypes from "../../../../models/stopTypes";
import weightTypes from "../../../../models/weightTypes";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";
import { GroupMembership, ParentMembership, TagTray } from "../../Shared";
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
  onTypeChange,
  onSubmodeChange,
  onWeightingChange,
  version,
  onOpenVersions,
  onOpenTimetable,
  onOpenTags,
  onOpenAltNames,
  onOpenKeyValues,
}) => {
  const { formatMessage } = useIntl();

  const currentType = stopPlace.stopPlaceType;
  const availableSubmodes: string[] =
    (currentType &&
      ((stopTypes[currentType as keyof typeof stopTypes] as any)
        ?.submodes as string[])) ||
    [];

  return (
    <Box sx={sx.container}>
      {/* Parent stop place membership */}
      {stopPlace.isChildOfParent && stopPlace.parentStop && (
        <Box sx={sx.fieldRow}>
          <ParentMembership parentStop={stopPlace.parentStop} />
        </Box>
      )}

      {/* Group of stop places membership */}
      {stopPlace.groups && stopPlace.groups.length > 0 && (
        <Box sx={sx.fieldRow}>
          <GroupMembership groups={stopPlace.groups} />
        </Box>
      )}

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

      {/* Stop type + submode on one row, icon on the left */}
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
        <FormControl
          size="small"
          disabled={!canEdit}
          sx={{ flex: availableSubmodes.length ? 1.4 : 1 }}
          fullWidth={availableSubmodes.length === 0}
        >
          <InputLabel>{`${formatMessage({ id: "stopPlaceType" })} *`}</InputLabel>
          <Select
            value={stopPlace.stopPlaceType || ""}
            label={`${formatMessage({ id: "stopPlaceType" })} *`}
            onChange={(e) => onTypeChange(e.target.value)}
          >
            {Object.keys(stopTypes).map((key) => (
              <MenuItem key={key} value={key}>
                {formatMessage({ id: `stopTypes_${key}_name` })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {availableSubmodes.length > 0 && (
          <FormControl size="small" disabled={!canEdit} sx={{ flex: 1 }}>
            <InputLabel>{formatMessage({ id: "submode" })}</InputLabel>
            <Select
              value={stopPlace.submode || ""}
              label={formatMessage({ id: "submode" })}
              onChange={(e) => onSubmodeChange(e.target.value)}
            >
              <MenuItem value="">
                <em>
                  {formatMessage({
                    id: `stopTypes_${currentType}_submodes_unspecified`,
                  })}
                </em>
              </MenuItem>
              {availableSubmodes.map((submode) => (
                <MenuItem key={submode} value={submode}>
                  {formatMessage({
                    id: `stopTypes_${currentType}_submodes_${submode}`,
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
        <Button
          size="small"
          startIcon={<VpnKeyIcon fontSize="small" />}
          onClick={onOpenKeyValues}
          variant="outlined"
        >
          {formatMessage({ id: "key_values_hint" })}
        </Button>
        {version !== undefined && version !== null && (
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
