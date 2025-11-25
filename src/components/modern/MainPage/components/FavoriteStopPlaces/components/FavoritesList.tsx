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

import { Clear as ClearIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  List,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { FavoriteStopPlace } from "../../../../../../utils/favoriteStopPlaces";
import { modernCard } from "../../../../styles";
import { FavoriteItem } from "./FavoriteItem";

interface FavoritesListProps {
  favorites: FavoriteStopPlace[];
  onSelectFavorite: (favorite: FavoriteStopPlace) => void;
  onRemoveFavorite: (stopPlaceId: string, event: React.MouseEvent) => void;
  onClearAll: () => void;
}

/**
 * List container for favorite stop places
 * Shows header with clear all button and list of favorite items
 */
export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
  onClearAll,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  return (
    <Paper elevation={0} sx={modernCard(theme)}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {formatMessage({ id: "favorite_stop_places" }) ||
            "Favorite Stop Places"}
        </Typography>
        {favorites.length > 1 && (
          <Button
            startIcon={<ClearIcon />}
            onClick={onClearAll}
            size="small"
            sx={{
              textTransform: "none",
              color: theme.palette.text.secondary,
            }}
          >
            {formatMessage({ id: "clear_all" }) || "Clear All"}
          </Button>
        )}
      </Box>

      <List dense sx={{ maxHeight: "60vh", overflow: "auto" }}>
        {favorites.map((favorite, index) => (
          <React.Fragment key={favorite.id}>
            <FavoriteItem
              favorite={favorite}
              onSelect={onSelectFavorite}
              onRemove={onRemoveFavorite}
            />
            {index < favorites.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};
