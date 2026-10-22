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
import { getAllowanceInfoFromLocationPermissions } from "../utils/permissionsUtils";
import { getLocationPermissionsForCoordinates } from "./TiamatActions";
import * as types from "./Types";

/** `[lat, lng]`, the order Redux stores positions in. */
type Position = [number, number];

/** Which element of the open stop a position change is for. */
export interface ElementPositionOwner {
  markerIndex: number;
  type: "quay" | "parking" | "boarding-position";
  quayIndex?: number;
}

interface LocationPermissionsResult {
  data?: { locationPermissions?: Record<string, unknown> | null };
}

const fetchLocationPermissions = async (
  dispatch: AppDispatch,
  [lat, lng]: Position,
): Promise<Record<string, unknown> | null> => {
  // Read this call's own answer: `user.locationPermissions` is one global
  // slot that any other permissions call can overwrite in the meantime.
  const result = (await dispatch(
    getLocationPermissionsForCoordinates(lng, lat) as any,
  )) as LocationPermissionsResult;
  return result?.data?.locationPermissions ?? null;
};

/** Whether the user may edit at a position (their edit area, F-106). */
export const fetchCanEditAt =
  (position: Position) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const permissions = await fetchLocationPermissions(dispatch, position);
    return !!getAllowanceInfoFromLocationPermissions(permissions).canEdit;
  };

/**
 * Moves the open stop, but only inside the user's edit area. Legacy's
 * changeCurrentStopPosition stores the new position's permissions whatever
 * they are, so dragging over the border locked the whole editor, Discard
 * included (F-106). A refused move changes nothing and resolves to false.
 */
export const moveStopIfAllowed =
  (position: Position) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const permissions = await fetchLocationPermissions(dispatch, position);
    if (!getAllowanceInfoFromLocationPermissions(permissions).canEdit) {
      return false;
    }
    dispatch(
      createThunk(types.CHANGED_ACTIVE_STOP_POSITION, {
        location: position,
        locationPermissions: permissions,
      }),
    );
    return true;
  };

/**
 * Moves a quay, parking or boarding position, but only inside the user's edit
 * area. Tiamat checks only the stop's own position on save (F-107), so this
 * is the only guard there is for the elements.
 */
export const moveElementIfAllowed =
  (owner: ElementPositionOwner, position: Position) =>
  async (dispatch: AppDispatch): Promise<boolean> => {
    const canEdit = await dispatch(fetchCanEditAt(position));
    if (!canEdit) return false;
    dispatch(
      createThunk(types.CHANGE_ELEMENT_POSITION, { ...owner, position }),
    );
    return true;
  };

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
