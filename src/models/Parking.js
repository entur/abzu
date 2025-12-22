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

import { hasExpired } from "../modelUtils/validBetween";
import { getIn } from "../utils/";
import PARKING_TYPE from "./parkingType";
import PARKING_VEHICLE_TYPE from "./parkingVehicleType";

class Parking {
  constructor(parking) {
    this.parking = parking;
  }

  findNumberOfSpaces(userType, lookupKey) {
    return this.parking.parkingProperties?.length > 0
      ? this.parking.parkingProperties
          .slice()
          .shift()
          .spaces.find((v) => v.parkingUserType === userType)[lookupKey]
      : 0;
  }

  get numberOfSpaces() {
    if (this.parking.parkingProperties?.length) {
      return this.findNumberOfSpaces("allUsers", "numberOfSpaces");
    } else {
      return this.parking.totalCapacity;
    }
  }

  get numberOfSpacesWithRechargePoint() {
    return this.findNumberOfSpaces(
      "allUsers",
      "numberOfSpacesWithRechargePoint",
    );
  }

  get numberOfSpacesForRegisteredDisabledUserType() {
    return this.findNumberOfSpaces("registeredDisabled", "numberOfSpaces");
  }

  get parkingType() {
    if (this.parking.parkingType) {
      return this.parking.parkingType;
    }

    if (this.parking.parkingVehicleTypes.includes(PARKING_VEHICLE_TYPE.CAR)) {
      return PARKING_TYPE.PARK_AND_RIDE;
    }

    if (
      this.parking.parkingVehicleTypes.includes(
        PARKING_VEHICLE_TYPE.PEDAL_CYCLE,
      )
    ) {
      return PARKING_TYPE.BIKE_PARKING;
    }

    return PARKING_TYPE.UNKNOWN;
  }

  get isParkAndRide() {
    return this.parkingType === PARKING_TYPE.PARK_AND_RIDE;
  }

  toClient() {
    const { parking } = this;

    let clientParking = {
      id: parking.id,
      name: getIn(parking, ["name", "value"], ""),
      parkingType: this.parkingType,
      parkingPaymentProcess: parking.parkingPaymentProcess,
      rechargingAvailable: parking.rechargingAvailable,
      numberOfSpaces: this.isParkAndRide ? this.numberOfSpaces : null,
      numberOfSpacesWithRechargePoint: this.isParkAndRide
        ? this.numberOfSpacesWithRechargePoint
        : null,
      numberOfSpacesForRegisteredDisabledUserType: this.isParkAndRide
        ? this.numberOfSpacesForRegisteredDisabledUserType
        : null,
      parkingLayout: this.isParkAndRide ? this.parking.parkingLayout : null,
      totalCapacity: parking.totalCapacity,
      parkingVehicleTypes: parking.parkingVehicleTypes,
      hasExpired: hasExpired(parking.validBetween),
      validBetween: parking.validBetween,
      accessibilityAssessment: parking.accessibilityAssessment,
    };
    let coordinates = getIn(parking, ["geometry", "legacyCoordinates"], null);

    if (coordinates && coordinates.length) {
      clientParking.location = [coordinates[0][1], coordinates[0][0]];
    }

    return clientParking;
  }
}

export default Parking;
