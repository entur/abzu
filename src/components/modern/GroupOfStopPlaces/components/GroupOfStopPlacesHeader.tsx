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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import { CopyIdButton } from "../../Shared";
import { GroupOfStopPlacesHeaderProps } from "../types";

/**
 * Header component for group of stop places editor
 * Shows title, ID, copy button, close button, and collapse button (mobile only)
 */
export const GroupOfStopPlacesHeader: React.FC<
  GroupOfStopPlacesHeaderProps
> = ({ groupOfStopPlaces, onGoBack, onCollapse, isMobile }) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const headerText = groupOfStopPlaces.id
    ? groupOfStopPlaces.name
    : formatMessage({ id: "you_are_creating_group" });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        py: 2,
        px: 2,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {headerText}
        </Typography>
        {groupOfStopPlaces.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              {groupOfStopPlaces.id}
            </Typography>
            <CopyIdButton
              idToCopy={groupOfStopPlaces.id}
              color={theme.palette.text.secondary}
            />
          </Box>
        )}
      </Box>

      {isMobile && onCollapse && (
        <IconButton
          size="small"
          onClick={onCollapse}
          sx={{
            color: theme.palette.text.primary,
            "&:hover": {
              bgcolor: theme.palette.action.hover,
            },
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      )}

      <IconButton
        size="small"
        onClick={onGoBack}
        sx={{
          color: theme.palette.text.primary,
          "&:hover": {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};
