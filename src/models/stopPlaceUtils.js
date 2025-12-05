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

import { setDecimalPrecision } from "../utils";

export const extractAlternativeNames = (alternativeNames) => {
  if (!alternativeNames) return [];
  return alternativeNames.filter(
    (alt) => alt.name && alt.name.value && alt.nameType,
  );
};

export const getImportedId = (keyValues) => {
  if (!keyValues) return [];

  for (let i = 0; i < keyValues.length; i++) {
    if (keyValues[i].key === "imported-id") {
      return keyValues[i].values;
    }
  }
  return [];
};

export const getUniqueStopPlaceTypes = (modalities) => {
  const stopPlaceTypes = modalities.map((child) => JSON.stringify(child));
  return [...new Set(stopPlaceTypes)].map((child) => JSON.parse(child));
};

/* Following the NeTEx placeEquipment model, all placeEquipment sub-items contains at least one item.
 *  An abstraction of this concept in UI and in the client model (a clearly pragmatic approach) has been chosen in Abzu.
 */
export const simplifyPlaceEquipment = (placeEquipments) => {
  if (placeEquipments !== null) {
    let simpleRepresentation = {};
    simpleRepresentation.id = placeEquipments.id;
    Object.keys(placeEquipments).forEach((key) => {
      if (Array.isArray(placeEquipments[key]) && placeEquipments[key].length) {
        if (placeEquipments[key][0]) {
          simpleRepresentation[key] = placeEquipments[key][0];
        }
      }
    });
    return simpleRepresentation;
  }
  return null;
};

/* Following the NeTEx localService model, all localService sub-items contains at least one item.
 *  An abstraction of this concept in UI and in the client model (a clearly pragmatic approach) has been chosen in Abzu.
 */
export const simplifyLocalService = (localServices) => {
  if (localServices !== null) {
    let simpleRepresentation = {};
    Object.keys(localServices).forEach((key) => {
      if (Array.isArray(localServices[key]) && localServices[key].length) {
        if (localServices[key][0]) {
          simpleRepresentation[key] = localServices[key][0];
        }
      }
    });
    return simpleRepresentation;
  }
  return null;
};

/*
 * Simplify place equipment before sending it to the GraphQL API
 * Please note that the GraphQL API is not strictly Netex, so the method name is misleading.
 * This method removes id fields from place equipments, as this is not supported by the GraphQL APIs input type. (ROR-467)
 */
export const netexifyPlaceEquipment = (placeEquipments) => {
  if (placeEquipments) {
    let netexRepresentation = {};

    Object.keys(placeEquipments).forEach((key) => {
      if (placeEquipments[key] && key !== "id") {
        netexRepresentation[key] = [placeEquipments[key]];

        // Do not send ID as the Graphql API Input type does not accept this.
        if (
          Array.isArray(netexRepresentation[key]) &&
          netexRepresentation[key].length > 0
        ) {
          delete netexRepresentation[key][0].id;
        }
      }
    });

    return netexRepresentation;
  }
  return null;
};

export const simplifyBoardingPositions = (boardingPositions) => {
  if (boardingPositions) {
    return boardingPositions.map((bp) => {
      let coordinates = bp.geometry.legacyCoordinates[0].slice();
      return {
        id: bp.id,
        publicCode: bp.publicCode,
        location: [
          setDecimalPrecision(coordinates[1], 6),
          setDecimalPrecision(coordinates[0], 6),
        ],
      };
    });
  } else {
    return [];
  }
};

export const netexifyBoardingPositions = (boardingPositions) => {
  return boardingPositions.map((bp) => {
    return {
      geometry: {
        legacyCoordinates: [[bp.location[1], bp.location[0]]],
        type: "Point",
      },
      publicCode: bp.publicCode,
      id: bp.id || undefined,
    };
  });
};
