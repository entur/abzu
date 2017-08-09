import roleParser, { getRoleOptions, isModeOptionsValidForMode } from '../roles/rolesParser';
import { getIn } from '../utils/';
import stopTypes, { submodes } from '../models/stopTypes';

export const getAllowanceInfoForStop = (result, tokenParsed) => {
  /* find all roles that allow editing of stop */
  const editStopRoles = roleParser.getEditStopRoles(tokenParsed);
  const deleteStopRoles = roleParser.getDeleteStopRoles(tokenParsed);
  const latlng = getLatLngFromResult(result);
  const editStopRolesGeoFiltered = roleParser.filterRolesByZoneRestriction(
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

  // retrieve all roles that allow editing a given stop
  const responsibleEditRoles = roleParser.filterRolesByEntityModes(editStopRolesGeoFiltered, stopPlace);

  // retrieve all roles that allow hard-deleting a given stop
  const responsibleDeleteRoles = roleParser.filterRolesByEntityModes(deleteStopRoles, stopPlace);

  const canEdit = responsibleEditRoles.length > 0;
  const canDeleteStop = responsibleDeleteRoles.length > 0;

  let legalStopPlaceTypes = [];
  let legalSubmodes = [];

  if (canEdit) {
    legalStopPlaceTypes = getLegalStopPlaceTypes(responsibleEditRoles);
    legalSubmodes = getLegalSubmodes(responsibleEditRoles);
  }

  return {
    roles: responsibleEditRoles,
    legalStopPlaceTypes,
    legalSubmodes,
    canEdit,
    canDeleteStop
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

  const options = getRoleOptions(Array.from(typesFoundInRoles), completeList);

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

  let finalRoles = roleParser.filterRolesByEntityModes(rolesAllowingGeo, payLoad);

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

