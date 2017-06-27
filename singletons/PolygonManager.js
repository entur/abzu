import { getPolygon } from '../graphql/Actions';
import { isCoordinatesInsidePolygon } from '../utils/mapUtils';

const topographicPlacePrefix = 'KVE:TopographicPlace:';
let instance = null;
let fetchedPolygons = {};

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
          administrativeZoneIds.push(topographicPlacePrefix + roleJSON.z);
        }
      }
    });

    return administrativeZoneIds;
  }

  isPointInPolygon(point) {
    let inside = false;

    Object.keys(fetchedPolygons).forEach( k => {
      let data = fetchedPolygons[k];
      if (data.topographicPlace && data.topographicPlace.length) {
        let polygon = data.topographicPlace[0].polygon.coordinates;
        let found = isCoordinatesInsidePolygon(point, polygon);
        if (found) {
          inside = true;
        }
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
      this.fetchById(client, adminZones[0]);
    }
  }

  fetchById(client, id) {
    if (typeof fetchedPolygons[id] === 'undefined') {
      getPolygon(client, id).then(response => {
        fetchedPolygons[id] = response.data;
      });
    }
  }
}

export default PolygonManager;
