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

import { useCallback, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { REPORTS_ROUTE } from "./useIsReportsRoute";

const REPORTS_LOCATION = REPORTS_ROUTE;

/**
 * Remembers the last Reports URL, including its search, so the Reports tab
 * brings the user back to the same query and filters after opening a stop
 * from the results (F-65). Mirrors useLastMapLocation.
 *
 * The stored path is relative to the router base path, so it can be passed
 * straight to the router's navigate. Returns a getter, so the click handler
 * reads the latest value without re-rendering the header.
 */
export const useLastReportsLocation = (): (() => string) => {
  const { pathname, search } = useLocation();
  const lastReportsLocationRef = useRef(REPORTS_LOCATION);

  useEffect(() => {
    if (pathname !== REPORTS_LOCATION) return;
    lastReportsLocationRef.current = pathname + search;
  }, [pathname, search]);

  return useCallback(() => lastReportsLocationRef.current, []);
};
