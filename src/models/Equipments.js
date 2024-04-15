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

export const defaultEquipments = {
  ticketingEquipment: {
    isChecked: {
      ticketOffice: true,
      ticketMachines: true,
      numberOfMachines: 1,
    },
    isUnChecked: null,
  },
  shelterEquipment: {
    isChecked: {
      seats: 1,
      stepFree: false,
      enclosed: false,
    },
    isUnChecked: null,
  },
  sanitaryEquipment: {
    isChecked: {
      gender: "both",
      numberOfToilets: 1,
    },
    isUnChecked: null,
  },
  waitingRoomEquipment: {
    isChecked: {
      heated: false,
      seats: 1,
      stepFree: false,
    },
    isUnChecked: null,
  },
  cycleStorageEquipment: {
    isChecked: {
      cycleStorageType: "racks",
      numberOfSpaces: 1,
    },
    isUnChecked: null,
  },
  generalSign: {
    isChecked: {
      privateCode: { value: "512" },
      signContentType: "transportMode",
    },
    isUnChecked: null,
  },
};

export const types = {
  ticketMachine: "ticketingEquipment",
  shelterEquipment: "shelterEquipment",
  sanitaryEquipment: "sanitaryEquipment",
  waitingRoomEquipment: "waitingRoomEquipment",
  cycleStorageEquipment: "cycleStorageEquipment",
  generalSign: "generalSign",
};
