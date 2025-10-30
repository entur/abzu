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

import LanguageIcon from "@mui/icons-material/Language";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Box,
  Divider,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { GroupMembership, ImportedId, TagTray } from "../../Shared";
import { ParentStopPlaceDetailsProps } from "../types";

/**
 * Details section for parent stop place
 * Contains name, description, url, tags, version, etc.
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
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const hasAltNames = !!(alternativeNames && alternativeNames.length);

  return (
    <Box sx={{ p: 2 }}>
      {/* Version and Expired Warning */}
      {version && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.text.secondary }}
          >
            {formatMessage({ id: "version" })} {version}
          </Typography>
          {hasExpired && (
            <>
              <WarningIcon sx={{ color: "warning.main", fontSize: "1rem" }} />
              <Typography variant="caption" sx={{ color: "error.main" }}>
                {formatMessage({ id: "stop_has_expired" })}
              </Typography>
            </>
          )}
        </Box>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <TagTray tags={tags.map((t) => t.name)} />
        </Box>
      )}

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

      {/* Set Centroid Button (if no location) */}
      {!location && (
        <Box sx={{ textAlign: "right", mb: 1 }}>
          <IconButton
            size="small"
            onClick={onOpenCoordinates}
            disabled={!canEdit}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <Tooltip title={formatMessage({ id: "set_centroid" })} arrow>
              <MyLocationIcon />
            </Tooltip>
          </IconButton>
        </Box>
      )}

      {/* Name Field with Alt Names Button */}
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
        <TextField
          label={formatMessage({ id: "name" })}
          fullWidth
          required
          value={name}
          disabled={!canEdit}
          error={!name}
          helperText={!name ? formatMessage({ id: "name_is_required" }) : ""}
          onChange={(e) => onNameChange(e.target.value)}
          variant="standard"
        />
        <Tooltip title={formatMessage({ id: "alternative_names" })} arrow>
          <IconButton
            size="small"
            onClick={onOpenAltNames}
            disabled={!canEdit}
            sx={{
              mt: 1,
              color: hasAltNames
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
            }}
          >
            <LanguageIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Description Field */}
      <TextField
        label={formatMessage({ id: "description" })}
        fullWidth
        value={description || ""}
        disabled={!canEdit}
        onChange={(e) => onDescriptionChange(e.target.value)}
        variant="standard"
        sx={{ mb: 2 }}
      />

      {/* URL Field (optional, feature-flagged in legacy) */}
      {url !== undefined && (
        <TextField
          label={formatMessage({ id: "url" })}
          fullWidth
          value={url || ""}
          disabled={!canEdit}
          onChange={(e) => onUrlChange(e.target.value)}
          variant="standard"
          sx={{ mb: 2 }}
        />
      )}

      {/* Tags Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <Tooltip title={formatMessage({ id: "tags" })} arrow>
          <IconButton
            size="small"
            onClick={onOpenTags}
            disabled={!canEdit}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": {
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            <LocalOfferIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />
    </Box>
  );
};
