const RoleParser = {};
import PolygonManager from '../singletons/PolygonManager';
import stopTypes from '../models/stopTypes';
import { getLegalSubmodes } from '../reducers/rolesReducerUtils';

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

RoleParser.filterRolesByZoneRestriction = (roles, latlng) => {
  if (!roles || !roles.length) return [];

  let result = [];
  let PManager = new PolygonManager();

  roles.forEach(role => {
    if (typeof role.z === 'undefined') {
      result.push(role);
    } else {
      let inside = PManager.isPointInPolygon(latlng);
      if (inside) {
        result.push(role);
      }
    }
  });
  return result;
};


RoleParser.filterRolesByEntityModes = (
  roles,
  stopPlace
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
    };
  });

  const validForStop = stopPlaceRoles.filter( role => doesRoleGrantAccessToStop(
    stopPlaceRoles, role.e.StopPlaceType, role.e.TransportMode, role.e.Submode, stopPlace
  ));

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
  const stopPlaceTypeOptions = getRoleOptions(roleStopPlaceType);
  const stopPlaceTypeValid = isModeOptionsValidForMode(
    stopPlaceTypeOptions,
    stopPlace.stopPlaceType,
  );

  const legalSubmodes = getLegalSubmodes(roles);
  const isSubModeRestrictionRelevant = legalSubmodes.some( submode => getSubModeRelevance(submode, stopPlace.stopPlaceType));

  if (isSubModeRestrictionRelevant) {
    if (submodeValid && transportModeValid) {
      return true;
    }
  } else {
    if (stopPlaceTypeValid) {
      return true;
    }
  }
  return false;
};

export const getSubModeRelevance = (submode, stopPlaceType) => {

  if (!submode) return false;

  for (let i = 0; i < stopTypes.nb.length; i++) {
    const stopType = stopTypes.nb[i];
    if (stopType.value === stopPlaceType && stopType.submodes) {
      for (let y = 0; i < stopType.submodes.length; y++) {
        const _submode = stopType.submodes[y];
        if (_submode && submode === _submode.value) {
          return true;
        }
      }
    }
    return false;
  };
  return false;
};

const isInArrayIgnoreCase = (array, value) => {
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

  if (isInArrayIgnoreCase(whitelisted, mode)) {
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
    allowAll
  };
};

export default RoleParser;
