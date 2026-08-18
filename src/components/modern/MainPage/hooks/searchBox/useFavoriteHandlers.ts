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

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { UserActions } from "../../../../../actions/";
import { FavoriteFilter } from "../../types";

/**
 * Hook for managing favorite search operations
 * Handles saving and retrieving favorite searches
 */
export const useFavoriteHandlers = (
  handleSearchUpdate: (event: any, searchText: string, reason?: string) => void,
) => {
  const dispatch = useDispatch() as any;

  const handleSaveAsFavorite = useCallback(() => {
    dispatch(UserActions.openFavoriteNameDialog());
  }, [dispatch]);

  const handleRetrieveFilter = useCallback(
    (filter: FavoriteFilter) => {
      dispatch(UserActions.loadFavoriteSearch(filter));
      handleSearchUpdate(null, filter.searchText);
    },
    [dispatch, handleSearchUpdate],
  );

  return {
    handleSaveAsFavorite,
    handleRetrieveFilter,
  };
};
