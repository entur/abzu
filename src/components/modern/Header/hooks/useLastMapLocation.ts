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

const REPORTS_PATHNAME = `/${AppRoutes.REPORTS}`;
const MAP_OVERVIEW_LOCATION = "/";

interface RouterLocation {
  pathname: string;
  search: string;
}

/**
 * Remembers the last route that sits on top of the map — the overview, a stop
 * place or a group — so the Map tab can return to it from Reports instead of
 * always landing on the bare overview with the editor panel gone.
 *
 * Returns a getter rather than the value, so the click handler reads the
 * location recorded by the latest effect without re-rendering the header.
 */
export const useLastMapLocation = (): (() => string) => {
  const { pathname, search } = useAppSelector(
    (state: any) => state.router.location as RouterLocation,
  );
  const lastMapLocationRef = useRef(MAP_OVERVIEW_LOCATION);

  useEffect(() => {
    if (pathname === REPORTS_PATHNAME) return;
    lastMapLocationRef.current = pathname + search;
  }, [pathname, search]);

  return useCallback(() => lastMapLocationRef.current, []);
};
