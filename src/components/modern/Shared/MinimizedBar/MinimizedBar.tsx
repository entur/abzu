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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Divider,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { CenterMapButton } from "../CenterMapButton";
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
  centerLocation,
  isMobile,
  hasExpired,
  customHeader,
  tabStrip,
  actionBar,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const barActions = actions ?? [];

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
        py: customHeader ? 0 : 1,
        px: customHeader ? 0 : 1.5,
        bgcolor: theme.palette.background.paper,
      }}
    >
      {/* Header row — custom (e.g. StopPlaceHeader) or default */}
      {customHeader ?? (
        <>
          <MinimizedBarHeader
            icon={icon}
            name={name}
            id={id}
            entityType={entityType}
            hasId={hasId}
            isMobile={isMobile}
            onExpand={onExpand}
          />
          {hasExpired && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 0.5,
                py: 0.25,
                bgcolor: "warning.main",
                color: "warning.contrastText",
                borderRadius: 0.5,
              }}
            >
              <WarningAmberIcon sx={{ fontSize: "0.9rem" }} />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {formatMessage({ id: "stop_has_expired_last_version" })}
              </Typography>
            </Box>
          )}
        </>
      )}

      {customHeader && <Divider />}

      {/* Mirror of the expanded panel: tab strip then action bar. Collapsing must
          not hide which tab has unsaved edits, nor the means to save them. */}
      {tabStrip || actionBar ? (
        <>
          {tabStrip}
          {tabStrip && actionBar ? <Divider /> : null}
          {actionBar}
        </>
      ) : (
        /* Icons — second row, for bars that supply plain actions instead */
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            ...(customHeader && { px: 1.5, py: 0.5 }),
          }}
        >
          {/* Desktop: Show all action icons */}
          <MinimizedBarActions
            actions={barActions}
            isSmallScreen={isSmallScreen}
          />

          {/* Mobile/Tablet: Show overflow menu */}
          {isSmallScreen && barActions.length > 0 && (
            <>
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{
                  color: theme.palette.text.primary,
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>

              <MinimizedBarMenu
                actions={barActions}
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleMenuClose}
              />
            </>
          )}

          {/* Center map — only shown in second row when using the default header */}
          {!customHeader && <CenterMapButton location={centerLocation} />}

          {/* Close — suppressed when customHeader owns the X */}
          {!customHeader && (
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
          )}
        </Box>
      )}
    </Paper>
  );
};
