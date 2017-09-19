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

import { getPolygon } from '../graphql/Actions';
import { isCoordinatesInsidePolygon } from '../utils/mapUtils';

let instance = null;
let fetchedPolygons = null;
let allowNewStopEverywhere = false;

class PolygonManager {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  getAdministrativeZoneIds(tokenParsed) {
    let administrativeZoneIds = [];

    if (!tokenParsed || !tokenParsed.roles) return [];

    tokenParsed.roles.forEach(roleString => {
      let roleJSON = JSON.parse(roleString);
      if (roleJSON.r === 'editStops') {
        if (!!roleJSON.z) {
          administrativeZoneIds.push(roleJSON.z);
        } else {
          allowNewStopEverywhere = true;
        }
      }
    });

    return administrativeZoneIds;
  }

  isPointInPolygon(point) {
    let inside = false;

    if (!fetchedPolygons || allowNewStopEverywhere) return true;

    Object.keys(fetchedPolygons).forEach(k => {
      let polygon = fetchedPolygons[k];
      let found = isCoordinatesInsidePolygon(point, polygon);
      if (found) {
        inside = true;
      }
    });

    return inside;
  }

  fetch(client, tokenParsed) {
    if (!client) {
      console.error('Client is not provided');
      return;
    }

    let adminZones = this.getAdministrativeZoneIds(tokenParsed);

    if (adminZones.length) {
      this.fetchByIds(client, adminZones);
    }
  }

  fetchByIds(client, ids) {
    if (fetchedPolygons === null) {
      getPolygon(client, ids)
        .then(response => {
          let data = response.data;

          if (data) {
            fetchedPolygons = {};

            Object.keys(data).forEach(key => {
              let resultItem = data[key][0];

              if (resultItem) {
                fetchedPolygons[resultItem.id] = resultItem.polygon ? resultItem.polygon.coordinates : [[]];
              }
            });
          }
        })
        .catch(err => console.log(err));
    }
  }
}

export default PolygonManager;
