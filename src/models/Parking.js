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
import { withLegacyCapacityFields } from "./parkingCapacity";
import PARKING_TYPE from "./parkingType";
import PARKING_VEHICLE_TYPE from "./parkingVehicleType";

class Parking {
  constructor(parking) {
    this.parking = parking;
  }

  // Every capacity entry Tiamat holds, in stored order. The editor shows one
  // row for each entry, so no entry is hidden or merged into another.
  get capacityEntries() {
    const spaces = this.parking.parkingProperties?.[0]?.spaces || [];

    return spaces.map((space) => ({
      parkingVehicleType: space.parkingVehicleType ?? null,
      parkingUserType: space.parkingUserType ?? null,
      parkingStayType: space.parkingStayType ?? null,
      numberOfSpaces: space.numberOfSpaces ?? null,
      numberOfSpacesWithRechargePoint:
        space.numberOfSpacesWithRechargePoint ?? null,
    }));
  }

  get storedParkingType() {
    return this.parking.parkingType;
  }

  get guessedParkingType() {
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

  get parkingType() {
    return this.storedParkingType || this.guessedParkingType;
  }

  // Which fields does Tiamat hold for this parking? A stored type is a NeTEx
  // type, and every NeTEx parking carries the full field set. Only the guess
  // can answer "reduced", and only when Tiamat stores no type at all.
  get hasFullFieldSet() {
    if (this.storedParkingType) {
      return true;
    }

    return this.guessedParkingType === PARKING_TYPE.PARK_AND_RIDE;
  }

  // What vehicle is this parking for? NeTEx answers this with the vehicle
  // types, never with the parking type.
  get isForPedalCycle() {
    return (
      this.parking.parkingVehicleTypes?.includes(
        PARKING_VEHICLE_TYPE.PEDAL_CYCLE,
      ) ?? false
    );
  }

  toClient() {
    const { parking } = this;

    let clientParking = {
      id: parking.id,
      name: getIn(parking, ["name", "value"], ""),
      parkingType: this.parkingType,
      hasFullFieldSet: this.hasFullFieldSet,
      isForPedalCycle: this.isForPedalCycle,
      parkingPaymentProcess: parking.parkingPaymentProcess,
      paymentMethods: parking.paymentMethods,
      rechargingAvailable: parking.rechargingAvailable,
      capacityEntries: this.hasFullFieldSet ? this.capacityEntries : [],
      parkingLayout: this.hasFullFieldSet ? this.parking.parkingLayout : null,
      secure: parking.secure,
      lighting: parking.lighting,
      totalCapacity: parking.totalCapacity,
      parkingVehicleTypes: parking.parkingVehicleTypes,
      hasExpired: hasExpired(parking.validBetween),
      validBetween: parking.validBetween,
      accessibilityAssessment: parking.accessibilityAssessment,
      parkingProperties: parking.parkingProperties,
    };
    let coordinates = getIn(parking, ["geometry", "coordinates"], null);

    if (coordinates && coordinates.length) {
      clientParking.location = [coordinates[1], coordinates[0]];
    }

    return withLegacyCapacityFields(clientParking);
  }
}

export default Parking;
