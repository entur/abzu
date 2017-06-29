const RoleParser = {};
import PolygonManager from '../singletons/PolygonManager';

RoleParser.getEditStopRoles = tokenParsed => {
  if (!tokenParsed || !tokenParsed.roles) return [];

  let roles = [];

  tokenParsed.roles.forEach(roleString => {
    let roleJSON = JSON.parse(roleString);
    if (roleJSON.r === 'editStops') {
      roles.push(roleJSON);
    }
  });

  return roles;
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


RoleParser.filterByEntity = (roles, stopPlaceType, transportMode, submode, stopPlace) => {

  console.info(stopPlaceType);
  console.info(transportMode);
  console.info(submode);
  console.info("stopPlace", stopPlace);

  if (!roles || !roles.length) return [];

  let result = [];

  roles.forEach(role => {
    if (role.e.EntityType) {
      if (isInArrayIgnoreCase(role.e.EntityType, 'stopPlace')) {
        let stopPlaceTypeOptions = getModeOptions(role.e.StopPlaceType);
        let transportModeOptions = getModeOptions(role.e.TransportMode);
        let submodeOptions = getModeOptions(role.e.Submode);

        let a = isModeOptionsValidForMode(stopPlaceTypeOptions, stopPlaceType)
        let b = isModeOptionsValidForMode(transportModeOptions, transportMode)
        let c = isModeOptionsValidForMode(submodeOptions, submode)

        console.log("isModeOptions", a, b,c, submodeOptions)

        if (a && b && c
        ) {
          result.push(role);
        }
      }
    }
  });
  return result;
};

const areEqual = (a, b) => a.toUpperCase() === b.toUpperCase();

const isInArrayIgnoreCase = (array, value) => {
  if (!array || !array.length) return false;

  if (!value) return true;

  return (
    array.map(item => item.toUpperCase()).indexOf(value.toUpperCase()) > -1
  );
};

const isModeOptionsValidForMode = (options, mode) => {
  const { blacklisted, whitelisted, allowAll } = options;

  if (allowAll || !mode) {
    return true;
  }

  if (isInArrayIgnoreCase(whitelisted, mode)) {
    return true;
  }

  if (!isInArrayIgnoreCase(blacklisted, mode)) {
    return true;
  }

  return false;
};

const getModeOptions = list => {
  let blacklisted = [];
  let whitelisted = [];
  let allowAll = false;

  // If stopPlaceTypes are not specified, allow all
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

  return {
    blacklisted,
    whitelisted,
    allowAll
  };
};

export default RoleParser;
