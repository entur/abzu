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

import React from "react";
import { useIntl } from "react-intl";
import { LoadingDialog } from "../../../Shared";
import { EmptyFavorites, FavoritesList } from "./components";
import { useFavoriteStopPlaces } from "./hooks/useFavoriteStopPlaces";

interface FavoriteStopPlacesProps {
  onClose?: () => void;
}

/**
 * Favorite Stop Places component
 * Refactored into focused components for better maintainability
 * Displays list of user's favorite stop places with navigation
 */
export const FavoriteStopPlaces: React.FC<FavoriteStopPlacesProps> = ({
  onClose,
}) => {
  const { formatMessage } = useIntl();

  const {
    favorites,
    loadingSelection,
    loadingStopPlaceName,
    handleSelectFavorite,
    handleRemoveFavorite,
    handleClearAll,
  } = useFavoriteStopPlaces(onClose);

  return (
    <>
      <LoadingDialog
        open={loadingSelection}
        message={
          loadingStopPlaceName
            ? `${formatMessage({ id: "loading" })} ${loadingStopPlaceName}`
            : formatMessage({ id: "loading" })
        }
      />

      {favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <FavoritesList
          favorites={favorites}
          onSelectFavorite={handleSelectFavorite}
          onRemoveFavorite={handleRemoveFavorite}
          onClearAll={handleClearAll}
        />
      )}
    </>
  );
};
