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

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlaceIcon from "@mui/icons-material/Place";
import SaveIcon from "@mui/icons-material/Save";
import UndoIcon from "@mui/icons-material/Undo";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { FavoriteButton } from "../../Shared";

interface MinimizedBarProps {
  name?: string;
  id?: string;
  entityType: string;
  hasId: boolean;
  isModified: boolean;
  canEdit: boolean;
  canDelete: boolean;
  hasName: boolean;
  isMobile: boolean;
  onClose: () => void;
  onExpand: () => void;
  onOpenInfo: () => void;
  onOpenNameDescription: () => void;
  onOpenStopPlaces: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRemove: () => void;
}

/**
 * Minimized bar with all action icons
 * Desktop: All icons visible
 * Mobile: Name, Star, Info, Close visible; rest in menu
 */
export const MinimizedBar: React.FC<MinimizedBarProps> = ({
  name,
  id,
  entityType,
  hasId,
  isModified,
  canEdit,
  canDelete,
  hasName,
  isMobile,
  onClose,
  onExpand,
  onOpenInfo,
  onOpenNameDescription,
  onOpenStopPlaces,
  onSave,
  onUndo,
  onRemove,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const displayText = id
    ? name || formatMessage({ id: "group_of_stop_places" })
    : formatMessage({ id: "you_are_creating_group" });

  const isSaveDisabled = !isModified || !hasName || !canEdit;
  const isUndoDisabled = !isModified || !canEdit;
  const isRemoveDisabled = !canDelete;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  return (
    <Paper
      elevation={isMobile ? 8 : 0}
      sx={{
        ...(isMobile
          ? {
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: theme.zIndex.drawer - 1,
              borderTop: `1px solid ${theme.palette.divider}`,
            }
          : {
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderRight: `1px solid ${theme.palette.divider}`,
            }),
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        py: 1,
        px: 1.5,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Name */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {displayText}
        </Typography>
      </Box>

      {/* Star (Favorite) */}
      {hasId && id && (
        <FavoriteButton id={id} name={name || ""} entityType={entityType} />
      )}

      {/* Info */}
      <Tooltip title={formatMessage({ id: "information" })} arrow>
        <IconButton
          size="small"
          onClick={onOpenInfo}
          sx={{
            color: theme.palette.text.secondary,
            "&:hover": { bgcolor: theme.palette.action.hover },
          }}
        >
          <InfoIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Desktop: Show all icons */}
      {!isSmallScreen && (
        <>
          {/* Name & Description */}
          <Tooltip
            title={formatMessage({ id: "edit_name_and_description" })}
            arrow
          >
            <IconButton
              size="small"
              onClick={onOpenNameDescription}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": { bgcolor: theme.palette.action.hover },
              }}
            >
              <DescriptionIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Stop Places */}
          <Tooltip title={formatMessage({ id: "manage_stop_places" })} arrow>
            <IconButton
              size="small"
              onClick={onOpenStopPlaces}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": { bgcolor: theme.palette.action.hover },
              }}
            >
              <PlaceIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Save, Undo, Remove - only when canEdit */}
          {canEdit && (
            <>
              {hasId && (
                <Tooltip title={formatMessage({ id: "remove" })} arrow>
                  <span>
                    <IconButton
                      size="small"
                      onClick={onRemove}
                      disabled={isRemoveDisabled}
                      sx={{
                        color: theme.palette.error.main,
                        "&:hover": { bgcolor: theme.palette.action.hover },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}

              <Tooltip title={formatMessage({ id: "undo_changes" })} arrow>
                <span>
                  <IconButton
                    size="small"
                    onClick={onUndo}
                    disabled={isUndoDisabled}
                    sx={{
                      color: theme.palette.text.secondary,
                      "&:hover": { bgcolor: theme.palette.action.hover },
                    }}
                  >
                    <UndoIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title={formatMessage({ id: "save" })} arrow>
                <span>
                  <IconButton
                    size="small"
                    onClick={onSave}
                    disabled={isSaveDisabled}
                    sx={{
                      color: isSaveDisabled
                        ? theme.palette.action.disabled
                        : theme.palette.primary.main,
                      "&:hover": { bgcolor: theme.palette.action.hover },
                    }}
                  >
                    <SaveIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}
        </>
      )}

      {/* Mobile: Menu for collapsed icons */}
      {isSmallScreen && (
        <>
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": { bgcolor: theme.palette.action.hover },
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={() => handleMenuAction(onOpenNameDescription)}>
              <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
              {formatMessage({ id: "edit_name_and_description" })}
            </MenuItem>

            <MenuItem onClick={() => handleMenuAction(onOpenStopPlaces)}>
              <PlaceIcon fontSize="small" sx={{ mr: 1 }} />
              {formatMessage({ id: "manage_stop_places" })}
            </MenuItem>

            {canEdit && (
              <>
                {hasId && (
                  <MenuItem
                    onClick={() => handleMenuAction(onRemove)}
                    disabled={isRemoveDisabled}
                  >
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} color="error" />
                    {formatMessage({ id: "remove" })}
                  </MenuItem>
                )}

                <MenuItem
                  onClick={() => handleMenuAction(onUndo)}
                  disabled={isUndoDisabled}
                >
                  <UndoIcon fontSize="small" sx={{ mr: 1 }} />
                  {formatMessage({ id: "undo_changes" })}
                </MenuItem>

                <MenuItem
                  onClick={() => handleMenuAction(onSave)}
                  disabled={isSaveDisabled}
                >
                  <SaveIcon fontSize="small" sx={{ mr: 1 }} />
                  {formatMessage({ id: "save" })}
                </MenuItem>
              </>
            )}
          </Menu>
        </>
      )}

      {/* Expand/Collapse */}
      <Tooltip
        title={formatMessage({ id: isMobile ? "expand" : "expand" })}
        arrow
      >
        <IconButton
          size="small"
          onClick={onExpand}
          sx={{
            color: theme.palette.primary.main,
            bgcolor: theme.palette.action.hover,
            "&:hover": {
              bgcolor: theme.palette.action.selected,
            },
          }}
        >
          {isMobile ? (
            <ExpandLessIcon fontSize="small" />
          ) : (
            <ExpandMoreIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>

      {/* Close */}
      <Tooltip title={formatMessage({ id: "close" })} arrow>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: theme.palette.text.primary,
            "&:hover": { bgcolor: theme.palette.action.hover },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};
