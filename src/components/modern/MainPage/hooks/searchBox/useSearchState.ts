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

import { useCallback, useState } from "react";

/**
 * Hook for managing local state in search box
 * Handles loading states, search values, and filter visibility
 */
export const useSearchState = () => {
  const [showMoreFilterOptions, setShowMoreFilterOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSelection, setLoadingSelection] = useState(false);
  const [loadingStopPlaceName, setLoadingStopPlaceName] = useState<string>("");
  const [stopPlaceSearchValue, setStopPlaceSearchValue] = useState("");
  const [topographicPlaceFilterValue, setTopographicPlaceFilterValue] =
    useState("");

  const handleToggleFilter = useCallback((value: boolean) => {
    setShowMoreFilterOptions(value);
  }, []);

  return {
    showMoreFilterOptions,
    loading,
    setLoading,
    loadingSelection,
    setLoadingSelection,
    loadingStopPlaceName,
    setLoadingStopPlaceName,
    stopPlaceSearchValue,
    setStopPlaceSearchValue,
    topographicPlaceFilterValue,
    setTopographicPlaceFilterValue,
    handleToggleFilter,
  };
};
