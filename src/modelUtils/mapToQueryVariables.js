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

import moment from "moment";
import {
  AccessibilityLimitationType,
  defaultLimitations,
} from "../models/AccessibilityLimitation";
import PARKING_TYPE from "../models/parkingType";
import {
  netexifyBoardingPositions,
  netexifyPlaceEquipment,
} from "../models/stopPlaceUtils";
import { netexifyLocalServices } from "./localServicesHelpers";

const helpers = {};

helpers.mapQuayToVariables = (quay) => {
  let quayVariables = {
    id: quay.id,
    geometry: null,
    compassBearing: quay.compassBearing,
    publicCode: quay.publicCode,
    accessibilityAssessment: formatAccessibilityAssessments(
      quay.accessibilityAssessment,
    ),
    keyValues: quay.keyValues,
    placeEquipments: netexifyPlaceEquipment(quay.placeEquipments),
    facilities: quay.facilities,
    description: quay.description
      ? createEmbeddableMultilingualString(quay.description)
      : null,
  };

  quayVariables.privateCode = {
    value: quay.privateCode || "",
  };

  if (quay.location) {
    quayVariables.geometry = {
      legacyCoordinates: [[quay.location[1], quay.location[0]]],
      type: "Point",
    };
  }

  if (quay.boardingPositions) {
    quayVariables.boardingPositions = netexifyBoardingPositions(
      quay.boardingPositions,
    );
  }

  helpers.removeTypeNameRecursively(quayVariables);
  return quayVariables;
};

helpers.getFullUTCString = (time, date) => {
  const timeString = moment(time).utc().format("HH:mm:ss");
  // Do not format this to UTC in order to retain correct date, 2017-09-1500:02+GMT will be 2017-08... in UTC
  const dateString = moment(date).format("YYYY-MM-DD");
  return (
    moment(`${dateString} ${timeString}`)
      .format("YYYY-MM-DDTHH:mm:ss.SSS")
      .toString() + "Z"
  );
};

helpers.mapGroupOfStopPlaceToVariables = (groupOfStopPlace) => {
  return {
    id: groupOfStopPlace.id,
    name: createEmbeddableMultilingualString(groupOfStopPlace.name),
    description: createEmbeddableMultilingualString(
      groupOfStopPlace.description,
    ),
    members: groupOfStopPlace.members.map((member) => ({
      ref: member.id,
    })),
  };
};

helpers.mapChildStopToVariables = (original, userInput) => {
  const stop = JSON.parse(JSON.stringify(original));

  const child = helpers.mapDeepStopToVariables(original, null);

  let variables = {
    id: stop.parentStop.id,
    children: [child],
    name: createEmbeddableMultilingualString(stop.parentStop.name),
  };

  if (stop.parentStop.location) {
    variables.legacyCoordinates = [
      [stop.parentStop.location[1], stop.parentStop.location[0]],
    ];
  }

  if (userInput) {
    const { comment } = userInput;

    variables.versionComment = comment;
  }
  helpers.removeTypeNameRecursively(variables);
  return variables;
};

helpers.mapParentStopToVariables = (original, userInput) => {
  const stop = JSON.parse(JSON.stringify(original));
  const children = stop.children.map((child) =>
    helpers.mapDeepStopToVariables(child, null),
  );

  let parentStopVariables = {
    name: createEmbeddableMultilingualString(stop.name),
    description: stop.description
      ? createEmbeddableMultilingualString(stop.description)
      : null,
    alternativeNames: stop.alternativeNames || null,
    children: children,
    url: stop.url,
  };

  if (stop.id) {
    parentStopVariables.id = stop.id;
  } else {
    parentStopVariables.stopPlaceIds = stop.children.map((child) => child.id);
  }
  if (stop.location) {
    parentStopVariables.legacyCoordinates = [
      [stop.location[1], stop.location[0]],
    ];
  }

  if (userInput) {
    const { comment } = userInput;

    parentStopVariables.versionComment = comment;
  }
  helpers.removeTypeNameRecursively(parentStopVariables);
  return parentStopVariables;
};

const createEmbeddableMultilingualString = (string) => ({
  value: string || "",
  lang: window.config.defaultLanguageCode,
});

// properly maps object when Object is used as InputObject and not shallow variables for query
helpers.mapDeepStopToVariables = (original) => {
  let stopPlace = helpers.mapStopToVariables(original, null);

  if (stopPlace.legacyCoordinates) {
    stopPlace.geometry = {
      legacyCoordinates: stopPlace.legacyCoordinates.slice(),
      type: "Point",
    };
    delete stopPlace.legacyCoordinates;
  }
  return stopPlace;
};

helpers.removeTypeNameRecursively = (variablesObject) => {
  for (var property in variablesObject) {
    if (property === "__typename") delete variablesObject[property];
    else if (typeof variablesObject[property] === "object")
      helpers.removeTypeNameRecursively(variablesObject[property]);
  }
};

helpers.mapStopToVariables = (original, userInput) => {
  const stop = JSON.parse(JSON.stringify(original));
  let stopVariables = {
    id: stop.id,
    name: createEmbeddableMultilingualString(stop.name),
    publicCode: stop.publicCode,
    description: stop.description
      ? createEmbeddableMultilingualString(stop.description)
      : null,
    stopPlaceType: stop.stopPlaceType,
    quays: stop.quays.map((quay) => helpers.mapQuayToVariables(quay)),
    accessibilityAssessment: formatAccessibilityAssessments(
      stop.accessibilityAssessment,
    ),
    keyValues: stop.keyValues,
    placeEquipments: netexifyPlaceEquipment(stop.placeEquipments),
    localServices: netexifyLocalServices(stop.localServices),
    facilities: stop.facilities,
    alternativeNames: stop.alternativeNames,
    weighting: stop.weighting,
    submode: stop.submode,
    transportMode: stop.transportMode,
    tariffZones: (stop.tariffZones || []).map((tz) => ({
      ref: tz.id,
    })),
    adjacentSites: stop.adjacentSites,
    url: stop.url,
  };

  stopVariables.privateCode = {
    value: stop.privateCode || "",
  };

  if (userInput) {
    const { comment } = userInput;
    stopVariables.versionComment = comment;
  }

  if (stop.location) {
    stopVariables.legacyCoordinates = [[stop.location[1], stop.location[0]]];
  }
  helpers.removeTypeNameRecursively(stopVariables);
  return stopVariables;
};

helpers.mapPathLinkToVariables = (pathLinks) => {
  return pathLinks.map((source) => {
    let pathLink = JSON.parse(JSON.stringify(source));

    // TODO : Move these to stripRedundantFields, write test for this

    if (pathLink.from && pathLink.from.placeRef) {
      if (pathLink.from.placeRef.addressablePlace) {
        delete pathLink.from.placeRef.addressablePlace;
      }
    }

    if (pathLink.to && pathLink.to.placeRef) {
      if (pathLink.to.placeRef.addressablePlace) {
        delete pathLink.to.placeRef.addressablePlace;
      }
    }

    pathLink.transferDuration = {
      defaultDuration: source.estimate,
    };

    if (pathLink.inBetween && pathLink.inBetween.length) {
      pathLink.geometry = {
        type: "LineString",
        legacyCoordinates: pathLink.inBetween.map((latlng) => latlng.reverse()),
      };
    }
    helpers.removeTypeNameRecursively(pathLink);
    return stripRedundantFields(pathLink);
  });
};

helpers.mapParkingToVariables = (parkingArr, parentRef) => {
  return parkingArr.map((source) => {
    let parking = {
      totalCapacity: Number(source.totalCapacity) || 0,
      parentSiteRef: parentRef,
      parkingVehicleTypes: source.parkingVehicleTypes,
      validBetween: source.validBetween,
    };

    if (source.id) {
      parking.id = source.id;
    }

    if (source.parkingLayout) {
      parking.parkingLayout = source.parkingLayout;
    }

    if (source.parkingPaymentProcess) {
      parking.parkingPaymentProcess = source.parkingPaymentProcess;
    }

    if (source.rechargingAvailable !== undefined) {
      parking.rechargingAvailable = source.rechargingAvailable;
    }

    if (
      source.numberOfSpaces ||
      source.numberOfSpacesWithRechargePoint ||
      source.numberOfSpacesForRegisteredDisabledUserType
    ) {
      parking.parkingProperties = [
        {
          spaces: [
            {
              parkingUserType: "allUsers",
              numberOfSpaces: source.numberOfSpaces,
              numberOfSpacesWithRechargePoint:
                source.numberOfSpacesWithRechargePoint,
            },
            {
              parkingUserType: "registeredDisabled",
              numberOfSpaces:
                source.numberOfSpacesForRegisteredDisabledUserType,
            },
          ],
        },
      ];
    } else if (source.parkingType === PARKING_TYPE.BIKE_PARKING) {
      parking.parkingProperties = [
        {
          spaces: [
            {
              parkingUserType: "allUsers",
              numberOfSpaces: source.totalCapacity,
            },
          ],
        },
      ];
    }

    parking.name = {
      value: source.name,
      lang: window.config.defaultLanguageCode,
    };

    if (source.location) {
      let coordinates = source.location
        .map((c) => {
          if (!isFloat(c)) {
            return parseFloat(c + ".0000001");
          }
          return c;
        })
        .reverse();

      parking.geometry = {
        type: "Point",
        legacyCoordinates: [coordinates],
      };
    } else {
      parking.geometry = null;
    }
    helpers.removeTypeNameRecursively(parking);
    return parking;
  });
};

const stripRedundantFields = (pathLink) => {
  delete pathLink.estimate;
  delete pathLink.duration;
  delete pathLink.inBetween;

  if (pathLink.to && pathLink.to.addressablePlace) {
    delete pathLink.to.addressablePlace.geometry;
  }

  if (pathLink.from && pathLink.from.addressablePlace) {
    delete pathLink.from.addressablePlace.geometry;
  }

  return pathLink;
};

const formatAccessibilityAssessments = (assessments) => {
  if (assessments && assessments.limitations) {
    Object.keys(defaultLimitations).forEach((key) => {
      if (!assessments.limitations[key]) {
        assessments.limitations[key] = AccessibilityLimitationType.UNKNOWN;
      }
    });
  }
  return assessments;
};

const isFloat = (n) => Number(n) === n && n % 1 !== 0;

export default helpers;
