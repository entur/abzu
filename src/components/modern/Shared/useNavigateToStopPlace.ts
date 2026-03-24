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

import { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { useDispatch } from "react-redux";
import { StopPlaceActions, UserActions } from "../../../actions";
import { getStopPlaceById } from "../../../actions/TiamatActions";
import formatHelpers from "../../../modelUtils/mapToClient";
import Routes from "../../../routes";

/**
 * Shared hook for navigating to a stop place with loading feedback.
 * Matches the fetch-then-navigate pattern used by search and favorites,
 * so the user always sees a LoadingDialog before the panel switches.
 */
export const useNavigateToStopPlace = () => {
  const dispatch = useDispatch() as any;
  const [loading, setLoading] = useState(false);
  const [loadingName, setLoadingName] = useState("");

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
          // Loading stays true — component unmounts when the new panel renders,
          // which is the correct moment for the dialog to disappear.
        })
        .catch(() => {
          setLoading(false);
          setLoadingName("");
        });
    },
    [dispatch],
  );

  return { loading, loadingName, navigateTo };
};
