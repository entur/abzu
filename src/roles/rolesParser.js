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


import PolygonManager from '../singletons/PolygonManager';
import stopTypes from '../models/stopTypes';
import { getLegalSubmodes, getLegalStopPlaceTypes } from '../reducers/rolesReducerUtils';
import { submodes as allSubmodes } from '../models/submodes';
import { Entities } from '../models/Entities';

const RoleParser = {};

const getRolesFromTokenByType = (tokenParsed, type) => {
  if (!tokenParsed || !tokenParsed.roles) return [];

  let roles = [];

  tokenParsed.roles.forEach(roleString => {
    let roleJSON = JSON.parse(roleString);
    if (roleJSON.r === type) {
      roles.push(roleJSON);
    }
  });

  return roles;
};

RoleParser.getEditStopRoles = tokenParsed => {
  return getRolesFromTokenByType(tokenParsed, 'editStops');
};

RoleParser.getDeleteStopRoles = tokenParsed => {
  return getRolesFromTokenByType(tokenParsed, 'deleteStops');
};


RoleParser.isGuest = tokenParsed => {
  return RoleParser.getEditStopRoles(tokenParsed).length === 0;
};

RoleParser.filterRolesByZoneRestriction = (roles, latLngs) => {
  if (!roles || !roles.length) return [];

  let result = [];
  let PManager = new PolygonManager();

  roles.forEach(role => {
    if (typeof role.z === 'undefined') {
      result.push(role);
    } else {

      let inside = false;

      if (isArrayOfLatLngs(latLngs)) {
        inside = latLngs.every(latlng => PManager.isPointInPolygon(latlng));
      } else {
        inside = PManager.isPointInPolygon(latLngs);
      }

      if (inside) {
        result.push(role);
      }
    }
  });
  return result;
};


RoleParser.filterByEntities = (
  roles,
  object
) => {

  if (!roles || !roles.length) return [];

  const stopPlaceRoles = roles.filter(role => {
    if (role.e && role.e.EntityType) {
      if (
        isInArrayIgnoreCase(role.e.EntityType, 'stopPlace') ||
        isInArrayIgnoreCase(role.e.EntityType, '*')
      ) {
        return role;
      }
      return false;
    }
    return false;
  });

  let validForStop = [];

  // recover entityType for object if not provided
  let entityType = object.entityType;
  if (!entityType) {
    if (object.__typename === 'ParentStopPlace' || object.__typename === 'StopPlace') {
      entityType = Entities.STOP_PLACE;
    } else {
      entityType = Entities.GROUP_OF_STOP_PLACE;
    }
  }

  if (entityType === Entities.STOP_PLACE) {

    const stopPlaceIsMultiModal =
      object.__typename === 'ParentStopPlace' || object.isParent;

    validForStop = stopPlaceRoles.filter( role => {
      if (stopPlaceIsMultiModal) {
        return object.children.every( child => doesRoleGrantAccessToStop(
          stopPlaceRoles, role.e.StopPlaceType, role.e.TransportMode, role.e.Submode, child
        ));
      } else {
        return doesRoleGrantAccessToStop(
          stopPlaceRoles, role.e.StopPlaceType, role.e.TransportMode, role.e.Submode, object
        )
      }
    });

  } else if (entityType === Entities.GROUP_OF_STOP_PLACE) {

    validForStop = stopPlaceRoles.filter( role => {
      // group of stop places without members cannot be restricted for edit
      if (!object.members || !object.members.length) return role;

      return object.members.every(member => doesRoleGrantAccessToStop(
        stopPlaceRoles, role.e.StopPlaceType, role.e.TransportMode, role.e.Submode, member
      ));
    });
  }
  return validForStop;
};

const doesRoleGrantAccessToStop = (roles, roleStopPlaceType, roleTransportMode, roleSubmode, stopPlace) => {

  const submodeOptions = getRoleOptions(roleSubmode);
  const forgiveSubmodeNotSet = false;
  const forgiveTransportmodeNotSet = false;
  const submodeValid = isModeOptionsValidForMode(submodeOptions, stopPlace.submode, forgiveSubmodeNotSet);
  const transportModeOptions = getRoleOptions(roleTransportMode);
  const transportModeValid = isModeOptionsValidForMode(
    transportModeOptions,
    stopPlace.transportMode,
    forgiveTransportmodeNotSet
  );
  const legalStopPlaceTypes = getLegalStopPlaceTypes(roles, true);
  const stopPlaceTypeValid =  legalStopPlaceTypes.indexOf(stopPlace.stopPlaceType) > -1;

  const legalSubmodes = getLegalSubmodes(roles, true);
  const isSubModeRestrictionRelevant = legalSubmodes.some( submode => getSubModeRelevance(submode, stopPlace.stopPlaceType));

  if (!stopPlace.stopPlaceType) {
    return true;
  }

  // if stopPlaceType is not defined and submode is not whitelisted
  if (!roleStopPlaceType && !submodeValid) {
    return false;
  }

  // if stopPlace is valid and listed as whitelisted
  if (stopPlaceTypeValid && legalStopPlaceTypes.indexOf(stopPlace.stopPlaceType) > -1) {

    // if submode is legal
    if (legalSubmodes.indexOf(stopPlace.submode) > -1 && stopPlace.submode) {
      return true;
    }

    if (!stopPlace.submode) {
      return true;
    }
  }

  if (!stopPlaceTypeValid && !isSubModeRestrictionRelevant) {

    if (!stopPlace.submode) {
      return false;
    }

    if (submodeValid && transportModeValid) {
      return true;
    }
  }

  if (!stopPlaceTypeValid && submodeValid) {
    return true;
  }

  if (stopPlaceTypeValid && submodeValid && transportModeValid) {
    return true;
  }

  return false;
};


export const getSubModeRelevance = (submode, stopPlaceType) => {

  if (!submode) return false;

  const stopTypeKeys = Object.keys(stopTypes);

  for (let i = 0; i < stopTypeKeys.length; i++) {
    const stopTypeKey = stopTypeKeys[i];
    const stopType = stopTypes[stopTypeKey];
    if (stopTypeKey === stopPlaceType && stopType.submodes) {
      for (let y = 0; i < stopType.submodes.length; y++) {
        const _submode = stopType.submodes[y];
        if (_submode && submode === _submode) {
          return true;
        }
      }
    }
    return false;
  };
  return false;
};

export const isInArrayIgnoreCase = (array, value) => {
  if (!array || !array.length) return false;

  if (!value) return true;

  return (
    array.map(item => item.toUpperCase()).indexOf(value.toUpperCase()) > -1
  );
};

export const isModeOptionsValidForMode = (options, mode, forgiveNotSet = true) => {
  const { blacklisted, whitelisted, allowAll } = options;

  if (allowAll) {
    return true;
  }

  if (!mode) {
    return forgiveNotSet;
  }

  if (isInArrayIgnoreCase(blacklisted, mode)) {
    return false;
  }

  if (whitelisted.length && isInArrayIgnoreCase(whitelisted, mode)) {
    return true;
  }

  if (!whitelisted.length) {
    return true;
  }

  return false;
};

export const getRoleOptions = (list, allOptions = []) => {
  let blacklisted = [];
  let whitelisted = [];
  let allowAll = false;

  if (!list || !list.length) {
    return {
      allowAll: true,
      blacklisted,
      whitelisted
    };
  }

  list.forEach(type => {
    if (type.indexOf('!') === 0) {
      blacklisted.push(type.substring(1));
    } else if (type === '*') {
      allowAll = true;
    } else {
      whitelisted.push(type);
    }
  });

  // avoid pushing new items to whitelist if this list exists and is accounted for
  const whiteListIsLocked = !!whitelisted.length;

  // add inverse of blacklist to whitelist
  if (allOptions.length) {
    allOptions.forEach( option => {
      if (!whiteListIsLocked && whitelisted.indexOf(option) === -1 && blacklisted.indexOf(option) === -1) {
        whitelisted.push(option);
      }
    });
  }

  return {
    blacklisted,
    whitelisted,
    allowAll,
    whiteListIsLocked
  };
};

export const getStopPlacesForSubmodes = legalSubmodes => {
  let result = [];

  if (!legalSubmodes || !legalSubmodes.length) return result;

  const stopTypeKeys = Object.keys(stopTypes);

  for (let i = 0; i < stopTypeKeys.length; i++) {
    const stopType = stopTypes[stopTypeKeys[i]];
    const submodes = stopType.submodes || [];
    legalSubmodes.forEach( legalSubmode => {
      if (submodes.indexOf(legalSubmode) > -1) {
        if (result.indexOf(stopTypeKeys[i]) === -1 && legalSubmode !== null) {
          result.push(stopTypeKeys[i]);
        }
      }
    });
  };
  return result;
};

export const getInverseSubmodesWhitelist = whitelist => {
  return allSubmodes.filter( submode => whitelist.indexOf(submode) === -1);
};

export const doesStopTypeAllowEdit = (stopPlaceType, submode, legalStopPlaces, legalSubmodes) => {
  if (stopPlaceType && (!legalStopPlaces || !legalStopPlaces.length)) {
    return false;
  }

  if (submode && (!legalSubmodes || !legalSubmodes.length)) {
    return false;
  }

  if (stopPlaceType && !submode) {
    return legalStopPlaces.indexOf(stopPlaceType) > -1;
  }

  if (!stopPlaceType && submode) {
    return legalSubmodes.indexOf(submode) > -1;
  }

  if (submode && stopPlaceType) {
    return (legalStopPlaces.indexOf(stopPlaceType) > -1
      && legalSubmodes.indexOf(submode) > -1);
  }

  return false;
};

const isArrayOfLatLngs = data => {
  if (!data || !Array.isArray(data)) return false;
  return (data.length && Array.isArray(data[0]));
};

export default RoleParser;
