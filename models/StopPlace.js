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

import { extractAlternativeNames, getImportedId } from './StopPlaceUtils';
import { getAssessmentSetBasedOnQuays } from '../modelUtils/limitationHelpers';
import { setDecimalPrecision } from '../utils/';
import { hasExpired } from '../modelUtils/validBetween';
import Quay from './Quay';

class StopPlace {

  constructor(stop, isActive, parking, userDefinedCoordinates) {
    this.stop = stop;
    this.isActive = isActive;
    this.parking = parking;
    this.userDefinedCoordinates = userDefinedCoordinates;
  }

  toClient() {

    try {

      const { stop, isActive, parking, userDefinedCoordinates } = this;

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
        submode: stop.submode,
        tags: stop.tags
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
        if (userDefinedCoordinates && stop.id === userDefinedCoordinates.stopPlaceId && userDefinedCoordinates.position) {
          clientStop.location = userDefinedCoordinates.position.slice();
        }
      }

      if (stop.keyValues) {
        clientStop.importedId = getImportedId(stop.keyValues);
        clientStop.keyValues = stop.keyValues;
      }

      if (isActive) {
        clientStop.quays = [];
        clientStop.entrances = [];
        clientStop.pathJunctions = [];
        clientStop.parking = parking || [];

        if (stop.quays) {
          clientStop.quays = stop.quays
            .map(item => new Quay(item, clientStop.accessibilityAssessment).toClient())
            .sort((a, b) => (a.publicCode || '') - b.publicCode || '');
        }
      }
      return clientStop;
    } catch (e) {
      console.log('error', e);
    }
  }
}

export default StopPlace;
