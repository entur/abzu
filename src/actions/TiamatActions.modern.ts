/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 *  the European Commission - subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *  You may obtain a copy of the Licence at:
 *
 *    https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the Licence for the specific language governing permissions and
 *  limitations under the Licence. */

/**
 * Modern TypeScript counterpart to the legacy TiamatActions.js.
 *
 * Modern UI code imports from this module instead of TiamatActions.js so we
 * can evolve the data-fetching layer (caching, query shape, loading signals)
 * without touching the legacy system.
 *
 * Everything that hasn't been overridden is forwarded straight from the legacy
 * module, so callers see one coherent API surface.
 */

export {
  addTag,
  addToMultiModalStopPlace,
  createParentStopPlace,
  deleteGroupOfStopPlaces,
  deleteParking,
  deleteQuay,
  deleteStopPlace,
  findStopForReport,
  findTagByName,
  findTopographicalPlace,
  getAddStopPlaceInfo,
  getContext,
  getLocationPermissionsForCoordinates,
  getMergeInfoForStops,
  getNeighbourStopPlaceQuays,
  getParkingForMultipleStopPlaces,
  getStopPlaceAndPathLinkByVersion,
  getStopPlaceById,
  getStopPlaceVersions,
  getTags,
  getTagsByName,
  getTopographicPlaces,
  getUserPermissions,
  mergeAllQuaysFromStop,
  mergeQuays,
  moveQuaysToNewStop,
  moveQuaysToStop,
  mutateGroupOfStopPlace,
  removeStopPlaceFromMultiModalStop,
  removeTag,
  saveParentStopPlace,
  saveParking,
  savePathLink,
  saveStopPlaceBasedOnType,
  terminateStop,
  topographicalPlaceSearch,
} from "./TiamatActions";

import { createApolloThunk, createThunk } from ".";
import { getTiamatClient } from "../graphql/clients";
import { groupOfStopPlacesQuery } from "../graphql/Tiamat/groupOfStopPlaces";
import { neighbourStopsQuery } from "../graphql/Tiamat/neighbourStops";
import { findStop, getPurposeOfGroupingQuery } from "../graphql/Tiamat/queries";
import { stopPlaceWithAll } from "../graphql/Tiamat/stopPlaceWithAll";
import type { AppDispatch, RootState } from "../store/store";
import { cleanBBoxResult } from "../components/modern/Map/markers/utils/cleanBBoxResult";
import { getContext } from "./TiamatActions";
import * as types from "./Types";

/**
 * Loads a stop place and its path links and parking, without eagerly fetching
 * all 100 historical versions. Versions are loaded lazily when the user opens
 * the versions dialog via getStopPlaceVersions.
 *
 * Dispatches SET_STOP_PLACE_LOADING so the UI shows a loading state both on
 * first load and when navigating between stops (where the old stop is still
 * present in Redux state).
 *
 * Always network-only: merge, move and detach mutations run with no-cache, so
 * a cached copy of an affected stop is stale the moment they succeed. Serving
 * it would show quays on two stops, or an expired stop as active.
 */
export const getStopPlaceWithAll =
  (id: string) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<any> => {
    dispatch(createThunk(types.SET_STOP_PLACE_LOADING, true));

    const payload = {
      query: stopPlaceWithAll,
      fetchPolicy: "network-only" as const,
      variables: { id },
      context: await getContext((getState() as any).user.auth),
    };

    return (getTiamatClient() as any)
      .query(payload)
      .then((result: any) => {
        dispatch(
          createApolloThunk(
            types.APOLLO_QUERY_RESULT,
            result,
            payload.query,
            payload.variables,
          ),
        );
        return result;
      })
      .catch((error: unknown) => {
        dispatch(createThunk(types.SET_STOP_PLACE_LOADING, false));
        throw error;
      });
  };

/**
 * Loads one group of stop places. Same as the legacy getGroupOfStopPlacesById,
 * but with the modern query, which carries each member's validity so expired
 * members can be flagged and left off the map (F-87).
 */
export const getGroupOfStopPlacesById =
  (id: string) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<any> => {
    const payload = {
      query: groupOfStopPlacesQuery,
      fetchPolicy: "network-only" as const,
      variables: { id },
      context: await getContext((getState() as any).user.auth),
    };

    const result = await (getTiamatClient() as any).query(payload);
    dispatch(
      createApolloThunk(
        types.APOLLO_QUERY_RESULT,
        result,
        payload.query,
        payload.variables,
      ),
    );
    return result;
  };

interface TopographicChip {
  type: string;
  value: string;
}

/** Numbers each search, so only the newest one's results are stored (F-05). */
let latestSearchRequest = 0;

/**
 * Search for stop places and groups. Same query as the legacy action, but a
 * slower response for an older search is ignored instead of overwriting the
 * results of a newer one. Resolves with `isLatest` so the caller can end its
 * loading state only for the newest search (F-05).
 */
export const findEntitiesWithFilters =
  (
    query: string,
    stopPlaceType: string[],
    chips: TopographicChip[],
    showFutureAndExpired: boolean,
  ) =>
  async (
    dispatch: AppDispatch,
    getState: () => RootState,
  ): Promise<{ isLatest: boolean }> => {
    const request = ++latestSearchRequest;
    const referencesOf = (type: string) =>
      chips.filter((chip) => chip.type === type).map((chip) => chip.value);
    const payload = {
      query: findStop,
      fetchPolicy: "network-only" as const,
      variables: {
        query,
        stopPlaceType,
        municipalityReference: referencesOf("municipality"),
        countyReference: referencesOf("county"),
        countryReference: referencesOf("country"),
        pointInTime: showFutureAndExpired ? null : new Date().toISOString(),
        versionValidity: showFutureAndExpired ? "MAX_VERSION" : null,
      },
      context: await getContext((getState() as any).user.auth),
    };

    const result = await (getTiamatClient() as any).query(payload);
    const isLatest = request === latestSearchRequest;
    if (isLatest) {
      dispatch(
        createApolloThunk(
          types.APOLLO_QUERY_RESULT,
          result,
          payload.query,
          payload.variables,
        ),
      );
    }
    return { isLatest };
  };

interface MapBounds {
  getSouthWest: () => { lat: number; lng: number };
  getNorthEast: () => { lat: number; lng: number };
}

/**
 * The stops in the map's bounds, except the open one. Same as the legacy
 * getNeighbourStops, but with the modern query, which names multimodal
 * children (F-48), and with the stale versions Tiamat also returns cleaned
 * out before the reducer sees them (F-85, F-92).
 */
export const getNeighbourStops =
  (
    ignoreStopPlaceId: string | undefined,
    bounds: MapBounds,
    includeExpired?: boolean,
  ) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<any> => {
    dispatch({ type: "MAP_QUERY_START" });

    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const payload = {
      fetchPolicy: "network-only" as const,
      query: neighbourStopsQuery,
      variables: {
        includeExpired,
        // Legacy sends the id as a string, "undefined" included; keep it.
        ignoreStopPlaceId: `${ignoreStopPlaceId}`,
        latMin: southWest.lat,
        latMax: northEast.lat,
        lonMin: southWest.lng,
        lonMax: northEast.lng,
      },
      context: await getContext((getState() as any).user.auth),
    };

    try {
      const response = await (getTiamatClient() as any).query(payload);
      // Apollo may freeze its result, so the cleaned list goes into a copy.
      const result = {
        ...response,
        data: {
          ...response.data,
          stopPlaceBBox: cleanBBoxResult(
            response.data?.stopPlaceBBox ?? [],
            !!includeExpired,
          ),
        },
      };
      dispatch(
        createApolloThunk(
          types.APOLLO_QUERY_RESULT,
          result,
          payload.query,
          payload.variables,
        ),
      );
      return result;
    } finally {
      dispatch({ type: "MAP_QUERY_END" });
    }
  };

export interface PurposeOfGroupingOption {
  id: string;
  name?: { value?: string };
}

/**
 * The purposes a group of stop places can have (Tiamat's code list), for the
 * group editor's required "Formål med gruppering" select. Read-only, so it
 * doesn't go through Redux.
 */
export const getPurposeOfGroupingOptions =
  () =>
  async (
    _dispatch: AppDispatch,
    getState: () => RootState,
  ): Promise<PurposeOfGroupingOption[]> => {
    const result = await (getTiamatClient() as any).query({
      query: getPurposeOfGroupingQuery,
      context: await getContext((getState() as any).user.auth),
    });
    return (result?.data?.purposeOfGrouping ?? []) as PurposeOfGroupingOption[];
  };
