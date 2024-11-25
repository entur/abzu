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

import {
  getRoleOptions,
  isModeOptionsValidForMode,
} from "../roles/rolesParser";
import { getIn } from "../utils/";
import stopTypes, { submodes } from "../models/stopTypes";

export const reduceFetchedPolygons = (result) => {
  return Object.keys(result.data).reduce((fetchedPolygons, key) => {
    let resultItem = result.data[key][0];

    if (resultItem) {
      fetchedPolygons[resultItem.id] = resultItem.polygon
        ? resultItem.polygon.legacyCoordinates
        : [[]];
    }

    return fetchedPolygons;
  }, {});
};

export const getAllowanceInfoForStop = ({ result, variables }) => {
  const requestedStopPlaceId = variables.id;
  const stopPlace = getStopPlace(result);

  if (!stopPlace) {
    return {
      legalStopPlaceTypes: [],
      legalSubmodes: [],
      canEdit: false,
    };
  }

  let allowanceInfoForStopPlace;

  if (stopPlace.id !== requestedStopPlaceId) {
    // Requested stop place ID seems to be a child
    const childStopPlace = getStopPlace(result, requestedStopPlaceId);
    allowanceInfoForStopPlace = buildAllowanceInfoForStopPlace(childStopPlace);

    // Check if the user is authorized to edit the parent stop place.
    // It should be possible to edit a child of a multimodal stop place, of only authorized to edit that child.
    // But it shall not be possible to set the termination date for the parent stop.
    const allowanceInfoForParentStop =
      buildAllowanceInfoForStopPlace(stopPlace);
    allowanceInfoForStopPlace.canEditParentStop =
      allowanceInfoForParentStop.canEdit;
  } else {
    allowanceInfoForStopPlace = buildAllowanceInfoForStopPlace(stopPlace);
  }
  return allowanceInfoForStopPlace;
};

const buildAllowanceInfoForStopPlace = (stopPlace) => {
  const canEdit = stopPlace.permissions.canEdit;
  const canDeleteStop = stopPlace.permissions.canDelete;

  let legalStopPlaceTypes = getLegalStopPlaceTypesForStopPlace(stopPlace);
  let legalSubmodes = getLegalSubmodesForStopPlace(stopPlace);

  return {
    legalStopPlaceTypes,
    legalSubmodes,
    blacklistedStopPlaceTypes: stopPlace.permissions.bannedStopPlaceTypes,
    canEdit,
    canDeleteStop,
  };
};

export const getAllowanceInfoForGroup = ({ result }) => {
  const groupOfStopPlaces = getGroupOfStopPlaces(result);

  if (!groupOfStopPlaces) {
    return {
      legalStopPlaceTypes: [],
      legalSubmodes: [],
      canEdit: false,
      canDeleteStop: false,
    };
  }

  const canEdit = groupOfStopPlaces.permissions.canEdit;
  const canDeleteStop = groupOfStopPlaces.permissions.canDelete;

  let legalStopPlaceTypes =
    getLegalStopPlaceTypesForStopPlace(groupOfStopPlaces);
  let legalSubmodes = getLegalSubmodesForStopPlace(groupOfStopPlaces);

  return {
    legalStopPlaceTypes,
    legalSubmodes,
    blacklistedStopPlaceTypes:
      groupOfStopPlaces.permissions.bannedStopPlaceTypes,
    canEdit,
    canDeleteStop,
  };
};

export const getAllowanceInfoFromLocationPermissions = (
  locationPermissions,
) => {
  return {
    canEdit: locationPermissions.canEdit,
    canDelete: locationPermissions.canDelete,
    legalStopPlaceTypes: locationPermissions.allowedStopPlaceTypes,
    legalSubmodes: locationPermissions.allowedSubmodes,
  };
};

export const getLegalSubmodes = (roles, restrict = false) => {
  return filterByLegalMode(roles, submodes, "Submode", restrict);
};

const filterByLegalMode = (roles, completeList, key, restrict = false) => {
  const typesFoundInRoles = new Set();
  const blacklisted = new Set();

  for (let i = 0; i < roles.length; i++) {
    let role = roles[i];
    if (role.e[key] && role.e[key].length) {
      for (let i = 0; i < role.e[key].length; i++) {
        let entityType = role.e[key][i];
        if (entityType === "*") {
          return completeList;
        } else {
          if (entityType.indexOf("!") > -1) {
            const blacklistedEntity = entityType.substring(1);
            completeList.forEach((item) => {
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

  const whitelistedRoles = Array.from(typesFoundInRoles).filter((role) => {
    return !blacklisted.has(role);
  });

  const options = getRoleOptions(Array.from(whitelistedRoles), completeList);

  if (restrict) {
    return Array.from(whitelistedRoles);
  }

  return completeList.filter((entityType) =>
    isModeOptionsValidForMode(options, entityType),
  );
};

export const getLegalStopPlaceTypes = (roles) => {
  let allStopTypes = Object.keys(stopTypes);
  return filterByLegalMode(roles, allStopTypes, "StopPlaceType");
};

export const getLegalStopPlaceTypesForStopPlace = (stopPlace) => {
  let allStopTypes = Object.keys(stopTypes);

  if (stopPlace.permissions.allowedStopPlaceTypes.includes("*")) {
    return allStopTypes;
  } else if (stopPlace.permissions.bannedStopPlaceTypes.includes("*")) {
    return [];
  } else if (stopPlace.permissions.allowedStopPlaceTypes.length > 0) {
    return allStopTypes.filter(
      (type) =>
        stopPlace.permissions.allowedStopPlaceTypes.includes(type) &&
        !stopPlace.permissions.bannedStopPlaceTypes.includes(type),
    );
  } else {
    return allStopTypes.filter(
      (type) => !stopPlace.permissions.bannedStopPlaceTypes.includes(type),
    );
  }
};

export const getLegalSubmodesForStopPlace = (stopPlace) => {
  const applicableSubmodes = Object.entries(stopTypes).reduce(
    (acc, [stopType, { transportMode, submodes }]) => {
      if (
        ((stopPlace.permissions.allowedStopPlaceTypes &&
          stopPlace.permissions.allowedStopPlaceTypes.length === 0) ||
          (stopPlace.permissions.allowedStopPlaceTypes.length > 0 &&
            stopPlace.permissions.allowedStopPlaceTypes[0] === "*")) &&
        submodes
      ) {
        return [...acc, ...submodes];
      } else if (
        stopPlace.permissions.allowedStopPlaceTypes &&
        stopPlace.permissions.allowedStopPlaceTypes.length > 0 &&
        stopPlace.permissions.allowedStopPlaceTypes[0] !== "*" &&
        stopPlace.permissions.allowedStopPlaceTypes.includes(stopType) &&
        submodes
      ) {
        return [...acc, ...submodes];
      } else {
        return acc;
      }
    },
    [],
  );

  if (stopPlace.permissions.allowedSubmodes.includes("*")) {
    return applicableSubmodes;
  } else if (stopPlace.permissions.bannedSubmodes.includes("*")) {
    return [];
  } else if (stopPlace.permissions.allowedSubmodes.length > 0) {
    return applicableSubmodes.filter(
      (type) =>
        stopPlace.permissions.allowedSubmodes.includes(type) &&
        !stopPlace.permissions.bannedSubmodes.includes(type),
    );
  } else {
    return applicableSubmodes.filter(
      (type) => !stopPlace.permissions.bannedSubmodes.includes(type),
    );
  }
};

export const getAllowanceSearchInfo = (payload) => {
  return {
    canEdit: payload.permissions.canEdit,
  };
};

export const getLatLng = (entity) => {
  let lngLat = getIn(entity, ["geometry", "legacyCoordinates"], null);

  if (!lngLat || !lngLat.length) return null;

  return lngLat[0].slice().reverse();
};

export const getStopPlace = (result, childId) => {
  if (
    !result ||
    !result.data ||
    !result.data.stopPlace ||
    !result.data.stopPlace.length
  ) {
    return null;
  }

  let stopPlace = result.data.stopPlace[0];

  if (
    childId &&
    Array.isArray(stopPlace.children) &&
    stopPlace.children.length
  ) {
    let matchingChildStop = stopPlace.children.find(
      (child) => child.id === childId,
    );
    if (matchingChildStop) {
      stopPlace = matchingChildStop;
    }
  }

  if (stopPlace) {
    return JSON.parse(JSON.stringify(stopPlace));
  }

  return null;
};

export const getGroupOfStopPlaces = (result) => {
  if (
    !result ||
    !result.data ||
    !result.data.groupOfStopPlaces ||
    !result.data.groupOfStopPlaces.length
  ) {
    return null;
  }

  let groupOfStopPlaces = result.data.groupOfStopPlaces[0];

  if (groupOfStopPlaces) {
    return JSON.parse(JSON.stringify(groupOfStopPlaces));
  }

  return null;
};
