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

import { getIn } from '../utils/';
import { hasExpired } from '../modelUtils/validBetween';

class Parking {
  constructor(parking) {
    this.parking = parking;
  }

  toClient() {

    const { parking } = this;

    let clientParking = {
      id: parking.id,
      name: getIn(parking, ['name', 'value'], ''),
      totalCapacity: parking.totalCapacity,
      parkingVehicleTypes: parking.parkingVehicleTypes,
      hasExpired: hasExpired(parking.validBetween),
      validBetween: parking.validBetween
    };
    let coordinates = getIn(parking, ['geometry', 'coordinates'], null);

    if (coordinates && coordinates.length) {
      clientParking.location = [coordinates[0][1], coordinates[0][0]];
    }

    return clientParking;
  }
}

export default Parking;
