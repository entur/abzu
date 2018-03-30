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


import { extractAlternativeNames, getImportedId } from './stopPlaceUtils';
import { getAssessmentSetBasedOnQuays } from '../modelUtils/limitationHelpers';
import { setDecimalPrecision } from '../utils/';
import { hasExpired, isFuture } from '../modelUtils/validBetween';
import StopPlace from './StopPlace';
import { Entities } from './Entities';

class ParentStopPlace {

  constructor(stop, isActive, parking, userDefinedCoordinates) {
    this.stop = stop;
    this.isActive = isActive;
    this.parking = parking;
    this.userDefinedCoordinates = userDefinedCoordinates;
  }

  // This creates a new dummy with a minimum of values set
  createNew(name, child) {
    const childToAdd = {
      ...child,
      notSaved: true,
      name: name ? name.value : '',
    };

    let clientStop = {
      isNewStop: true,
      name: name ? name.value : '',
      isParent: true,
      isActive: true,
      tags: [],
      children: [childToAdd],
      versions: [],
      entityType: Entities.STOP_PLACE
    };

    if (child.geometry && child.geometry.coordinates) {
      let coordinates = child.geometry.coordinates[0].slice();
      // Leaflet uses latLng, GeoJSON [long,lat]
      clientStop.location = [
        setDecimalPrecision(coordinates[1], 6),
        setDecimalPrecision(coordinates[0], 6),
      ];
    }
    return clientStop;
  }

  toClient() {

    try {

      const { stop, isActive, userDefinedCoordinates } = this;

      let clientStop = {
        alternativeNames: extractAlternativeNames(stop.alternativeNames),
        entityType: Entities.STOP_PLACE,
        hasExpired: hasExpired(stop.validBetween),
        isFuture: isFuture(stop.validBetween),
        id: stop.id,
        isActive: isActive,
        isParent: true,
        name: stop.name ? stop.name.value : '',
        tags: stop.tags,
        version: stop.version,
        weighting: stop.weighting,
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

      if (stop.groups && stop.groups.length) {
        clientStop.groups = stop.groups.map(group => {
          let newGroup = {...group};
          newGroup.name = group.name && group.name.value
            ? group.name.value : '';
          return newGroup;
        });
        clientStop.belongsToGroup = true;
      } else {
        clientStop.groups = [];
        clientStop.belongsToGroup = false;
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
        // Leaflet uses latLng, GeoJSON is [long,lat]
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

      if (stop.children) {

        clientStop.children = stop.children
          .map(item => {

            let child = new StopPlace(item, isActive).toClient();

            if (!child.name) {
              child.name = clientStop.name;
            }

            if (!child.topographicPlace) {
              child.topographicPlace = clientStop.topographicPlace;
            }

            if (!child.parentTopographicPlace) {
              child.parentTopographicPlace = clientStop.parentTopographicPlace;
            }

            child.validBetween = clientStop.validBetween;
            child.isFuture = isFuture(clientStop.validBetween);
            child.hasExpired = hasExpired(clientStop.validBetween);
            child.isChildOfParent = true;

            return child;
          });
      }
      return clientStop;

    } catch (e) {
      console.log('error', e);
    }
  }
}

export default ParentStopPlace;
