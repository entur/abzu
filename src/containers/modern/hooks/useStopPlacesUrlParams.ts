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

import { useEffect } from "react";
import StopPlaceActions from "../../../actions/StopPlaceActions";
import {
  getGroupOfStopPlacesById,
  getStopPlaceById,
} from "../../../actions/TiamatActions";
import formatHelpers from "../../../modelUtils/mapToClient";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getGroupOfStopPlacesIdFromURL,
  getStopPlaceIdFromURL,
  removeIdParamFromURL,
  updateURLWithId,
} from "../../../utils/URLhelpers";

/**
 * Processes URL query params on mount and when auth changes.
 * Loads a stop place or group of stop places from the URL into Redux state
 * so the map marker and search result are pre-populated on page load.
 */
export const useStopPlacesUrlParams = (): void => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: any) => state.user.auth);
  const activeSearchResult = useAppSelector(
    (state: any) => state.stopPlace.activeSearchResult,
  );
  const lastMutatedStopPlaceId = useAppSelector(
    (state: any) => state.stopPlace.lastMutatedStopPlaceId,
  );

  useEffect(() => {
    if (auth?.isLoading) return;

    const searchResultId = activeSearchResult ? activeSearchResult.id : null;
    const shouldRefreshStopPlace =
      lastMutatedStopPlaceId.length > 0 &&
      searchResultId !== null &&
      lastMutatedStopPlaceId.indexOf(searchResultId) > -1;

    const stopPlaceIdFromURL = getStopPlaceIdFromURL();
    const groupOfStopPlacesFromURL = getGroupOfStopPlacesIdFromURL();

    const stopPlaceId = shouldRefreshStopPlace
      ? searchResultId
      : stopPlaceIdFromURL;

    if (shouldRefreshStopPlace) {
      dispatch(StopPlaceActions.clearLastMutatedStopPlaceId());
    }

    if (groupOfStopPlacesFromURL) {
      (dispatch(getGroupOfStopPlacesById(groupOfStopPlacesFromURL)) as any)
        .then(({ data }: any) => {
          if (data.groupOfStopPlaces && data.groupOfStopPlaces.length) {
            const groups = formatHelpers.mapSearchResultatGroup(
              data.groupOfStopPlaces,
            );
            dispatch(StopPlaceActions.setMarkerOnMap(groups[0]));
          } else {
            removeIdParamFromURL("groupOfStopPlacesId");
          }
        })
        .catch(() => {
          removeIdParamFromURL("groupOfStopPlacesId");
        });
    } else if (stopPlaceId || (!stopPlaceId && activeSearchResult?.id)) {
      const idToLoad = stopPlaceId ?? null;

      if (!idToLoad && activeSearchResult?.id) {
        updateURLWithId("stopPlaceId", activeSearchResult.id);
        return;
      }

      if (!idToLoad) return;

      (dispatch(getStopPlaceById(idToLoad)) as any)
        .then(({ data }: any) => {
          if (data.stopPlace && data.stopPlace.length) {
            const stopPlaces = formatHelpers.mapSearchResultToStopPlaces(
              data.stopPlace,
            );
            if (stopPlaces.length) {
              dispatch(StopPlaceActions.setMarkerOnMap(stopPlaces[0]));
            } else {
              removeIdParamFromURL("stopPlaceId");
            }
          } else {
            removeIdParamFromURL("stopPlaceId");
          }
        })
        .catch(() => {
          removeIdParamFromURL("stopPlaceId");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.isAuthenticated, auth?.isLoading]);
};
