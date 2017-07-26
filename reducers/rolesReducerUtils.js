import roleParser, { getModeOptions, isModeOptionsValidForMode } from '../roles/rolesParser';
import { getIn } from '../utils/';
import stopTypes, { submodes } from '../models/stopTypes';

export const getAllowanceInfoForStop = (result, tokenParsed) => {
  /* find all roles that allow editing of stop */
  let editStopRoles = roleParser.getEditStopRoles(tokenParsed);
  let latlng = getLatLngFromResult(result);
  let rolesAllowingGeo = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    latlng
  );

  const stopPlace = getStopPlace(result);

  if (!stopPlace) {
    return {
      roles: [],
      legalStopPlaceTypes: [],
      legalSubmodes: [],
      canEdit: false
    }
  }

  let stopPlaceType = stopPlace.stopPlaceType;
  let transportMode = stopPlace.transportMode;
  let submode = stopPlace.submode;
  let responsibleRoles = roleParser.filterByEntity(rolesAllowingGeo, stopPlaceType, transportMode, submode);
  let canEdit = responsibleRoles.length > 0

  let legalStopPlaceTypes = [];
  let legalSubmodes = [];

  if (canEdit) {
    legalStopPlaceTypes = getLegalStopPlaceTypes(responsibleRoles);
    legalSubmodes = getLegalSubmodes(responsibleRoles);
  }

  return {
    roles: responsibleRoles,
    legalStopPlaceTypes,
    legalSubmodes,
    canEdit
  };
};

export const getAllowInfoNewStop = (latlng, tokenParsed) => {
  let editStopRoles = roleParser.getEditStopRoles(tokenParsed);
  let rolesAllowingGeo = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    latlng
  );
  return {
    legalStopPlaceTypes: getLegalStopPlaceTypes(rolesAllowingGeo),
    legalSubmodes: getLegalSubmodes(rolesAllowingGeo),
    canEdit: true,
  }
}

export const getLegalSubmodes = roles => {
  return filterByLegalMode(roles, submodes, 'Submode');
}

const filterByLegalMode = (roles, completeList, key) => {
  let typesFoundInRoles = new Set();

  for (let i = 0; i < roles.length; i++) {
    let role = roles[i];
    if (role.e[key] && role.e[key].length) {
      for (let i = 0; i < role.e[key].length; i++) {
        let entityType = role.e[key][i];
        if (entityType === '*') {
          return completeList;
        } else {
          typesFoundInRoles.add(entityType);
        }
      }
    } else {
      return completeList;
    }
  }

  const options = getModeOptions(Array.from(typesFoundInRoles));

  return completeList.filter( entityType => isModeOptionsValidForMode(options, entityType));
}

export const getLegalStopPlaceTypes = roles => {
  let allStopTypes = stopTypes.en.map(stopType => stopType.value);
  return filterByLegalMode(roles, allStopTypes, 'StopPlaceType')
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

