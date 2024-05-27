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

import { getIn } from "../utils/";
import {
  calculateDistance,
  calculateEstimate,
} from "../modelUtils/leafletUtils";

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
      ["from", "placeRef", "addressablePlace", "geometry", "legacyCoordinates"],
      null,
    );
    let inBetweenCoordinates = getIn(clientPathLink, [
      "geometry",
      "legacyCoordinates",
    ]);
    let endCoordinates = getIn(
      clientPathLink,
      ["to", "placeRef", "addressablePlace", "geometry", "legacyCoordinates"],
      null,
    );

    if (startCoordinates) {
      startCoordinates[0].reverse();
      latlngCoordinates.push(startCoordinates[0]);
    }

    if (inBetweenCoordinates) {
      inBetweenCoordinates.map((lngLat) => lngLat.reverse());
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
