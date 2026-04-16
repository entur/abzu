/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { StopPlaceActions, UserActions } from "../../../actions";
import { getStopPlaceById } from "../../../actions/TiamatActions";
import formatHelpers from "../../../modelUtils/mapToClient";
import Routes from "../../../routes";

/**
 * Shared hook for navigating to a stop place with loading feedback.
 * Matches the fetch-then-navigate pattern used by search and favorites.
 * Loading is dismissed when state.stopPlace.current.id matches the pending
 * navigation target — the same moment the map flyTo fires and the panel updates.
 */
export const useNavigateToStopPlace = () => {
  const dispatch = useDispatch() as any;
  const [loading, setLoading] = useState(false);
  const [loadingName, setLoadingName] = useState("");
  const [pendingNavigationId, setPendingNavigationId] = useState<string | null>(
    null,
  );

  const currentStopId = useSelector(
    (state: any) => (state.stopPlace as any)?.current?.id as string | undefined,
  );

  useEffect(() => {
    if (pendingNavigationId && currentStopId === pendingNavigationId) {
      setLoading(false);
      setLoadingName("");
      setPendingNavigationId(null);
    }
  }, [currentStopId, pendingNavigationId]);

  const navigateTo = useCallback(
    (id: string, name: string) => {
      flushSync(() => {
        setLoading(true);
        setLoadingName(name);
      });

      dispatch(getStopPlaceById(id))
        .then(({ data }: any) => {
          if (data?.stopPlace?.length) {
            const stopPlaces = formatHelpers.mapSearchResultToStopPlaces(
              data.stopPlace,
            );
            if (stopPlaces.length) {
              dispatch(StopPlaceActions.setMarkerOnMap(stopPlaces[0]));
            }
          }
          dispatch(UserActions.navigateTo(`/${Routes.STOP_PLACE}/`, id));
          setPendingNavigationId(id);
        })
        .catch(() => {
          setLoading(false);
          setLoadingName("");
          setPendingNavigationId(null);
        });
    },
    [dispatch],
  );

  return { loading, loadingName, navigateTo };
};
