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
