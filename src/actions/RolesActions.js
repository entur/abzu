import { createThunk } from ".";
import {
  getUserPermissions,
  getLocationPermissionsForCoordinates,
} from "./TiamatActions";
import * as types from "./Types";

const getAdministrativeZoneIds = (roles) => {
  const administrativeZoneIds = [];
  let allowNewStopEverywhere = roles.allowNewStopEverywhere;

  if (!roles.auth.roleAssignments)
    return [administrativeZoneIds, allowNewStopEverywhere];

  roles.auth.roleAssignments.forEach((roleString) => {
    const roleJSON = JSON.parse(roleString);

    if (roleJSON.r === "editStops") {
      if (!!roleJSON.z) {
        administrativeZoneIds.push(roleJSON.z);
      } else {
        allowNewStopEverywhere = true;
      }
    }
  });

  return [administrativeZoneIds, allowNewStopEverywhere];
};

export const updateAllowNewStopsEverywhere =
  (allowNewStopEverywhere) => (dispatch) => {
    dispatch(
      createThunk(
        types.UPDATED_ALLOW_NEW_STOPS_EVERYWHERE,
        allowNewStopEverywhere,
      ),
    );
  };

export const updateAuth = (auth) => (dispatch) => {
  dispatch(createThunk(types.UPDATED_AUTH, auth));
};

export const fetchUserPermissions = () => (dispatch, getState) => {
  dispatch(getUserPermissions());
};

export const fetchLocationPermissions = (position) => (dispatch) => {
  dispatch(getLocationPermissionsForCoordinates(position[1], position[0]));
};
