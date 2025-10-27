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

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Box, IconButton, Paper, Typography, useTheme } from "@mui/material";
import { useIntl } from "react-intl";

interface MinimizedBarProps {
  name?: string;
  id?: string;
  onExpand: () => void;
}

/**
 * Minimized bar shown at bottom of screen when drawer is collapsed on mobile
 * Displays group name/ID and expand button
 */
export const MinimizedBar: React.FC<MinimizedBarProps> = ({
  name,
  id,
  onExpand,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const displayText = id
    ? name || formatMessage({ id: "group_of_stop_places" })
    : formatMessage({ id: "you_are_creating_group" });

  return (
    <Paper
      elevation={8}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.drawer - 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 1.5,
        px: 2,
        bgcolor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
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
        onClick={onExpand}
        sx={{
          color: theme.palette.primary.main,
          bgcolor: theme.palette.action.hover,
          "&:hover": {
            bgcolor: theme.palette.action.selected,
          },
        }}
      >
        <ExpandLessIcon />
      </IconButton>
    </Paper>
  );
};
