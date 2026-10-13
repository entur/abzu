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
 * Modern counterparts of StopPlaceActions that must behave differently from
 * legacy. Everything else is used straight from StopPlaceActions.
 */

import { createThunk } from ".";
import { Entities } from "../models/Entities";
import type { AppDispatch } from "../store/store";
import { replaceQueryParam } from "../utils/historyEntryParams";
import { getLocationPermissionsForCoordinates } from "./TiamatActions";
import * as types from "./Types";

const URL_PARAM_BY_ENTITY: Record<string, string> = {
  [Entities.STOP_PLACE]: "stopPlaceId",
  [Entities.GROUP_OF_STOP_PLACE]: "groupOfStopPlacesId",
};

interface MarkerData {
  id: string;
  entityType: string;
  location?: [number, number];
}

/**
 * Same as StopPlaceActions.setMarkerOnMap, except the id goes into the
 * current URL instead of a new history entry (see replaceQueryParam), so the
 * unsaved-changes guard can block "back" reliably.
 */
export const setMarkerOnMap =
  <Marker extends MarkerData>(data: Marker) =>
  (dispatch: AppDispatch): void => {
    dispatch(createThunk(types.SET_ACTIVE_MARKER, { ...data, isActive: true }));

    const { location } = data;
    if (location) {
      dispatch(
        getLocationPermissionsForCoordinates(location[1], location[0]) as any,
      );
    }

    const urlParam = URL_PARAM_BY_ENTITY[data.entityType];
    if (urlParam) replaceQueryParam(urlParam, data.id);
  };
