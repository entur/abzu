import { createThunk } from ".";
import { getPolygons } from "./TiamatActions";
import * as types from "./Types";

const getAdministrativeZoneIds = (roles) => {
  let administrativeZoneIds = [];

  if (!roles) return [];

  roles.forEach((roleString) => {
    let roleJSON = JSON.parse(roleString);
    if (roleJSON.r === "editStops") {
      if (!!roleJSON.z) {
        administrativeZoneIds.push(roleJSON.z);
      } else {
        allowNewStopEverywhere = true;
      }
    }
  });

  return administrativeZoneIds;
};

export const fetchPolygons = () => (dispatch, getState) => {
  if (getState().roles.auth) {
    const adminZones = getAdministrativeZoneIds(
      getState().roles.auth.roleAssignments
    );

    if (adminZones.length) {
      dispatch(getPolygons(adminZones));
    }
  }
};

export const updateAuth = (auth) => (dispatch) => {
  dispatch(createThunk(types.UPDATED_AUTH, auth));
};
