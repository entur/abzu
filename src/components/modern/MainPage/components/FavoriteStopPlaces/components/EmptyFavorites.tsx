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

import { Star as StarIcon } from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { useIntl } from "react-intl";

/**
 * Empty state component for favorites list
 * Displays when no favorites have been added
 */
export const EmptyFavorites: React.FC = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <StarIcon
        sx={{
          fontSize: 48,
          color: theme.palette.action.disabled,
          mb: 1,
        }}
      />
      <Typography variant="body1" color="text.secondary">
        {formatMessage({ id: "no_favorite_stop_places" }) ||
          "No favorite stop places"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {formatMessage({ id: "add_favorites_by_clicking_star" }) ||
          "Add favorites by clicking the star icon in search results"}
      </Typography>
    </Box>
  );
};
