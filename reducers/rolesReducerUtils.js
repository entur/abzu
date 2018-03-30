/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


import roleParser, { getRoleOptions, isModeOptionsValidForMode, isInArrayIgnoreCase } from '../roles/rolesParser';
import { getIn } from '../utils/';
import stopTypes, { submodes } from '../models/stopTypes';
import { Entities } from '../models/Entities';

export const getAllowanceInfoForStop = (result, tokenParsed) => {
  /* find all roles that allow editing of stop */
  const token = { ... tokenParsed };
  const editStopRoles = roleParser.getEditStopRoles(token);
  const deleteStopRoles = roleParser.getDeleteStopRoles(token);
  const stopPlace = getStopPlace(result);
  const latlng = getLatLng(stopPlace);
  const editStopRolesGeoFiltered = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    latlng
  );

  if (!stopPlace) {
    return {
      roles: [],
      legalStopPlaceTypes: [],
      legalSubmodes: [],
      canEdit: false
    }
  }

  // retrieve all roles that allow editing a given stop
  const responsibleEditRoles = roleParser.filterByEntities(editStopRolesGeoFiltered, stopPlace);

  // retrieve all roles that allow hard-deleting a given stop
  const responsibleDeleteRoles = roleParser.filterByEntities(deleteStopRoles, stopPlace);

  const canEdit = responsibleEditRoles.length > 0;
  const canDeleteStop = responsibleDeleteRoles.length > 0;

  let legalStopPlaceTypes = [];
  let legalSubmodes = [];

  const stopPlaceTypesFoundinRoles = getLegalStopPlaceTypes(editStopRolesGeoFiltered);
  const submodesFoundinRoles = getLegalSubmodes(editStopRolesGeoFiltered, true);

  if (canEdit) {
    legalStopPlaceTypes = restrictModeByRoles(editStopRolesGeoFiltered, stopPlaceTypesFoundinRoles, 'StopPlaceType');
    legalSubmodes = submodesFoundinRoles;
  }

  return {
    roles: responsibleEditRoles,
    legalStopPlaceTypes,
    legalSubmodes,
    blacklistedStopPlaceTypes: getBlacklistedStopPlaceTypes(responsibleEditRoles),
    canEdit,
    canDeleteStop
  };
};

export const getAllowanceInfoForGroup = (result, tokenParsed) => {
  /* find all roles that allow editing of group of stop places */
  const token = { ... tokenParsed };
  const editStopRoles = roleParser.getEditStopRoles(token);
  const deleteStopRoles = roleParser.getDeleteStopRoles(token);
  const groupOfStopPlaces = getGroupOfStopPlaces(result);
  const latlngs = getLatLngFromMembers(groupOfStopPlaces);

  const editStopRolesGeoFiltered = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    latlngs
  );

  if (!groupOfStopPlaces) {
    return {
      roles: [],
      legalStopPlaceTypes: [],
      legalSubmodes: [],
      canEdit: false,
      canDeleteStop: false,
    }
  }

  // retrieve all roles that allow editing a given stop
  const responsibleEditRoles = roleParser.filterByEntities(editStopRolesGeoFiltered, groupOfStopPlaces);

  // retrieve all roles that allow hard-deleting a given stop
  const responsibleDeleteRoles = roleParser.filterByEntities(deleteStopRoles, groupOfStopPlaces);

  const canEdit = responsibleEditRoles.length > 0;
  const canDeleteStop = responsibleDeleteRoles.length > 0;

  let legalStopPlaceTypes = [];
  let legalSubmodes = [];

  const stopPlaceTypesFoundinRoles = getLegalStopPlaceTypes(editStopRolesGeoFiltered);
  const submodesFoundinRoles = getLegalSubmodes(editStopRolesGeoFiltered, true);

  if (canEdit) {
    legalStopPlaceTypes = restrictModeByRoles(editStopRolesGeoFiltered, stopPlaceTypesFoundinRoles, 'StopPlaceType');
    legalSubmodes = submodesFoundinRoles;
  }

  return {
    roles: responsibleEditRoles,
    legalStopPlaceTypes,
    legalSubmodes,
    blacklistedStopPlaceTypes: getBlacklistedStopPlaceTypes(responsibleEditRoles),
    canEdit,
    canDeleteStop
  };
};

export const isLegalChildStopPlace = (stopPlace, tokenParsed) => {

  if (!stopPlace) {
    return false
  }

  const token = { ... tokenParsed };
  const editStopRoles = roleParser.getEditStopRoles(token);
  const editStopRolesGeoFiltered = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    stopPlace.location
  );
  const responsibleEditRoles = roleParser.filterByEntities(editStopRolesGeoFiltered, stopPlace);
  const isLegal = responsibleEditRoles.length > 0;
  return isLegal;
};

const restrictModeByRoles = (roles, modes, entityType) => {

  let foundEditStops = false;
  let result = new Set();
  let blacklistedSet = new Set();

  roles.forEach(role => {

    if (role.r === 'editStops') {
      foundEditStops = true;
    }

    if (role.e && role.e[entityType] && role.e[entityType].length) {
      modes.forEach( mode => {

        (role.e[entityType] || []).forEach( roleMode => {

          const isBlacklisted = roleMode.indexOf('!') > -1;

          // only add if whitelisted or whitelisted
          if (!isBlacklisted && roleMode === mode || roleMode === '*') {
            result.add(mode);
          } else {
            const blacklistedEntity = roleMode.substring(1);
            blacklistedSet.add(blacklistedEntity);
          }
        })
      });
    }
  });

  if (foundEditStops) {

    // add all other as withlisted for entities that are blacklisted
    Array.from(blacklistedSet).forEach( b => {
      modes.forEach( m => {
        if (b !== m) {
          result.add(m);
        }
      });
    });

    // cleanup by removing all blacklisted
    Array.from(blacklistedSet).forEach( b => {
      result.delete(b);
    });

    return Array.from(result);
  }

  return [];
};

export const getAllowanceInfoFromPosition = (latlng, tokenParsed) => {
  const token = { ... tokenParsed };
  let editStopRoles = roleParser.getEditStopRoles(token);
  let deleteRoles = roleParser.getDeleteStopRoles(token);
  let rolesAllowingGeo = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    latlng
  );
  return {
    legalStopPlaceTypes: getLegalStopPlaceTypes(rolesAllowingGeo),
    legalSubmodes: getLegalSubmodes(rolesAllowingGeo),
    canEdit: rolesAllowingGeo.length > 0,
    canDeleteStop: deleteRoles.length > 0
  }
};


export const getLegalSubmodes = (roles, restrict = false) => {
  return filterByLegalMode(roles, submodes, 'Submode', restrict);
};

const filterByLegalMode = (roles, completeList, key, restrict = false) => {
  const typesFoundInRoles = new Set();
  const blacklisted = new Set();

  for (let i = 0; i < roles.length; i++) {
    let role = roles[i];
    if (role.e[key] && role.e[key].length) {
      for (let i = 0; i < role.e[key].length; i++) {
        let entityType = role.e[key][i];
        if (entityType === '*') {
          return completeList;
        } else {

          if (entityType.indexOf('!') > -1 ) {
            const blacklistedEntity = entityType.substring(1);
            completeList.forEach( item => {
              if (item !== blacklistedEntity) {
                typesFoundInRoles.add(item);
              }
            });
            blacklisted.add(blacklistedEntity);
          } else {
            typesFoundInRoles.add(entityType);
          }
        }
      }
    }
  }

  const whitelistedRoles = Array.from(typesFoundInRoles).filter( role => {
    return !(blacklisted.has(role))
  });

  const options = getRoleOptions(Array.from(whitelistedRoles), completeList);

  if (restrict) {
    return Array.from(whitelistedRoles);
  }

  return completeList.filter( entityType => isModeOptionsValidForMode(options, entityType));
};


export const getLegalStopPlaceTypes = roles => {
  let allStopTypes = stopTypes.en.map(stopType => stopType.value);
  return filterByLegalMode(roles, allStopTypes, 'StopPlaceType')
}

const getBlacklistedStopPlaceTypes = roles => {

  const blacklistSet = new Set();

  const stopPlaceRoles = roles.map(role => {
    if (role.e && role.e.EntityType) {
      if (
        isInArrayIgnoreCase(role.e.EntityType, 'stopPlace') ||
        isInArrayIgnoreCase(role.e.EntityType, '*')
      ) {
        return getRoleOptions(role.e.StopPlaceType);
      }
    };
  });

  stopPlaceRoles.forEach( role => {
    role.blacklisted.forEach( b => {
      if (b) {
        blacklistSet.add(b);
      }
    })
  });

  return Array.from(blacklistSet);
};

export const getAllowanceSearchInfo = (payLoad, tokenParsed) => {
  const token = { ... tokenParsed };
  let editStopRoles = roleParser.getEditStopRoles(token);
  let latlng = payLoad.entityType === Entities.GROUP_OF_STOP_PLACE
      ? payLoad.members.map(member => member.location)
      : payLoad.location;

  let rolesAllowingGeo = roleParser.filterRolesByZoneRestriction(
    editStopRoles,
    latlng
  );

  let finalRoles = roleParser.filterByEntities(rolesAllowingGeo, payLoad);

  return {
    roles: finalRoles,
    canEdit: finalRoles.length > 0
  };
}

export const getLatLng = entity => {
  let lngLat = getIn(entity, ['geometry', 'coordinates'], null);

  if (!lngLat || !lngLat.length) return null;

  return lngLat[0].slice().reverse();
};

export const getLatLngFromMembers = groupOfStopPlaces => {
  if (!groupOfStopPlaces || !groupOfStopPlaces.members || !groupOfStopPlaces.members.length) {
    return null;
  }
  return groupOfStopPlaces.members.map(member => getLatLng(member));
}

export const getStopPlace = result => {

  if (!result || !result.data || !result.data.stopPlace || !result.data.stopPlace.length) {
    return null;
  }

  let stopPlace = result.data.stopPlace[0];

  if (stopPlace) {
    return JSON.parse(JSON.stringify(stopPlace));
  }

  return null;
};

export const getGroupOfStopPlaces = result => {

  if (!result || !result.data || !result.data.groupOfStopPlaces || !result.data.groupOfStopPlaces.length) {
    return null;
  }

  let groupOfStopPlaces = result.data.groupOfStopPlaces[0];

  if (groupOfStopPlaces) {
    return JSON.parse(JSON.stringify(groupOfStopPlaces));
  }

  return null;
};