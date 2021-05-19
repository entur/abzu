import { getPolygons } from "./TiamatActions";

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
