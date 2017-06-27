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

RoleParser.filterByEntityRestriction = (
  roles,
  stopPlaceType,
  transportMode,
  submode
) => {
  if (!roles || !roles.length) return [];

  let result = [];

  roles.forEach(role => {
    if (typeof role.e === 'undefined') {
      result.push(role);
    } else {
      if (role.e.StopPlace) {
        let stopTypes = role.e.StopPlace.map(r => r.toLowerCase());

        if (
          stopTypes.indexOf(stopPlaceType.toLowerCase()) > -1 ||
          stopTypes.indexOf('*') > -1
        ) {
          result.push(role);
        }
      } else {
        result.push(role);
      }
    }
  });
  return result;
};

export default RoleParser;
