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
