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
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  IconButton,
  Paper,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { MinimizedBarActions } from "./MinimizedBarActions";
import { MinimizedBarHeader } from "./MinimizedBarHeader";
import { MinimizedBarMenu } from "./MinimizedBarMenu";
import { MinimizedBarProps } from "./types";

/**
 * Generic minimized bar component
 * Can be used for any entity type (Group of Stop Places, Parent Stop Place, etc.)
 * Provides a compact view with quick access to common actions
 */
export const MinimizedBar: React.FC<MinimizedBarProps> = ({
  icon,
  name,
  id,
  entityType,
  hasId,
  actions,
  onExpand,
  onClose,
  isMobile,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
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
        flexDirection: "column",
        gap: 0.5,
        py: 1,
        px: 1.5,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Name - First Row */}
      <MinimizedBarHeader
        icon={icon}
        name={name}
        id={id}
        entityType={entityType}
        hasId={hasId}
      />

      {/* Icons - Second Row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {/* Desktop: Show all action icons */}
        <MinimizedBarActions actions={actions} isSmallScreen={isSmallScreen} />

        {/* Mobile/Tablet: Show overflow menu */}
        {isSmallScreen && actions.length > 0 && (
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

            <MinimizedBarMenu
              actions={actions}
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
            />
          </>
        )}

        {/* Expand/Collapse */}
        <Tooltip title={formatMessage({ id: "expand" })} arrow>
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
      </Box>
    </Paper>
  );
};
