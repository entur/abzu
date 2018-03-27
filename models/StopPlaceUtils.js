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


export const extractAlternativeNames = alternativeNames => {
  if (!alternativeNames) return [];
  return alternativeNames.filter(
    alt => alt.name && alt.name.value && alt.nameType,
  );
};

export const getImportedId = keyValues => {
  if (!keyValues) return [];

  for (let i = 0; i < keyValues.length; i++) {
    if (keyValues[i].key === "imported-id") {
      return keyValues[i].values;
    }
  }
  return [];
};

export const getUniqueStopPlaceTypes = modalities => {
  const stopPlaceTypes = modalities.map(child => JSON.stringify(child));
  return [...new Set(stopPlaceTypes)].map(child => JSON.parse(child));
};

/* Following the NeTEx placeEquipment model, all placeEquipment sub-items contains at least one item.
  An abstraction of this concept in UI and in the client model (a clearly pragmatic approach) has been chosen in Abzu.
*/
export const simplifyPlaceEquipment = placeEquipments => {
  if (placeEquipments !== null) {
    let simpleRepresentation = {};
    Object.keys(placeEquipments).forEach(key => {
      if (Array.isArray(placeEquipments[key]) && placeEquipments[key].length) {
        if (placeEquipments[key][0]) {
          simpleRepresentation[key] = placeEquipments[key][0]
        }
      }
    });
    return simpleRepresentation;
  }
  return null;
};


export const netexifyPlaceEquipment = placeEquipments => {
  if (placeEquipments) {
    let netexRepresentation = {};
    Object.keys(placeEquipments).forEach(key => {
      if (placeEquipments[key]) {
        netexRepresentation[key] = [placeEquipments[key]]
      }
    });
    return netexRepresentation;
  }
  return null;
};