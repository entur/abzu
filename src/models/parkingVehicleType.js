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

const parkingVehicleType = Object.freeze({
  CAR: "car",
  MOTORCYCLE: "motorcycle",
  PEDAL_CYCLE: "pedalCycle",
});

export const parkingVehicleTypes = Object.values(parkingVehicleType);

// Tiamat stores a NeTEx VehicleTypeEnumeration value, which holds more values
// than this file names. Show the raw value rather than dropping it, so a type
// this file does not know stays visible to the editor.
export const parkingVehicleTypeLabel = (type, formatMessage) =>
  parkingVehicleTypes.includes(type)
    ? formatMessage({ id: `parking_vehicle_type_${type}` })
    : type;

export default parkingVehicleType;
