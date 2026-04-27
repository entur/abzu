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

import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import PlaceIcon from "@mui/icons-material/Place";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Box,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";

export interface MinimalEditViewProps {
  name: string;
  description: string;
  stopPlacesCount: number;
  hasId: boolean;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasName: boolean;
  onOpenNameDescription: () => void;
  onOpenStopPlaces: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRemove: () => void;
}

/**
 * Minimal edit view showing summary and icon buttons
 */
export const MinimalEditView: React.FC<MinimalEditViewProps> = ({
  name,
  description,
  stopPlacesCount,
  hasId,
  isModified,
  canEdit,
  canDelete,
  hasName,
  onOpenNameDescription,
  onOpenStopPlaces,
  onSave,
  onUndo,
  onRemove,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();

  const isSaveDisabled = !isModified || !hasName || !canEdit;
  const isUndoDisabled = !isModified || !canEdit;
  const isRemoveDisabled = !canDelete;

  return (
    <Box>
      {/* Summary Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {name || formatMessage({ id: "new_group" })}
        </Typography>
        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </Typography>
        )}
      </Box>

      <Divider />

      {/* Edit Sections */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Name and Description Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1.5,
            borderRadius: 1,
            bgcolor: "background.default",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <DescriptionIcon sx={{ color: "primary.main", fontSize: 24 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatMessage({ id: "name_and_description" })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {name ? name : formatMessage({ id: "no_name" })}
              </Typography>
            </Box>
          </Box>
          <Tooltip
            title={formatMessage({ id: "edit_name_and_description" })}
            arrow
          >
            <IconButton
              size="small"
              onClick={onOpenNameDescription}
              sx={{
                color: "primary.main",
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <DescriptionIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Stop Places Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1.5,
            borderRadius: 1,
            bgcolor: "background.default",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <PlaceIcon sx={{ color: "primary.main", fontSize: 24 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatMessage({ id: "stop_places" })}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stopPlacesCount}{" "}
                {formatMessage({
                  id: stopPlacesCount === 1 ? "stop_place" : "stop_places",
                })}
              </Typography>
            </Box>
          </Box>
          <Tooltip title={formatMessage({ id: "manage_stop_places" })} arrow>
            <IconButton
              size="small"
              onClick={onOpenStopPlaces}
              sx={{
                color: "primary.main",
                bgcolor: "action.hover",
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <PlaceIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider />

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          gap: 1,
          p: 1.5,
          bgcolor: "background.paper",
        }}
      >
        {hasId && (
          <Tooltip title={formatMessage({ id: "remove" })} arrow>
            <span>
              <IconButton
                color="error"
                onClick={onRemove}
                disabled={isRemoveDisabled}
                sx={{
                  border: `1px solid ${theme.palette.error.main}`,
                  "&:disabled": {
                    border: `1px solid ${theme.palette.action.disabledBackground}`,
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        )}
        <Tooltip title={formatMessage({ id: "undo_changes" })} arrow>
          <span>
            <IconButton
              onClick={onUndo}
              disabled={isUndoDisabled}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                "&:disabled": {
                  border: `1px solid ${theme.palette.action.disabledBackground}`,
                },
              }}
            >
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={formatMessage({ id: "save" })} arrow>
          <span>
            <IconButton
              color="primary"
              onClick={onSave}
              disabled={isSaveDisabled}
              sx={{
                bgcolor: isSaveDisabled
                  ? "action.disabledBackground"
                  : "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                "&:disabled": {
                  bgcolor: "action.disabledBackground",
                  color: "action.disabled",
                },
              }}
            >
              <SaveIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};
