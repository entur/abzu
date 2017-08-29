import { getIn } from '../utils/';
import { calculateDistance, calculateEstimate } from '../modelUtils/pathlinkHelpers';

class PathLink {

  constructor(pathLink) {
    this.pathLink = pathLink;
  }

  toClient() {

    const { pathLink } = this;
    let clientPathLink = JSON.parse(JSON.stringify(pathLink));

    let latlngCoordinates = [];

    let startCoordinates = getIn(
      clientPathLink,
      ['from', 'placeRef', 'addressablePlace', 'geometry', 'coordinates'],
      null
    );
    let inBetweenCoordinates = getIn(clientPathLink, [
      'geometry',
      'coordinates'
    ]);
    let endCoordinates = getIn(
      clientPathLink,
      ['to', 'placeRef', 'addressablePlace', 'geometry', 'coordinates'],
      null
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
  }

}

export default PathLink;