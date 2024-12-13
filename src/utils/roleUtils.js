import { submodes as allSubmodes } from "../models/submodes";

export const isLegalChildStopPlace = (
  stopPlace,
  roleAssignments,
  fetchedPolygons,
  allowNewStopEverywhere,
) => {
  if (!stopPlace) {
    return false;
  }

  const editStopRoles = getEditStopRoles(roleAssignments);
  const editStopRolesGeoFiltered = filterRolesByZoneRestriction(
    editStopRoles,
    stopPlace.location,
    fetchedPolygons,
    allowNewStopEverywhere,
  );
  const responsibleEditRoles = filterByEntities(
    editStopRolesGeoFiltered,
    stopPlace,
  );
  const isLegal = responsibleEditRoles.length > 0;
  return isLegal;
};

const getEditStopRoles = (roleAssignments) => {
  return getRolesFromTokenByType(roleAssignments, "editStops");
};

const filterRolesByZoneRestriction = (
  roles,
  latLngs,
  fetchedPolygons,
  allowNewStopEverywhere,
) => {
  if (!roles || !roles.length) return [];

  let result = [];

  roles.forEach((role) => {
    if (typeof role.z === "undefined") {
      result.push(role);
    } else {
      let inside = false;

      if (isArrayOfLatLngs(latLngs)) {
        inside = latLngs.every((latlng) =>
          isPointInPolygon(latlng, fetchedPolygons, allowNewStopEverywhere),
        );
      } else {
        inside = isPointInPolygon(
          latLngs,
          fetchedPolygons,
          allowNewStopEverywhere,
        );
      }

      if (inside) {
        result.push(role);
      }
    }
  });
  return result;
};

const filterByEntities = (roles, object) => {
  if (!roles || !roles.length) return [];

  const stopPlaceRoles = roles.filter((role) => {
    if (role.e && role.e.EntityType) {
      if (
        isInArrayIgnoreCase(role.e.EntityType, "stopPlace") ||
        isInArrayIgnoreCase(role.e.EntityType, "*")
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
    if (
      object.__typename === "ParentStopPlace" ||
      object.__typename === "StopPlace"
    ) {
      entityType = Entities.STOP_PLACE;
    } else {
      entityType = Entities.GROUP_OF_STOP_PLACE;
    }
  }

  if (entityType === Entities.STOP_PLACE) {
    const stopPlaceIsMultiModal =
      object.__typename === "ParentStopPlace" || object.isParent;

    validForStop = stopPlaceRoles.filter((role) => {
      if (stopPlaceIsMultiModal) {
        return object.children.every((child) =>
          doesRoleGrantAccessToStop(
            stopPlaceRoles,
            role.e.StopPlaceType,
            role.e.TransportMode,
            role.e.Submode,
            child,
          ),
        );
      } else {
        return doesRoleGrantAccessToStop(
          stopPlaceRoles,
          role.e.StopPlaceType,
          role.e.TransportMode,
          role.e.Submode,
          object,
        );
      }
    });
  } else if (entityType === Entities.GROUP_OF_STOP_PLACE) {
    validForStop = stopPlaceRoles.filter((role) => {
      // group of stop places without members cannot be restricted for edit
      if (!object.members || !object.members.length) return role;

      return object.members.every((member) =>
        doesRoleGrantAccessToStop(
          stopPlaceRoles,
          role.e.StopPlaceType,
          role.e.TransportMode,
          role.e.Submode,
          member,
        ),
      );
    });
  }
  return validForStop;
};

const doesRoleGrantAccessToStop = (
  roles,
  roleStopPlaceType,
  roleTransportMode,
  roleSubmode,
  stopPlace,
) => {
  const submodeOptions = getRoleOptions(roleSubmode);
  const forgiveSubmodeNotSet = false;
  const forgiveTransportmodeNotSet = false;
  const submodeValid = isModeOptionsValidForMode(
    submodeOptions,
    stopPlace.submode,
    forgiveSubmodeNotSet,
  );
  const transportModeOptions = getRoleOptions(roleTransportMode);
  const transportModeValid = isModeOptionsValidForMode(
    transportModeOptions,
    stopPlace.transportMode,
    forgiveTransportmodeNotSet,
  );
  const legalStopPlaceTypes = getLegalStopPlaceTypes(roles, true);
  const stopPlaceTypeValid =
    legalStopPlaceTypes.indexOf(stopPlace.stopPlaceType) > -1;

  const legalSubmodes = getLegalSubmodes(roles, true);
  const isSubModeRestrictionRelevant = legalSubmodes.some((submode) =>
    getSubModeRelevance(submode, stopPlace.stopPlaceType),
  );

  if (!stopPlace.stopPlaceType) {
    return true;
  }

  // if stopPlaceType is not defined and submode is not whitelisted
  if (!roleStopPlaceType && !submodeValid) {
    return false;
  }

  // if stopPlace is valid and listed as whitelisted
  if (
    stopPlaceTypeValid &&
    legalStopPlaceTypes.indexOf(stopPlace.stopPlaceType) > -1
  ) {
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

const getRolesFromTokenByType = (roleAssignments, type) => {
  if (!roleAssignments) return [];

  let roles = [];

  roleAssignments.forEach((roleString) => {
    let roleJSON = JSON.parse(roleString);
    if (roleJSON.r === type) {
      roles.push(roleJSON);
    }
  });

  return roles;
};
export const getStopPlacesForSubmodes = (legalSubmodes) => {
  let result = [];

  if (!legalSubmodes || !legalSubmodes.length) return result;

  const stopTypeKeys = Object.keys(stopTypes);

  for (let i = 0; i < stopTypeKeys.length; i++) {
    const stopType = stopTypes[stopTypeKeys[i]];
    const submodes = stopType.submodes || [];
    legalSubmodes.forEach((legalSubmode) => {
      if (submodes.indexOf(legalSubmode) > -1) {
        if (result.indexOf(stopTypeKeys[i]) === -1 && legalSubmode !== null) {
          result.push(stopTypeKeys[i]);
        }
      }
    });
  }
  return result;
};

export const getInverseSubmodesWhitelist = (whitelist) => {
  return allSubmodes.filter((submode) => whitelist.indexOf(submode) === -1);
};
