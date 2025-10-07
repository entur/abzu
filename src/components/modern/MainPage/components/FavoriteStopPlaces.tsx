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

import {
  Clear as ClearIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { UserActions } from "../../../../actions";
import Routes from "../../../../routes";
import {
  FavoriteStopPlace,
  FavoriteStopPlacesManager,
} from "../../../../utils/favoriteStopPlaces";
import ModalityIconImg from "../../../MainPage/ModalityIconImg";

interface FavoriteStopPlacesProps {
  onClose?: () => void;
}

export const FavoriteStopPlaces: React.FC<FavoriteStopPlacesProps> = ({
  onClose,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch() as any;
  const [favorites, setFavorites] = useState<FavoriteStopPlace[]>([]);
  const favoriteManager = FavoriteStopPlacesManager.getInstance();

  useEffect(() => {
    setFavorites(favoriteManager.getFavorites());
  }, []);

  const handleSelectFavorite = (favorite: FavoriteStopPlace) => {
    // Close all panels and clear search input
    if (onClose) {
      onClose();
    }
    // Navigate directly to the stop place edit page
    dispatch(UserActions.navigateTo(`/${Routes.STOP_PLACE}/`, favorite.id));
  };

  const handleRemoveFavorite = (
    stopPlaceId: string,
    event: React.MouseEvent,
  ) => {
    event.stopPropagation();
    favoriteManager.removeFavorite(stopPlaceId);
    setFavorites(favoriteManager.getFavorites());
  };

  const handleClearAll = () => {
    favoriteManager.clearAll();
    setFavorites([]);
  };

  if (favorites.length === 0) {
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
  }

  return (
    <Box>
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
            onClick={handleClearAll}
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
            <ListItem
              component="div"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
                display: "flex",
                alignItems: "center",
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <ModalityIconImg
                  type={favorite.stopPlaceType}
                  submode={favorite.submode}
                  svgStyle={{ transform: "scale(0.8)" }}
                />
              </ListItemIcon>
              <Box
                onClick={() => handleSelectFavorite(favorite)}
                sx={{ flexGrow: 1, minWidth: 0 }}
              >
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {favorite.name}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {favorite.topographicPlace &&
                        favorite.parentTopographicPlace && (
                          <Typography variant="caption" color="text.secondary">
                            {`${favorite.topographicPlace}, ${favorite.parentTopographicPlace}`}
                          </Typography>
                        )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        {formatMessage({ id: "added" }) || "Added"}:{" "}
                        {new Date(favorite.addedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
              <IconButton
                aria-label="remove from favorites"
                onClick={(event) => handleRemoveFavorite(favorite.id, event)}
                size="small"
                sx={{
                  color: theme.palette.action.active,
                  "&:hover": {
                    color: theme.palette.error.main,
                  },
                  ml: 1,
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
            {index < favorites.length - 1 && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};
