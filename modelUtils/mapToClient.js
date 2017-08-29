import { setDecimalPrecision, getIn, getInTransform } from '../utils/';
import { LatLng } from 'leaflet';
import * as types from '../actions/Types';
import { getAssessmentSetBasedOnQuays } from '../modelUtils/limitationHelpers';
import moment from 'moment';
import { hasExpired } from '../modelUtils/validBetween';

const helpers = {};

const getUniqListBy = (a, key) => {
  var seen = {};
  return a.filter(function(item) {
    let k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  })
};

const calculateDistance = coords => {
  let latlngDistances = coords.map(
    position => new LatLng(position[0], position[1]),
  );
  let totalDistance = 0;

  for (let i = 0; i < latlngDistances.length; i++) {
    if (latlngDistances[i + 1] == null) break;
    totalDistance += latlngDistances[i].distanceTo(latlngDistances[i + 1]);
  }
  return totalDistance;
};

const calculateEstimate = distance => {
  const walkingSpeed = 1.34112; // i.e. 3 mph / 3.6
  return Math.max(Math.floor(distance / walkingSpeed), 1);
};

helpers.mapParkingToClient = parkingObjs => {
  if (!parkingObjs) return [];
  return parkingObjs.map(parking => {
    let clientParking = {
      id: parking.id,
      name: getIn(parking, ['name', 'value'], ''),
      totalCapacity: parking.totalCapacity,
      parkingVehicleTypes: parking.parkingVehicleTypes,
      hasExpired: hasExpired(parking.validBetween),
      validBetween: parking.validBetween
    };
    let coordinates = getIn(parking, ['geometry', 'coordinates'], null);

    if (coordinates && coordinates.length) {
      clientParking.location = [coordinates[0][1], coordinates[0][0]];
    }

    return clientParking;
  });
};

helpers.sortQuays = (current, attribute) => {
  let copy = JSON.parse(JSON.stringify(current));
  let quays = copy.quays;

  quays.sort( (a,b) => (a[attribute] || 'ZZZZZ').localeCompare((b[attribute] || 'ZZZZZ')));

  return {
    ...copy,
    quays
  }
}

helpers.mapPathLinkToClient = pathLinks => {
  if (!pathLinks) return [];

  // NRP-1675, this is a temporary solution until pathLinks(stopPLaceId: $id) returns a unique list
  let uniquePathLinks = getUniqListBy(pathLinks, pathLink => pathLink.id);

  return uniquePathLinks.map(pathLink => {
    let clientPathLink = JSON.parse(JSON.stringify(pathLink));

    let latlngCoordinates = [];

    let startCoordinates = getIn(
      clientPathLink,
      ['from', 'placeRef', 'addressablePlace', 'geometry', 'coordinates'],
      null,
    );
    let inBetweenCoordinates = getIn(clientPathLink, [
      'geometry',
      'coordinates',
    ]);
    let endCoordinates = getIn(
      clientPathLink,
      ['to', 'placeRef', 'addressablePlace', 'geometry', 'coordinates'],
      null,
    );

    if (startCoordinates) {
      startCoordinates[0].reverse();
      latlngCoordinates.push(startCoordinates[0]);
    }

    if (inBetweenCoordinates) {
      inBetweenCoordinates.map(lngLat => lngLat.reverse());
      clientPathLink.inBetween = inBetweenCoordinates;
      latlngCoordinates.push.apply(latlngCoordinates, clientPathLink.inBetween);
    }

    if (endCoordinates) {
      endCoordinates[0].reverse();
      latlngCoordinates.push(endCoordinates[0]);
    }

    clientPathLink.distance = calculateDistance(latlngCoordinates);

    if (
      pathLink.transferDuration &&
      pathLink.transferDuration.defaultDuration
    ) {
      clientPathLink.estimate = pathLink.transferDuration.defaultDuration;
    } else {
      clientPathLink.estimate = calculateEstimate(clientPathLink.distance);
    }
    return clientPathLink;
  });
};

helpers.updateEstimateForPathLink = (action, pathLink) => {
  const { index, estimate } = action.payLoad;
  let updatedPathLink = JSON.parse(JSON.stringify(pathLink));
  updatedPathLink[index].estimate = estimate;
  return updatedPathLink;
};

helpers.addNewPointToPathlink = (action, pathLink) => {
  const coordinates = action.payLoad;
  let updatedPathLink = JSON.parse(JSON.stringify(pathLink));

  let lastPathLink = updatedPathLink[updatedPathLink.length - 1];

  if (!lastPathLink.inBetween) {
    lastPathLink.inBetween = [];
  }

  lastPathLink.inBetween.push(coordinates);

  return updatedPathLink;
};

helpers.updatePathLinkWithNewEntry = (action, pathLink) => {
  if (action.type === types.STARTED_CREATING_POLYLINE) {
    let newPathLink = {
      from: {
        placeRef: {
          ref: action.payLoad.id,
          addressablePlace: {
            id: action.payLoad.id,
            version: 'any',
            geometry: {
              type: 'Point',
              coordinates: [action.payLoad.coordinates],
            },
          },
        },
      },
    };
    return pathLink.concat(newPathLink);
  }

  if (action.type === types.ADDED_FINAL_COORDINATES_TO_POLYLINE) {
    let lastPathLink = JSON.parse(
      JSON.stringify(pathLink[pathLink.length - 1]),
    );

    let latlngCoordinates = [];

    let startCoordinates = getIn(
      lastPathLink,
      ['from', 'placeRef', 'addressablePlace', 'geometry', 'coordinates'],
      null,
    );

    if (startCoordinates) {
      latlngCoordinates.push(startCoordinates[0]);
    }

    if (lastPathLink.inBetween) {
      latlngCoordinates.push.apply(latlngCoordinates, lastPathLink.inBetween);
    }

    lastPathLink.to = {
      placeRef: {
        ref: action.payLoad.id,
        version: 'any',
        addressablePlace: {
          id: action.payLoad.id,
          geometry: {
            type: 'Point',
            coordinates: [action.payLoad.coordinates],
          },
        },
      },
    };

    latlngCoordinates.push(action.payLoad.coordinates);

    lastPathLink.distance = calculateDistance(latlngCoordinates);
    lastPathLink.estimate = calculateEstimate(lastPathLink.distance);

    return pathLink.slice(0, pathLink.length - 1).concat(lastPathLink);
  }
};

helpers.mapVersionToClientVersion = source => {
  if (source) {

    const transformer = value => moment(value).format('YYYY-DD-MM HH:mm');

    return source
      .sort((a, b) => Number(b.version) - Number(a.version))
      .map(data => {
        let version = {
          id: data.id,
          version: data.version,
          name: getIn(data, ['name', 'value'], ''),
          fromDate: getInTransform(
            data.validBetween,
            ['fromDate'],
            '',
            transformer,
          ),
          toDate: getInTransform(
            data.validBetween,
            ['toDate'],
            '',
            transformer,
          ),
          versionComment: data.versionComment,
          changedBy: data.changedBy ? data.changedBy : ''
        };
        return version;
      });
  }
  return [];
};

const extractAlternativeNames = alternativeNames => {
  if (!alternativeNames) return [];
  return alternativeNames.filter(
    alt => alt.name && alt.name.value && alt.nameType,
  );
};

helpers.mapStopToClientStop = (
  stop,
  isActive,
  parking,
  userDefinedCoordinates = {},
) => {
  try {

    let clientStop = {
      id: stop.id,
      name: stop.name ? stop.name.value : '',
      alternativeNames: extractAlternativeNames(stop.alternativeNames),
      stopPlaceType: stop.stopPlaceType,
      isActive: isActive,
      weighting: stop.weighting,
      version: stop.version,
      hasExpired: hasExpired(stop.validBetween),
      transportMode: stop.transportMode,
      submode: stop.submode
    };

    if (stop.topographicPlace) {
      if (stop.topographicPlace.name) {
        clientStop.topographicPlace = stop.topographicPlace.name.value;
      }
      if (
        stop.topographicPlace.parentTopographicPlace &&
        stop.topographicPlace.parentTopographicPlace.name
      ) {
        clientStop.parentTopographicPlace =
          stop.topographicPlace.parentTopographicPlace.name.value;
      }
    }

    if (stop.validBetween) {
      clientStop.validBetween = stop.validBetween;
    }

    if (stop.tariffZones && stop.tariffZones.length) {
      clientStop.tariffZones = stop.tariffZones.map(zone => {
        if (zone.name && zone.name.value) {
          return {
            name: zone.name.value,
            id: zone.id,
          };
        }
      });
    } else {
      clientStop.tariffZones = [];
    }

    clientStop.accessibilityAssessment = stop.accessibilityAssessment
      ? stop.accessibilityAssessment
      : getAssessmentSetBasedOnQuays(stop.quays);

    if (stop.description) {
      clientStop.description = stop.description.value;
    }

    if (stop.placeEquipments) {
      clientStop.placeEquipments = stop.placeEquipments;
    }

    if (stop.geometry && stop.geometry.coordinates) {
      let coordinates = stop.geometry.coordinates[0].slice();
      // Leaflet uses latLng, GeoJSON [long,lat]
      clientStop.location = [
        setDecimalPrecision(coordinates[1], 6),
        setDecimalPrecision(coordinates[0], 6),
      ];
    } else {
      if (stop.id === userDefinedCoordinates.stopPlaceId) {
        clientStop.location = userDefinedCoordinates.position.slice();
      }
    }

    if (stop.keyValues) {
      clientStop.importedId = helpers.getImportedId(stop.keyValues);
      clientStop.keyValues = stop.keyValues;
    }

    if (isActive) {
      clientStop.quays = [];
      clientStop.entrances = [];
      clientStop.pathJunctions = [];
      clientStop.parking = parking || [];

      if (stop.quays) {
        clientStop.quays = stop.quays
          .map(quay =>
            helpers.mapQuayToClientQuay(
              quay,
              clientStop.accessibilityAssessment,
            ),
          )
          .sort((a, b) => (a.publicCode || '') - b.publicCode || '');
      }
    }
    return clientStop;
  } catch (e) {
    console.log('error', e.stackTrace());
  }
};

helpers.mapQuayToClientQuay = (quay, accessibilityAssessment) => {
  const clientQuay = {
    id: quay.id,
    compassBearing: quay.compassBearing,
    publicCode: quay.publicCode,
    description: quay.description ? quay.description.value : '',
  };

  clientQuay.accessibilityAssessment =
    quay.accessibilityAssessment || accessibilityAssessment;

  if (quay.keyValues) {
    clientQuay.importedId = helpers.getImportedId(quay.keyValues);
    clientQuay.keyValues = quay.keyValues;
  }

  if (quay.privateCode && quay.privateCode.value) {
    clientQuay.privateCode = quay.privateCode.value;
  }

  if (quay.geometry && quay.geometry.coordinates) {
    let coordinates = quay.geometry.coordinates[0].slice();

    clientQuay.location = [
      setDecimalPrecision(coordinates[1], 6),
      setDecimalPrecision(coordinates[0], 6),
    ];
  }

  if (quay.placeEquipments) {
    clientQuay.placeEquipments = quay.placeEquipments;
  }

  return clientQuay;
};

helpers.mapNeighbourStopsToClientStops = stops => {
  return stops.map(stop => helpers.mapStopToClientStop(stop, false));
};

helpers.mapSearchResultatToClientStops = stops => {
  return stops.map(stop => {
      if (stop.__typename === 'StopPlace') {
        return helpers.mapSearchResultStopPlace(stop);
      } else if (stop.__typename === 'ParentStopPlace') {
        return helpers.mapSearchResultParentStopPlace(stop);
      }
  });
};

helpers.mapSearchResultStopPlace = stop => {
  let parentTopographicPlace = getIn(
    stop,
    ['topographicPlace', 'parentTopographicPlace', 'name', 'value'],
    '',
  );
  let topographicPlace = getIn(
    stop,
    ['topographicPlace', 'name', 'value'],
    '',
  );

  const clientStop = {
    isParent: false,
    id: stop.id,
    name: stop.name.value,
    isMissingLocation: !stop.geometry,
    stopPlaceType: stop.stopPlaceType,
    submode: stop.submode,
    transportMode: stop.transportMode,
    topographicPlace: topographicPlace,
    parentTopographicPlace: parentTopographicPlace,
    isActive: false,
    quays: stop.quays,
    importedId: helpers.getImportedId(stop.keyValues),
    accessibilityAssessment: stop.accessibilityAssessment,
    hasExpired: hasExpired(stop.validBetween),
  };

  if (stop.geometry && stop.geometry.coordinates) {
    let coordinates = stop.geometry.coordinates[0].slice();
    clientStop.location = [
      setDecimalPrecision(coordinates[1], 6),
      setDecimalPrecision(coordinates[0], 6),
    ];
  }
  return clientStop;
};


helpers.mapSearchResultParentStopPlace = stop => {
  let parentTopographicPlace = getIn(
    stop,
    ['topographicPlace', 'parentTopographicPlace', 'name', 'value'],
    '',
  );
  let topographicPlace = getIn(
    stop,
    ['topographicPlace', 'name', 'value'],
    '',
  );

  const clientParentStop = {
    isParent: true,
    id: stop.id,
    name: stop.name.value,
    isMissingLocation: !stop.geometry,
    stopPlaceType: stop.stopPlaceType,
    submode: stop.submode,
    transportMode: stop.transportMode,
    topographicPlace: topographicPlace,
    parentTopographicPlace: parentTopographicPlace,
    isActive: false,
    children: stop.children.sort( (a, b) => b.id.localeCompare(a.id)),
    importedId: helpers.getImportedId(stop.keyValues),
    accessibilityAssessment: stop.accessibilityAssessment,
    hasExpired: hasExpired(stop.validBetween),
  };

  if (stop.geometry && stop.geometry.coordinates) {
    let coordinates = stop.geometry.coordinates[0].slice();
    clientParentStop.location = [
      setDecimalPrecision(coordinates[1], 6),
      setDecimalPrecision(coordinates[0], 6),
    ];
  }
  return clientParentStop;
};


helpers.mapReportSearchResultsToClientStop = stops => {
  return stops.map(stop => {
    let parentTopographicPlace = getIn(
      stop,
      ['topographicPlace', 'parentTopographicPlace', 'name', 'value'],
      '',
    );
    let topographicPlace = getIn(
      stop,
      ['topographicPlace', 'name', 'value'],
      '',
    );

    const clientStop = {
      id: stop.id,
      name: stop.name.value,
      stopPlaceType: stop.stopPlaceType,
      topographicPlace: topographicPlace,
      parentTopographicPlace: parentTopographicPlace,
      quays: stop.quays.map(quay => helpers.mapQuayToClientQuay(quay)),
      importedId: helpers.getImportedId(stop.keyValues),
      accessibilityAssessment: stop.accessibilityAssessment,
      placeEquipments: stop.placeEquipments,
      submode: stop.submode,
    };

    if (stop.geometry && stop.geometry.coordinates) {
      let coordinates = stop.geometry.coordinates[0].slice();
      clientStop.location = [
        setDecimalPrecision(coordinates[1], 6),
        setDecimalPrecision(coordinates[0], 6),
      ];
    }

    return clientStop;
  });
};

helpers.createNewStopFromLocation = location => {
  return {
    id: null,
    name: '',
    description: '',
    location: location.map(pos => setDecimalPrecision(pos, 6)),
    stopPlaceType: null,
    topographicPlace: '',
    quays: [],
    entrances: [],
    pathJunctions: [],
    parking: [],
    isNewStop: true,
    isActive: true,
    keyValues: []
  };
};

helpers.getCenterPosition = geometry => {
  if (!geometry) return null;
  return [
    setDecimalPrecision(geometry.coordinates[0][1], 6),
    setDecimalPrecision(geometry.coordinates[0][0], 6),
  ];
};

helpers.updateKeyValuesByKey = (original, key, newValues, origin) => {

  const { index, type } = origin;

  if (type === 'stopPlace') {
    return Object.assign({
      ...original,
      importedId: key === 'imported-id' ? newValues : original.importedId,
      keyValues: original.keyValues.map( kv => {
        if (kv.key === key) {
          kv.values = newValues
        }
        return kv;
      })
    });
  }

  if (type === 'quay') {
    return Object.assign({
      ...original,
      quays: original.quays.map( (quay, quayIndex) => {
        if (quayIndex === index) {

          if (key === 'imported-id') {
            quay.importedId = newValues;
          }
          quay.keyValues = quay.keyValues.map( kv => {
            if (kv.key === key) {
              kv.values = newValues
            }
            return kv;
          })
        }
        return quay;
      })
    });
  }
}

helpers.deleteKeyValuesByKey = (original, key, origin) => {
  const { index, type } = origin;

  if (type === 'stopPlace') {
    return Object.assign({
      ...original,
      importedId: key === 'imported-id' ? [] : original.importedId,
      keyValues: original.keyValues.filter( kv => kv.key !== key)
    });
  }

  if (type === 'quay') {
    return Object.assign({
      ...original,
      quays: original.quays.map( (quay, quayIndex) => {
        if (quayIndex === index) {

          if (key === 'imported-id') {
            quay.importedId = [];
          }
          quay.keyValues = quay.keyValues.filter( kv => kv.key !== key);
        }
        return quay;
      })
    });
  }
}

helpers.createKeyValuesPair = (original, key, newValues, origin) => {
  const {index, type} = origin;

  if (type === 'stopPlace') {
    return Object.assign({
      ...original,
      keyValues: (original.keyValues || []).concat({
        key,
        values: newValues
      })
    });
  }

  if (type === 'quay') {
    return Object.assign({
      ...original,
      quays: original.quays.map((quay, quayIndex) => {
        if (quayIndex === index) {
          quay.keyValues = (quay.keyValues || []).concat({
            key,
            values: newValues
          });
        }
        return quay;
      })
    });
  }
}

helpers.updateCurrentStopWithType = (current, type) => {
  return Object.assign({}, current, {
    stopPlaceType: type,
  });
};

helpers.updateCurrentStopWithSubMode = (current, stopPlaceType, transportMode, submode) => {
  return Object.assign({}, current, {
    stopPlaceType,
    transportMode,
    submode
  });
}

helpers.updateCurrentStopWithPosition = (current, location) => {
  return Object.assign({}, current, {
    location: location,
  });
};

helpers.updateCurrentWithNewElement = (current, payLoad) => {
  const { type, position } = payLoad;
  const copy = JSON.parse(JSON.stringify(current));

  const newElement = {
    location: position.slice(),
    name: '',
  };

  switch (type) {
    case 'quay':
      copy.quays = copy.quays.concat({
        ...newElement,
        keyValues: []
      });
      break;
    case 'entrance':
      copy.entrances = copy.entrances.concat(newElement);
      break;
    case 'pathJunction':
      copy.pathJunctions = copy.pathJunctions.concat(newElement);
      break;
    case 'parkAndRide':
      copy.parking = copy.parking.concat({
        ...newElement,
        totalCapacity: null,
        parkingVehicleTypes: ['car'],
        hasExpired: false,
        validBetween: null
      });
      break;
    case 'bikeParking':
      copy.parking = copy.parking.concat({
        ...newElement,
        totalCapacity: null,
        parkingVehicleTypes: ['pedalCycle'],
        hasExpired: false,
        validBetween: null
      });
      break;

    default:
      throw new Error('element not supported', type);
  }
  return copy;
};

helpers.updateCurrentWithoutElement = (current, payLoad) => {
  const { type, index } = payLoad;
  const copy = JSON.parse(JSON.stringify(current));

  switch (type) {
    case 'quay':
      copy.quays = removeElementByIndex(copy.quays, index);
      break;
    case 'entrance':
      copy.entrances = removeElementByIndex(copy.entrances, index);
      break;
    case 'pathJunction':
      copy.pathJunctions = removeElementByIndex(copy.pathJunctions, index);
      break;
    case 'parking':
      copy.parking = setExpirationToNowForParking(copy.parking, index);
      break;
    default:
      throw new Error('element not supported', type);
  }
  return copy;
};

helpers.updateCurrentWithElementPositionChange = (current, payLoad) => {
  const { index, type, position } = payLoad;
  const copy = JSON.parse(JSON.stringify(current));

  switch (type) {
    case 'quay':
      copy.quays[index] = Object.assign({}, copy.quays[index], {
        location: position,
      });
      break;
    case 'entrance':
      copy.entrances[index] = Object.assign({}, copy.entrances[index], {
        location: position,
      });
      break;
    case 'pathJunction':
      copy.pathJunctions[index] = Object.assign({}, copy.pathJunctions[index], {
        location: position,
      });
      break;
    case 'parking':
      copy.parking[index] = Object.assign({}, copy.parking[index], {
        location: position,
      });
      break;
    default:
      console.log('element not supported', type);
  }

  return copy;
};

helpers.updateCurrentWithPublicCode = (current, payLoad) => {
  const { index, type, name } = payLoad;
  const copy = JSON.parse(JSON.stringify(current));

  switch (type) {
    case 'quay':
      copy.quays[index] = Object.assign({}, copy.quays[index], {
        publicCode: name,
      });
      break;
    case 'entrance':
      copy.entrances[index] = Object.assign({}, copy.entrances[index], {
        name: name,
      });
      break;
    case 'pathJunction':
      copy.pathJunctions[index] = Object.assign({}, copy.pathJunctions[index], {
        name: name,
      });
      break;
    default:
      throw new Error('element not supported', type);
  }
  return copy;
};

helpers.updateCurrentWithPrivateCode = (current, payLoad) => {
  const { index, type, name } = payLoad;
  const copy = JSON.parse(JSON.stringify(current));

  switch (type) {
    case 'quay':
      copy.quays[index] = Object.assign({}, copy.quays[index], {
        privateCode: name,
      });
      break;
    default:
      throw new Error('element not supported', type);
  }
  return copy;
};

helpers.updateCompassBearing = (current, payLoad) => {
  const { compassBearing, index } = payLoad;
  const quaysCopy = current.quays.slice();
  quaysCopy[index].compassBearing = compassBearing;
  return {
    ...current,
    quays: quaysCopy,
  };
};

helpers.updateCurrentWithElementDescriptionChange = (current, payLoad) => {
  const { index, type, description } = payLoad;
  const copy = JSON.parse(JSON.stringify(current));

  switch (type) {
    case 'quay':
      copy.quays[index] = Object.assign({}, copy.quays[index], {
        description: description,
      });
      break;
    case 'entrance':
      copy.entrances[index] = Object.assign({}, copy.entrances[index], {
        description: description,
      });
      break;
    case 'pathJunction':
      copy.pathJunctions[index] = Object.assign({}, copy.pathJunctions[index], {
        description: description,
      });
      break;
    default:
      throw new Error('element not supported', type);
  }
  return copy;
};

helpers.mapNeighbourQuaysToClient = (original, payLoad) => {
  let neighbourQuaysMap = { ...original } || {};

  if (!payLoad || !payLoad.length) return neighbourQuaysMap;

  const stopPlace = payLoad[0];

  neighbourQuaysMap[stopPlace.id] = stopPlace.quays.map(quay => {
    let clientQuay = {};

    clientQuay.id = quay.id;

    if (quay.geometry && quay.geometry.coordinates) {
      let coordinates = quay.geometry.coordinates[0].slice();
      clientQuay.location = [
        setDecimalPrecision(coordinates[1], 6),
        setDecimalPrecision(coordinates[0], 6),
      ];
    }

    if (quay.privateCode && quay.privateCode.value) {
      clientQuay.privateCode = quay.privateCode.value;
    }

    clientQuay.publicCode = quay.publicCode;
    clientQuay.compassBearing = quay.compassBearing;

    return clientQuay;
  });

  return neighbourQuaysMap;
};

helpers.addAltName = (original, payLoad) => {
  const { nameType, lang, value } = payLoad;
  const copy = JSON.parse(JSON.stringify(original));

  if (!copy.alternativeNames) {
    copy.alternativeNames = [];
  }

  copy.alternativeNames.push({
    nameType: nameType,
    name: {
      lang: lang,
      value: value,
    },
  });
  return copy;
};

helpers.changeParkingName = (original, payLoad) => {
  const { index, name } = payLoad;
  const copy = JSON.parse(JSON.stringify(original));
  copy.parking[index].name = name;
  return copy;
};

helpers.changeParkingTotalCapacity = (original, payLoad) => {
  const { index, totalCapacity } = payLoad;
  const copy = JSON.parse(JSON.stringify(original));
  copy.parking[index].totalCapacity = Number(totalCapacity);
  return copy;
};

helpers.updateCurrentStopWithWeighting = (stopPlace, payLoad) => {
  const copy = JSON.parse(JSON.stringify(stopPlace));
  copy.weighting = payLoad;
  return copy;
};

helpers.removeAltName = (original, index) => {
  const copy = JSON.parse(JSON.stringify(original));

  if (!copy.alternativeNames) {
    return original;
  }
  copy.alternativeNames = removeElementByIndex(copy.alternativeNames, index);

  return copy;
};

const setExpirationToNowForParking = (list, index) => {
  let parkinglist = list.slice();
  let parking = parkinglist[index];
  let nowDate = new Date();
  let utcDateString = moment(nowDate).utc().format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z';
  parking.validBetween = {
    fromDate: parking.validBetween && parking.validBetween.fromDate || utcDateString,
    toDate: utcDateString
  }
  parking.hasExpired = true;
  return parkinglist;
}

const removeElementByIndex = (list, index) => [
  ...list.slice(0, index),
  ...list.slice(index + 1),
];

helpers.updateCurrentOpenParking = (current, index) => {
  let parkingElements = current.parking.slice();
  let parking = parkingElements[index];
  parking.validBetween = {
    ...parking.validBetween,
    toDate: null
  }
  parking.hasExpired = false;
  return Object.assign({}, current, {
    parking: parkingElements
  });
}

helpers.getImportedId = keyValues => {
  for (let i = 0; i < keyValues.length; i++) {
    if (keyValues[i].key === "imported-id") {
      return keyValues[i].values;
    }
  }
  return [];
};

export default helpers;
