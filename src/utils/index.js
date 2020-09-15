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

export const setDecimalPrecision = (number, n) => {
  if (isNaN(number) || isNaN(n)) {
    return number;
    //throw new Error('setDecimalPrecision, one of the arguments is not a number', number, n)
  }

  let splittedNumbers = String(number).split(".");
  let paddedLength = splittedNumbers[0].length;

  return Number(Number(number).toPrecision(paddedLength + n));
};

export const getIn = (object, keys, defaultValue) => {
  return keys.reduce(function (o, k) {
    return o && typeof o === "object" && k in o ? o[k] : defaultValue;
  }, object);
};

export const getInTransform = (object, keys, defaultValue, transformater) => {
  let value = getIn(object, keys, null);
  return value !== null ? transformater(value) : defaultValue;
};

export const getCoordinatesFromGeometry = (geometry) => {
  if (geometry && geometry.coordinates) {
    let coordinates = geometry.coordinates[0].slice();
    // Leaflet uses latLng, GeoJSON [long,lat]
    return [
      setDecimalPrecision(coordinates[1], 6),
      setDecimalPrecision(coordinates[0], 6),
    ];
  }
  return null;
};

export const extractCoordinates = (latLngString) => {
  if (!latLngString) return null;

  let coords = null;

  if (latLngString.indexOf(",") > 1) {
    coords = latLngString.split(",");
  } else {
    coords = latLngString.split(/\s*[\s,]\s*/);
  }

  if (coords && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    const result = coords.map((c) => setDecimalPrecision(c, 6));
    return result;
  }
  return null;
};

export const createStopPlaceHref = (stopPlaceId) => {
  const path = window.location.href;
  const lastIndexOfSlash = path.lastIndexOf("/") + 1;
  const href = path.substr(0, lastIndexOfSlash) + stopPlaceId;
  return href;
};

export const toCamelCase = (string) => {
  if (!string) return "";

  if (!/\s/g.test(string)) {
    return string.toLowerCase();
  }

  return string.replace(/^([A-Z])|\s(\w)/g, (match, p1, p2) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
};

export const sortVersions = (versions) =>
  versions.sort((a, b) => {
    if (a.toDate === "") return -1;
    if (b.toDate === "") return 1;
    else return new Date(b.toDate) - new Date(a.toDate);
  });

export const getIsCurrentVersionMax = (
  versions,
  currentVersion,
  isChildOfParent
) => {
  /* versioning of child of parent is difficult task and error prone, so it is not supported to
    to view older versions of a child in current state of Abzu
   */
  if (isChildOfParent) return true;

  // no previous version => when creating a new stop place
  if (versions && !versions.length) return true;

  // also when creating a new stop place
  if (!currentVersion) return true;

  // Check if the current version is the newest version, according to version sorted by toDate
  return (
    sortVersions(versions).findIndex(
      ({ version }) => version === Number(currentVersion)
    ) === 0
  );
};

export const findDuplicateImportedIds = (stopPlaces) => {
  const foundImportedIds = [];
  const stopPlacesWithConflict = new Set();
  let quaysWithDuplicateImportedIds = {};
  let fullConflictMap = {};

  stopPlaces.forEach((stopPlace) => {
    if (stopPlace.quays && stopPlace.quays.length) {
      stopPlace.quays.forEach((quay) => {
        if (quay.keyValues && quay.keyValues.length) {
          quay.keyValues.forEach(({ key, values }) => {
            if (key === "imported-id") {
              values.forEach((value) => {
                foundImportedIds.push(value);

                if (!quaysWithDuplicateImportedIds[value]) {
                  quaysWithDuplicateImportedIds[value] = [quay.id];
                } else {
                  quaysWithDuplicateImportedIds[
                    value
                  ] = quaysWithDuplicateImportedIds[value].concat(quay.id);
                }

                if (fullConflictMap[value]) {
                  let current = fullConflictMap[value];
                  if (current[stopPlace.id]) {
                    current[stopPlace.id] = current[stopPlace.id].concat([
                      quay.id,
                    ]);
                  } else {
                    current[stopPlace.id] = [quay.id];
                  }
                  fullConflictMap[value] = current;
                } else {
                  fullConflictMap[value] = {
                    [stopPlace.id]: [quay.id],
                  };
                }
              });
            }
          });
        }
      });
    }
  });

  /* remove false duplicates */
  Object.keys(quaysWithDuplicateImportedIds).forEach((id) => {
    if (quaysWithDuplicateImportedIds[id].length === 1) {
      delete quaysWithDuplicateImportedIds[id];
    }
  });

  Object.keys(fullConflictMap).forEach((importedId) => {
    let stopPlaces = fullConflictMap[importedId];

    let keys = Object.keys(stopPlaces);

    keys.forEach((key) => {
      if (stopPlaces[key].length < 2 && keys.length < 2) {
        delete fullConflictMap[importedId];
      } else {
        stopPlacesWithConflict.add(key);
      }
    });
  });

  Object.keys(quaysWithDuplicateImportedIds).forEach((importedId) => {
    quaysWithDuplicateImportedIds[importedId] = Array.from(
      new Set(quaysWithDuplicateImportedIds[importedId])
    );
    if (quaysWithDuplicateImportedIds[importedId].length < 2) {
      delete quaysWithDuplicateImportedIds[importedId];
    }
  });

  return {
    quaysWithDuplicateImportedIds,
    stopPlacesWithConflict: Array.from(stopPlacesWithConflict),
    fullConflictMap,
  };
};
