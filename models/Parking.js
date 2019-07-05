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

  get numberOfSpaces() {
    const { parking: { parkingProperties } } = this;
    return parkingProperties.length > 0
      ? parkingProperties.shift().spaces.find(v => v.parkingUserType === 'allUsers').numberOfSpaces
      : 0;
  }

  get numberOfSpacesWithRechargePoint() {
    const { parking: { parkingProperties } } = this;
    return parkingProperties.length > 0
      ? parkingProperties.shift().spaces.find(v => v.parkingUserType === 'allUsers').numberOfSpacesWithRechargePoint
      : 0;
  }

  get numberOfSpacesForRegisteredDisabledUserType() {
    const { parking: { parkingProperties } } = this;
    return parkingProperties.length > 0
      ? parkingProperties.shift().spaces.find(v => v.parkingUserType === 'registeredDisabled').numberOfSpaces
      : 0;
  }

  toClient() {

    const { parking } = this;

    let clientParking = {
      id: parking.id,
      name: getIn(parking, ['name', 'value'], ''),
      parkingPaymentProcess: parking.parkingPaymentProcess,
      rechargingAvailable: parking.rechargingAvailable,
      numberOfSpaces: this.numberOfSpaces,
      numberOfSpacesWithRechargePoint: this.numberOfSpacesWithRechargePoint,
      numberOfSpacesForRegisteredDisabledUserType: this.numberOfSpacesForRegisteredDisabledUserType,
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
