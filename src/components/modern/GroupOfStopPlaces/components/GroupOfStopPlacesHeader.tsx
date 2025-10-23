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

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import { CopyIdButton } from "../../Shared";
import { GroupOfStopPlacesHeaderProps } from "../types";

/**
 * Header component for group of stop places editor
 * Shows back button, title, ID, and copy button
 */
export const GroupOfStopPlacesHeader: React.FC<
  GroupOfStopPlacesHeaderProps
> = ({ groupOfStopPlaces, onGoBack }) => {
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
        py: 1.5,
        px: 2,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      <IconButton
        size="small"
        onClick={onGoBack}
        sx={{
          color: theme.palette.primary.contrastText,
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {headerText}
        </Typography>
        {groupOfStopPlaces.id && (
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {groupOfStopPlaces.id}
          </Typography>
        )}
      </Box>

      {groupOfStopPlaces.id && (
        <CopyIdButton
          idToCopy={groupOfStopPlaces.id}
          color={theme.palette.primary.contrastText}
        />
      )}
    </Box>
  );
};
