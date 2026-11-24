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
import { matchPath, useLocation } from "react-router-dom";
import AppRoutes from "../../../../routes";

const MAP_OVERVIEW_LOCATION = "/";
const MAP_ROUTE_PATTERNS = [
  MAP_OVERVIEW_LOCATION,
  `/${AppRoutes.STOP_PLACE}/:stopId`,
  `/${AppRoutes.GROUP_OF_STOP_PLACE}/:groupId`,
];

const isMapRoute = (pathname: string): boolean =>
  MAP_ROUTE_PATTERNS.some((pattern) => matchPath(pattern, pathname) !== null);

/**
 * Remembers the last route that sits on top of the map — the overview, a stop
 * place or a group — so the Map tab can return to it from Reports instead of
 * always landing on the bare overview with the editor panel gone. Any other
 * route leaves the remembered location unchanged.
 *
 * The stored path is relative to the router base path, so it can be passed
 * straight to the router's navigate. Returns a getter rather than the value,
 * so the click handler reads the location recorded by the latest effect
 * without re-rendering the header.
 */
export const useLastMapLocation = (): (() => string) => {
  const { pathname, search } = useLocation();
  const lastMapLocationRef = useRef(MAP_OVERVIEW_LOCATION);

  useEffect(() => {
    if (!isMapRoute(pathname)) return;
    lastMapLocationRef.current = pathname + search;
  }, [pathname, search]);

  return useCallback(() => lastMapLocationRef.current, []);
};
