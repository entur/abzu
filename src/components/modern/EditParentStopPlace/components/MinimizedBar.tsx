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
import { Box, IconButton, Paper, Typography, useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import { MinimizedBarProps } from "../types";

/**
 * Minimized bar shown when drawer is collapsed
 * Mobile: Bottom of screen (slides up)
 * Desktop/Tablet: Below header at fixed width (always visible)
 */
export const MinimizedBar: React.FC<MinimizedBarProps> = ({
  name,
  id,
  onExpand,
  onClose,
  isMobile,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const displayText = id
    ? name || formatMessage({ id: "parentStopPlace" })
    : formatMessage({ id: "new_stop_title" });

  return (
    <Paper
      elevation={isMobile ? 8 : 0}
      sx={{
        ...(isMobile
          ? {
              // Mobile: bottom of screen
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: theme.zIndex.drawer - 1,
              borderTop: `1px solid ${theme.palette.divider}`,
            }
          : {
              // Desktop/Tablet: below header
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderRight: `1px solid ${theme.palette.divider}`,
            }),
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 1.5,
        px: 2,
        bgcolor: theme.palette.background.paper,
      }}
    >
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
        {id && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {id}
          </Typography>
        )}
      </Box>

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
        {isMobile ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>

      <IconButton
        size="small"
        onClick={onClose}
        sx={{
          color: theme.palette.text.primary,
          "&:hover": {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Paper>
  );
};
