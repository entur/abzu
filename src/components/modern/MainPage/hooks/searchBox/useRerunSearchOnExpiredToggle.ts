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

import { useEffect, useRef } from "react";

type SearchUpdate = (event: null, searchText: string) => void;

/**
 * "Show expired stops" is one setting for the map and the search, switched in
 * the map settings. When it changes while there is search text, the search
 * runs again so the results match the setting.
 */
export const useRerunSearchOnExpiredToggle = (
  showFutureAndExpired: boolean,
  searchText: string,
  handleSearchUpdate: SearchUpdate,
): void => {
  const latestRef = useRef({ searchText, handleSearchUpdate });
  useEffect(() => {
    latestRef.current = { searchText, handleSearchUpdate };
  }, [searchText, handleSearchUpdate]);

  const previousValueRef = useRef(showFutureAndExpired);
  useEffect(() => {
    if (previousValueRef.current === showFutureAndExpired) return;
    previousValueRef.current = showFutureAndExpired;

    const { searchText: currentText, handleSearchUpdate: search } =
      latestRef.current;
    if (!currentText) return;
    search(null, currentText);
  }, [showFutureAndExpired]);
};
