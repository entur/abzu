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
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useIntl } from "react-intl";
import { CopyIdButton } from "../../Shared";
import { ParentStopPlaceHeaderProps } from "../types";

/**
 * Header component for parent stop place editor
 * Shows title, location, ID, copy button, collapse button, and close button
 */
export const ParentStopPlaceHeader: React.FC<ParentStopPlaceHeaderProps> = ({
  stopPlace,
  originalStopPlace,
  onGoBack,
  onCollapse,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const headerText = stopPlace.id
    ? originalStopPlace.name
    : formatMessage({ id: "new_stop_title" });

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
        {stopPlace.topographicPlace && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              display: "block",
            }}
          >
            {`${stopPlace.topographicPlace}, ${stopPlace.parentTopographicPlace}`}
          </Typography>
        )}
        {stopPlace.id && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.secondary }}
            >
              {stopPlace.id}
            </Typography>
            <CopyIdButton
              idToCopy={stopPlace.id}
              color={theme.palette.text.secondary}
            />
          </Box>
        )}
      </Box>

      {onCollapse && (
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
          {isMobile ? <ExpandMoreIcon /> : <ExpandLessIcon />}
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
