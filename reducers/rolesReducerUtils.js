import roleParser from '../roles/rolesParser';
import { getIn } from '../utils/';

export const getAllowanceInfo = (result, tokenParsed) => {
  /* find all roles that allow editing of stop */
  let editStopRoles = roleParser.getEditStopRoles(tokenParsed);
  let latlng = getLatLngFromResult(result);
  let rolesAllowingGeo = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    latlng
  );

  const stopPlace = getStopPlace(result);

  let stopPlaceType = stopPlace.stopPlaceType;
  let transportMode = stopPlace.transportMode;
  let submode = stopPlace.submode;
  let responsibleRoles = roleParser.filterByEntity(rolesAllowingGeo, stopPlaceType, transportMode, submode);

  return {
    roles: responsibleRoles,
    canEdit: responsibleRoles.length > 0
  };
};

export const getAllowanceSearchInfo = (payLoad, tokenParsed) => {
  let editStopRoles = roleParser.getEditStopRoles(tokenParsed);
  let latlng = payLoad.location;
  let rolesAllowingGeo = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    latlng
  );

  let stopPlaceType = payLoad.stopPlaceType;
  let transportMode = payLoad.transportMode;
  let submode = payLoad.submode;

  let finalRoles = roleParser.filterByEntity(rolesAllowingGeo, stopPlaceType, transportMode, submode);

  return {
    roles: finalRoles,
    canEdit: finalRoles.length > 0
  };
}

export const getLatLngFromResult = result => {

  let stopPlace = getStopPlace(result);

  if (!stopPlace) {
    return null;
  }

  let lngLat = getIn(stopPlace, ['geometry', 'coordinates'], null);

  if (!lngLat || !lngLat.length) return null;

  let latLng = lngLat[0].slice().reverse();

  return latLng;
};

export const getStopPlace = result => {

  if (!result || !result.data || !result.data.stopPlace) {
    return null;
  }

  if (!result.data.stopPlace.length) {
    return null;
  }

  let stopPlace = result.data.stopPlace[0];

  if (stopPlace) {
    return JSON.parse(JSON.stringify(stopPlace));
  }

  return null;
}

