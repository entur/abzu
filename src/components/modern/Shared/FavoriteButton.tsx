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
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { FavoriteStopPlacesManager } from "../../../utils/favoriteStopPlaces";

export interface FavoriteButtonProps {
  id: string;
  name: string;
  entityType: string;
  stopPlaceType?: string;
  submode?: string;
  isParent?: boolean;
  topographicPlace?: string;
  parentTopographicPlace?: string;
  location?: [number, number];
}

/**
 * Reusable favorite button component
 * Displays a star icon that toggles between filled and outline
 * based on whether the item is in the user's favorites
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  id,
  name,
  entityType,
  stopPlaceType,
  submode,
  isParent,
  topographicPlace,
  parentTopographicPlace,
  location,
}) => {
  const { formatMessage } = useIntl();
  const [isFavorite, setIsFavorite] = useState(false);
  const favoriteManager = FavoriteStopPlacesManager.getInstance();

  useEffect(() => {
    setIsFavorite(favoriteManager.isFavorite(id));
  }, [id]);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      favoriteManager.removeFavorite(id);
      setIsFavorite(false);
    } else {
      favoriteManager.addFavorite({
        id,
        name,
        entityType,
        stopPlaceType,
        submode,
        isParent,
        topographicPlace,
        parentTopographicPlace,
        location,
      });
      setIsFavorite(true);
    }
  };

  return (
    <Tooltip
      title={
        isFavorite
          ? formatMessage({ id: "remove_from_favorites" })
          : formatMessage({ id: "add_to_favorites" })
      }
    >
      <IconButton
        size="small"
        onClick={handleToggleFavorite}
        sx={{
          color: isFavorite ? "warning.main" : "text.secondary",
          "&:hover": {
            color: "warning.main",
            bgcolor: "action.hover",
          },
        }}
        aria-label={
          isFavorite
            ? formatMessage({ id: "remove_from_favorites" })
            : formatMessage({ id: "add_to_favorites" })
        }
      >
        {isFavorite ? (
          <StarIcon sx={{ width: 20, height: 20 }} />
        ) : (
          <StarBorderIcon sx={{ width: 20, height: 20 }} />
        )}
      </IconButton>
    </Tooltip>
  );
};
