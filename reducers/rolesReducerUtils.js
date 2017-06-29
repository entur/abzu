import roleParser, { getModeOptions, isModeOptionsValidForMode } from '../roles/rolesParser';
import { getIn } from '../utils/';
import stopTypes from '../models/stopTypes';

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
  let canEdit = responsibleRoles.length > 0

  let legalStopPlaceTypes = [];

  if (canEdit) {
    legalStopPlaceTypes = getLegalStopPlaceTypes(responsibleRoles);
  }

  return {
    roles: responsibleRoles,
    legalStopPlaceTypes,
    canEdit
  };
};


export const getLegalStopPlaceTypes = roles => {

  let allStopTypes = stopTypes.en.map(stopType => stopType.value);
  let typesFoundInRoles = new Set();

  for (let i = 0; i < roles.length; i++) {
    let role = roles[i];
    if (role.e.StopPlaceType && role.e.StopPlaceType.length) {
      for (let i = 0; i < role.e.StopPlaceType.length; i++) {
        let stopPlaceType = role.e.StopPlaceType[i];
        if (stopPlaceType === '*') {
          return allStopTypes;
        } else {
          typesFoundInRoles.add(stopPlaceType);
        }
      }
    } else {
      return allStopTypes;
    }
  }

  const options = getModeOptions(Array.from(typesFoundInRoles));

  return allStopTypes.filter( stopPlaceType => isModeOptionsValidForMode(options, stopPlaceType));
}

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

