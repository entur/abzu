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

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { StopPlaceActions, UserActions } from "../../../../../../actions";
import {
  getGroupOfStopPlacesById,
  getStopPlaceById,
} from "../../../../../../actions/TiamatActions";
import { Entities } from "../../../../../../models/Entities";
import formatHelpers from "../../../../../../modelUtils/mapToClient";
import Routes from "../../../../../../routes";
import {
  FavoriteStopPlace,
  FavoriteStopPlacesManager,
} from "../../../../../../utils/favoriteStopPlaces";

/**
 * Hook for managing favorite stop places
 * Handles fetching favorites, navigation, and CRUD operations
 */
export const useFavoriteStopPlaces = (onClose?: () => void) => {
  const dispatch = useDispatch() as any;
  const favoriteManager = FavoriteStopPlacesManager.getInstance();

  const [favorites, setFavorites] = useState<FavoriteStopPlace[]>([]);
  const [loadingSelection, setLoadingSelection] = useState(false);
  const [loadingStopPlaceName, setLoadingStopPlaceName] = useState<string>("");

  // Load favorites on mount
  useEffect(() => {
    setFavorites(favoriteManager.getFavorites());
  }, [favoriteManager]);

  // Handle favorite selection and navigation
  const handleSelectFavorite = useCallback(
    (favorite: FavoriteStopPlace) => {
      // Close panels if callback provided
      if (onClose) {
        onClose();
      }

      // Set loading state
      setLoadingSelection(true);
      setLoadingStopPlaceName(favorite.name || "");

      const stopPlaceId = favorite.id;
      const entityType = favorite.entityType;

      // Determine the route for navigation
      const route =
        entityType === Entities.GROUP_OF_STOP_PLACE
          ? Routes.GROUP_OF_STOP_PLACE
          : Routes.STOP_PLACE;

      if (stopPlaceId && entityType === Entities.GROUP_OF_STOP_PLACE) {
        // Fetch group of stop places data
        dispatch(getGroupOfStopPlacesById(stopPlaceId))
          .then(() => {
            dispatch(UserActions.navigateTo(`/${route}/`, stopPlaceId));
          })
          .finally(() => {
            setLoadingSelection(false);
            setLoadingStopPlaceName("");
          });
      } else if (stopPlaceId) {
        // Fetch stop place data
        dispatch(getStopPlaceById(stopPlaceId))
          .then(({ data }: any) => {
            if (data.stopPlace && data.stopPlace.length) {
              const stopPlaces = formatHelpers.mapSearchResultToStopPlaces(
                data.stopPlace,
              );
              if (stopPlaces.length) {
                dispatch(StopPlaceActions.setMarkerOnMap(stopPlaces[0]));
              }
            }
            dispatch(UserActions.navigateTo(`/${route}/`, stopPlaceId));
          })
          .finally(() => {
            setLoadingSelection(false);
            setLoadingStopPlaceName("");
          });
      }
    },
    [dispatch, onClose, favoriteManager],
  );

  // Handle removing a single favorite
  const handleRemoveFavorite = useCallback(
    (stopPlaceId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      favoriteManager.removeFavorite(stopPlaceId);
      setFavorites(favoriteManager.getFavorites());
    },
    [favoriteManager],
  );

  // Handle clearing all favorites
  const handleClearAll = useCallback(() => {
    favoriteManager.clearAll();
    setFavorites([]);
  }, [favoriteManager]);

  return {
    favorites,
    loadingSelection,
    loadingStopPlaceName,
    handleSelectFavorite,
    handleRemoveFavorite,
    handleClearAll,
  };
};
