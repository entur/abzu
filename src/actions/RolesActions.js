import { getPolygons } from "./TiamatActions";

const getAdministrativeZoneIds = (tokenParsed) => {
  let administrativeZoneIds = [];

  if (!tokenParsed || !tokenParsed.roles) return [];

  tokenParsed.roles.forEach((roleString) => {
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
  const adminZones = getAdministrativeZoneIds(getState().roles.kc.tokenParsed);

  if (adminZones.length) {
    dispatch(getPolygons(adminZones));
  }
};
