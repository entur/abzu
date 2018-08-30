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


import moment from 'moment';
import { defaultLimitations } from '../models/Limitations';
import { netexifyPlaceEquipment } from '../models/stopPlaceUtils'

const helpers = {};

helpers.mapQuayToVariables = quay => {
  let quayVariables = {
    id: quay.id,
    geometry: null,
    compassBearing: quay.compassBearing,
    publicCode: quay.publicCode,
    accessibilityAssessment: formatAccessibilityAssements(
      quay.accessibilityAssessment
    ),
    keyValues: quay.keyValues,
    placeEquipments: netexifyPlaceEquipment(quay.placeEquipments),
    description: {
      value: quay.description,
      lang: 'nor'
    }
  };

  quayVariables.privateCode = {
    value: quay.privateCode || '',
  };

  if (quay.location) {
    quayVariables.geometry = {
      coordinates: [[quay.location[1], quay.location[0]]],
      type: 'Point'
    };
  }
  return quayVariables;
};

helpers.getFullUTCString = (time, date) => {
  const timeString = moment(time).utc().format('HH:mm:ss');
  // Do not format this to UTC in order to retain correct date, 2017-09-1500:02+GMT will be 2017-08... in UTC
  const dateString = moment(date).format('YYYY-MM-DD');
  return (
    moment(`${dateString} ${timeString}`).format(
      'YYYY-MM-DDTHH:mm:ss.SSS'
    ).toString() + 'Z'
  );
};

helpers.mapGroupOfStopPlaceToVariables = groupOfStopPlace => {
  return ({
    id: groupOfStopPlace.id,
    name: createEmbeddableMultilingualString(groupOfStopPlace.name),
    description: createEmbeddableMultilingualString(groupOfStopPlace.description),
    members: groupOfStopPlace.members.map(member => ({
      ref: member.id
    }))
  });
};

helpers.mapChildStopToVariables = (original, userInput) => {
  const stop = JSON.parse(JSON.stringify(original));

  const child = helpers.mapDeepStopToVariables(original, null);

  let variables = {
    id: stop.parentStop.id,
    children: [child],
    name: stop.parentStop.name
  };

  if (stop.parentStop.location) {
    variables.coordinates = [[stop.parentStop.location[1], stop.parentStop.location[0]]];
  }

  if (userInput) {
    const { timeFrom, timeTo, dateFrom, dateTo, comment } = userInput;

    let validPeriod = {};

    if (timeFrom && dateFrom) {
      validPeriod.fromDate = helpers.getFullUTCString(timeFrom, dateFrom);
    }

    if (timeTo && dateTo) {
      validPeriod.toDate = helpers.getFullUTCString(timeTo, dateTo);
    }

    variables.validBetween = validPeriod;

    variables.versionComment = comment;
  }

  return variables;
}

helpers.mapParentStopToVariables = (original, userInput) => {
  const stop = JSON.parse(JSON.stringify(original));
  const children = stop.children.map(child => helpers.mapDeepStopToVariables(child, null));

  let parentStopVariables = {
    name: stop.name,
    description: stop.description || null,
    alternativeNames: stop.alternativeNames || null,
    children: children
  };

  if (stop.id) {
    parentStopVariables.id = stop.id;
  } else {
    parentStopVariables.stopPlaceIds = stop.children.map( child => child.id )
  }

  if (stop.location) {
    parentStopVariables.coordinates = [[stop.location[1], stop.location[0]]];
  }

  if (userInput) {
    const { timeFrom, timeTo, dateFrom, dateTo, comment } = userInput;

    let validPeriod = {};

    if (timeFrom && dateFrom) {
      validPeriod.fromDate = helpers.getFullUTCString(timeFrom, dateFrom);
    }

    if (timeTo && dateTo) {
      validPeriod.toDate = helpers.getFullUTCString(timeTo, dateTo);
    }

    parentStopVariables.validBetween = validPeriod;

    parentStopVariables.versionComment = comment;
  }

  return parentStopVariables;
};

const createEmbeddableMultilingualString = string => ({
  value: string || '',
  lang: 'nor'
});

// properly maps object when Object is used as InputObject and not shallow variables for query
helpers.mapDeepStopToVariables = original => {
  let stopPlace = helpers.mapStopToVariables(original, null);
  stopPlace.name = createEmbeddableMultilingualString(stopPlace.name);
  stopPlace.description = createEmbeddableMultilingualString(stopPlace.description);

  if (stopPlace.coordinates) {
    stopPlace.geometry = {
      coordinates: stopPlace.coordinates.slice(),
      type: 'Point'
    };
    delete stopPlace.coordinates;
  }
  return stopPlace;
}

helpers.removeTypeNameRecursively = (variablesObject) => {
  for(var property in variablesObject) {
    if (property === '__typename')
      delete variablesObject[property];
    else if (typeof variablesObject[property] === 'object')
      helpers.removeTypeNameRecursively(variablesObject[property]);
  }
}

helpers.mapStopToVariables = (original, userInput) => {
  const stop = JSON.parse(JSON.stringify(original));

  let stopVariables = {
    id: stop.id,
    name: stop.name,
    description: stop.description || null,
    stopPlaceType: stop.stopPlaceType,
    quays: stop.quays.map(quay => helpers.mapQuayToVariables(quay)),
    accessibilityAssessment: formatAccessibilityAssements(
      stop.accessibilityAssessment
    ),
    keyValues: stop.keyValues,
    placeEquipments: netexifyPlaceEquipment(stop.placeEquipments),
    alternativeNames: stop.alternativeNames,
    weighting: stop.weighting,
    submode: stop.submode,
    transportMode: stop.transportMode,
    tariffZones: (stop.tariffZones || []).map(tz => ({
      ref: tz.id
    })),
    adjacentSites: stop.adjacentSites
  };

  if (userInput) {
    const { timeFrom, timeTo, dateFrom, dateTo, comment } = userInput;

    let validPeriod = {};

    if (timeFrom && dateFrom) {
      validPeriod.fromDate = helpers.getFullUTCString(timeFrom, dateFrom);
    }

    if (timeTo && dateTo) {
      validPeriod.toDate = helpers.getFullUTCString(timeTo, dateTo);
    }

    stopVariables.validBetween = validPeriod;

    stopVariables.versionComment = comment;
  }

  if (stop.location) {
    stopVariables.coordinates = [[stop.location[1], stop.location[0]]];
  }
  helpers.removeTypeNameRecursively(stopVariables);
  return stopVariables;
};

helpers.mapPathLinkToVariables = pathLinks => {
  return pathLinks.map(source => {
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
      defaultDuration: source.estimate
    };

    if (pathLink.inBetween && pathLink.inBetween.length) {
      pathLink.geometry = {
        type: 'LineString',
        coordinates: pathLink.inBetween.map(latlng => latlng.reverse())
      };
    }
    return stripRedundantFields(pathLink);
  });
};

helpers.mapParkingToVariables = (parkingArr, parentRef) => {
  return parkingArr.map(source => {
    let parking = {
      totalCapacity: Number(source.totalCapacity) || 0,
      parentSiteRef: parentRef,
      parkingVehicleTypes: source.parkingVehicleTypes,
      validBetween: source.validBetween
    };

    if (source.id) {
      parking.id = source.id;
    }

    parking.name = {
      value: source.name,
      lang: 'nor'
    };

    if (source.location) {
      let coordinates = source.location
        .map(c => {
          if (!isFloat(c)) {
            return parseFloat(c + '.0000001');
          }
          return c;
        })
        .reverse();

      parking.geometry = {
        type: 'Point',
        coordinates: [coordinates]
      };
    } else {
      parking.geometry = null;
    }

    return parking;
  });
};

const stripRedundantFields = pathLink => {
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

const formatAccessibilityAssements = assements => {
  if (assements && assements.limitations) {
    Object.keys(defaultLimitations).map(key => {
      if (!assements.limitations[key]) {
        assements.limitations[key] = 'UNKNOWN';
      }
    });
  }
  return assements;
};

const isFloat = n => Number(n) === n && n % 1 !== 0;

export default helpers;
