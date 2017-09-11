import { extractAlternativeNames, getImportedId } from './StopPlaceUtils';
import { getAssessmentSetBasedOnQuays } from '../modelUtils/limitationHelpers';
import { setDecimalPrecision } from '../utils/';
import { hasExpired } from '../modelUtils/validBetween';
import StopPlace from './StopPlace';


class ParentStopPlace {

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
        isActive: isActive,
        weighting: stop.weighting,
        version: stop.version,
        hasExpired: hasExpired(stop.validBetween),
        isParent: true,
        tags: stop.tags,
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
        if (stop.id === userDefinedCoordinates.stopPlaceId && userDefinedCoordinates.position) {
          clientStop.location = userDefinedCoordinates.position.slice();
        }
      }

      if (stop.keyValues) {
        clientStop.importedId = getImportedId(stop.keyValues);
        clientStop.keyValues = stop.keyValues;
      }

      if (isActive) {
        if (stop.children) {
          clientStop.children = stop.children
            .map(item => new StopPlace(item, isActive).toClient())
        }
      }
      return clientStop;
    } catch (e) {
      console.log('error', e);
    }
  }
}

export default ParentStopPlace;
