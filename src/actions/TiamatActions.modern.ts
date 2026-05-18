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
  findEntitiesWithFilters,
  findStopForReport,
  findTagByName,
  findTopographicalPlace,
  getAddStopPlaceInfo,
  getContext,
  getGroupOfStopPlacesById,
  getLocationPermissionsForCoordinates,
  getMergeInfoForStops,
  getNeighbourStopPlaceQuays,
  getNeighbourStops,
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
import { stopPlaceWithAll } from "../graphql/Tiamat/stopPlaceWithAll";
import type { AppDispatch, RootState } from "../store/store";
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
 * @param networkOnly - Force a network request even if cached data is
 * available. Pass true after any mutation (save, delete, terminate) to ensure
 * stale Apollo cache entries are bypassed. Default false uses cache-first so
 * navigating back to a recently viewed stop is instant.
 */
export const getStopPlaceWithAll =
  (id: string, networkOnly = false) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<any> => {
    dispatch(createThunk(types.SET_STOP_PLACE_LOADING, true));

    const payload = {
      query: stopPlaceWithAll,
      fetchPolicy: (networkOnly ? "network-only" : "cache-first") as
        | "network-only"
        | "cache-first",
      variables: { id },
      context: await getContext((getState() as any).user.auth),
    };

    return (getTiamatClient() as any).query(payload).then((result: any) => {
      dispatch(
        createApolloThunk(
          types.APOLLO_QUERY_RESULT,
          result,
          payload.query,
          payload.variables,
        ),
      );
      return result;
    });
  };
