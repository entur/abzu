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

import stopTypes from "../models/stopTypes";

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
    legalStopPlaceTypes: getLegalStopPlacesTypes(
      locationPermissions.allowedStopPlaceTypes,
      locationPermissions.bannedStopPlaceTypes,
    ),
    legalSubmodes: getLegalSubmodes(locationPermissions),
  };
};

export const getLegalStopPlaceTypesForStopPlace = (stopPlace) => {
  const { allowedStopPlaceTypes, bannedStopPlaceTypes } = stopPlace.permissions;
  return getLegalStopPlacesTypes(allowedStopPlaceTypes, bannedStopPlaceTypes);
};

export const getLegalStopPlacesTypes = (
  allowedStopPlaceTypes,
  bannedStopPlaceTypes,
) => {
  const allStopTypes = Object.keys(stopTypes);
  if (bannedStopPlaceTypes.includes("*")) {
    return [];
  }

  if (isWildcardOrEmpty(allowedStopPlaceTypes)) {
    return allStopTypes.filter((type) => !bannedStopPlaceTypes.includes(type));
  }

  return allowedStopPlaceTypes.filter(
    (type) => !bannedStopPlaceTypes.includes(type),
  );
};

const isWildcardOrEmpty = (list) => {
  return !list || list.length === 0 || (list.length > 0 && list[0] === "*");
};

const isStopTypeAllowed = (stopType, permissions) => {
  const { allowedStopPlaceTypes } = permissions;
  return (
    isWildcardOrEmpty(allowedStopPlaceTypes) ||
    allowedStopPlaceTypes.includes(stopType)
  );
};

const getSubmodesForStopType = (stopType, permissions) => {
  const { submodes } = stopTypes[stopType];
  if (!submodes) return [];

  if (permissions.bannedStopPlaceTypes.includes(stopType)) return [];
  if (!isStopTypeAllowed(stopType, permissions)) return [];

  return submodes;
};

const filterBySubmodePermissions = (submodes, permissions) => {
  const { allowedSubmodes, bannedSubmodes } = permissions;

  if (allowedSubmodes.includes("*"))
    return submodes.filter((type) => !bannedSubmodes.includes(type));
  if (bannedSubmodes.includes("*")) return [];

  if (allowedSubmodes.length > 0) {
    return submodes.filter(
      (type) =>
        allowedSubmodes.includes(type) && !bannedSubmodes.includes(type),
    );
  }

  return submodes.filter((type) => !bannedSubmodes.includes(type));
};

export const getLegalSubmodesForStopPlace = (stopPlace) => {
  return getLegalSubmodes(stopPlace.permissions);
};

export const getLegalSubmodes = (permissions) => {
  const applicableSubmodes = Object.keys(stopTypes).reduce(
    (acc, stopType) => [
      ...acc,
      ...getSubmodesForStopType(stopType, permissions),
    ],
    [],
  );

  return filterBySubmodePermissions(applicableSubmodes, permissions);
};

export const getAllowanceSearchInfo = (payload) => {
  return {
    canEdit: payload.permissions.canEdit,
  };
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
