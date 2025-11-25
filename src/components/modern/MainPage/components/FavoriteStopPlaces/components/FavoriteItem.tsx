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
  Delete as DeleteIcon,
  GroupWork as GroupIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { Entities } from "../../../../../../models/Entities";
import { FavoriteStopPlace } from "../../../../../../utils/favoriteStopPlaces";
import ModalityIconImg from "../../../../../MainPage/ModalityIconImg";

interface FavoriteItemProps {
  favorite: FavoriteStopPlace;
  onSelect: (favorite: FavoriteStopPlace) => void;
  onRemove: (stopPlaceId: string, event: React.MouseEvent) => void;
}

/**
 * Individual favorite stop place list item
 * Shows icon, name, location, and remove button
 */
export const FavoriteItem: React.FC<FavoriteItemProps> = ({
  favorite,
  onSelect,
  onRemove,
}) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();

  const getIcon = () => {
    if (favorite.entityType === Entities.GROUP_OF_STOP_PLACE) {
      return <GroupIcon sx={{ color: theme.palette.primary.main }} />;
    }

    if (
      favorite.isParent ||
      (!favorite.stopPlaceType && favorite.entityType === Entities.STOP_PLACE)
    ) {
      return <LinkIcon sx={{ color: theme.palette.primary.main }} />;
    }

    return (
      <ModalityIconImg
        type={favorite.stopPlaceType}
        submode={favorite.submode}
        svgStyle={{ transform: "scale(0.8)" }}
      />
    );
  };

  const isMultiModal =
    favorite.isParent ||
    (!favorite.stopPlaceType && favorite.entityType === Entities.STOP_PLACE);

  return (
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
      <ListItemIcon sx={{ minWidth: 36 }}>{getIcon()}</ListItemIcon>
      <Box onClick={() => onSelect(favorite)} sx={{ flexGrow: 1, minWidth: 0 }}>
        <ListItemText
          primary={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {favorite.name}
              {isMultiModal && (
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.7em",
                    marginLeft: 0.5,
                  }}
                >
                  MM
                </Typography>
              )}
            </Typography>
          }
          secondary={
            <Box>
              {favorite.topographicPlace && favorite.parentTopographicPlace && (
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
      <Tooltip title={formatMessage({ id: "remove_from_favorites" })} arrow>
        <IconButton
          aria-label="remove from favorites"
          onClick={(event) => onRemove(favorite.id, event)}
          size="small"
          sx={{
            color: theme.palette.error.main,
            "&:hover": {
              color: theme.palette.error.dark,
            },
            ml: 1,
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
};
