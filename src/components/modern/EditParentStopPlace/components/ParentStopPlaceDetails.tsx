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

import HistoryIcon from "@mui/icons-material/History";
import LabelIcon from "@mui/icons-material/Label";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ShortTextIcon from "@mui/icons-material/ShortText";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useIntl } from "react-intl";
import { GroupMembership, ImportedId, TagTray } from "../../Shared";
import { ParentStopPlaceDetailsProps } from "../types";

/**
 * Details section for parent stop place
 * Matches EditStopPage field and button-row patterns
 */
export const ParentStopPlaceDetails: React.FC<ParentStopPlaceDetailsProps> = ({
  name,
  description,
  url,
  location,
  hasExpired,
  version,
  tags,
  importedId,
  alternativeNames,
  belongsToGroup,
  groups,
  canEdit,
  onNameChange,
  onDescriptionChange,
  onUrlChange,
  onOpenAltNames,
  onOpenTags,
  onOpenCoordinates,
  onOpenVersions,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
      {/* Expired Warning */}
      {hasExpired && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon sx={{ color: "warning.main", fontSize: "1rem" }} />
          <Typography variant="caption" color="error.main">
            {formatMessage({ id: "stop_has_expired" })}
          </Typography>
        </Box>
      )}

      {/* Tags display */}
      {tags && tags.length > 0 && <TagTray tags={tags.map((t) => t.name)} />}

      {/* Imported ID */}
      {importedId && (
        <ImportedId
          id={importedId}
          text={formatMessage({ id: "local_reference" })}
        />
      )}

      {/* Group Membership */}
      {belongsToGroup && groups && groups.length > 0 && (
        <GroupMembership groups={groups} />
      )}

      {/* Set Centroid (if no location) */}
      {!location && (
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title={formatMessage({ id: "set_centroid" })} arrow>
            <span>
              <IconButton
                size="small"
                onClick={onOpenCoordinates}
                disabled={!canEdit}
              >
                <MyLocationIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}

      {/* Name */}
      <TextField
        label={`${formatMessage({ id: "name" })} *`}
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        disabled={!canEdit}
        fullWidth
        required
        error={!name}
        helperText={!name ? formatMessage({ id: "name_is_required" }) : ""}
        variant="outlined"
        size="small"
      />

      {/* Description */}
      <TextField
        label={formatMessage({ id: "description" })}
        value={description || ""}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={!canEdit}
        fullWidth
        multiline
        rows={2}
        variant="outlined"
        size="small"
      />

      {/* URL (optional, feature-flagged in legacy) */}
      {url !== undefined && (
        <TextField
          label={formatMessage({ id: "url" })}
          value={url || ""}
          onChange={(e) => onUrlChange(e.target.value)}
          disabled={!canEdit}
          fullWidth
          variant="outlined"
          size="small"
        />
      )}

      {/* Button row: Alt Names + Tags + Version */}
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <Button
          size="small"
          startIcon={<ShortTextIcon fontSize="small" />}
          onClick={onOpenAltNames}
          variant="outlined"
        >
          {formatMessage({ id: "alternative_names" })}
        </Button>
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
      </Box>

      <Divider />
    </Box>
  );
};
