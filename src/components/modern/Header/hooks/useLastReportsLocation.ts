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
import AppRoutes from "../../../../routes";
import { useAppSelector } from "../../../../store/hooks";

const REPORTS_LOCATION = `/${AppRoutes.REPORTS}`;

/**
 * Remembers the last Reports URL, including its search, so the Reports tab
 * brings the user back to the same query and filters after opening a stop
 * from the results (F-65). Mirrors useLastMapLocation.
 *
 * Returns a getter, so the click handler reads the latest value without
 * re-rendering the header.
 */
export const useLastReportsLocation = (): (() => string) => {
  const { pathname, search } = useAppSelector(
    (state: any) =>
      state.router.location as { pathname: string; search: string },
  );
  const lastReportsLocationRef = useRef(REPORTS_LOCATION);

  useEffect(() => {
    if (pathname !== REPORTS_LOCATION) return;
    lastReportsLocationRef.current = pathname + search;
  }, [pathname, search]);

  return useCallback(() => lastReportsLocationRef.current, []);
};
