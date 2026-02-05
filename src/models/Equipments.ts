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

export enum SanitaryFacility {
  NONE = "none",
  TOILET = "toilet",
  WHEEL_CHAIR_ACCESS_TOILET = "wheelChairAccessToilet",
  SHOWER = "shower",
  WASHING_AND_CHANGE_FACILITIES = "washingAndChangeFacilities",
  BABY_CHANGE = "babyChange",
  WHEELCHAIR_BABY_CHANGE = "wheelchairBabyChange",
  SHOE_SHINER = "shoeShiner",
  OTHER = "other",
}

/**
 * Equipment's data used as part of Facilities tab;
 * Each item matches to FacilityTabItem enum value
 */
export const defaultEquipmentFacilities = {
  ticketMachines: {
    isChecked: {
      ticketMachines: true,
      numberOfMachines: 1,
      audioInterfaceAvailable: false,
      tactileInterfaceAvailable: false,
      wheelchairSuitable: false,
    },
    isUnChecked: {
      ticketMachines: false,
      numberOfMachines: 0,
      audioInterfaceAvailable: false,
      tactileInterfaceAvailable: false,
      wheelchairSuitable: false,
    },
  },
  ticketOffice: {
    isChecked: {
      ticketOffice: true,
    },
    isUnChecked: {
      ticketOffice: false,
    },
  },
  ticketCounter: {
    isChecked: {
      ticketCounter: true,
      inductionLoops: false,
      lowCounterAccess: false,
    },
    isUnChecked: {
      ticketCounter: false,
      inductionLoops: false,
      lowCounterAccess: false,
    },
  },
  shelterEquipment: {
    isChecked: {
      seats: 1,
      stepFree: false,
      enclosed: false,
    },
    isUnChecked: null,
  },
  wc: {
    isChecked: {
      gender: "both",
      numberOfToilets: 1,
      sanitaryFacilityList: [] as SanitaryFacility[],
      // note: sanitaryFacilityList is handled on a component level to not overwrite the values that are not related to WC
    },
    isUnChecked: {
      gender: null,
      numberOfToilets: 0,
      sanitaryFacilityList: [] as SanitaryFacility[],
    },
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

export enum Equipment {
  TICKETING_EQUIPMENT = "ticketingEquipment",
  SHELTER_EQUIPMENT = "shelterEquipment",
  SANITARY_EQUIPMENT = "sanitaryEquipment",
  WAITING_ROOM_EQUIPMENT = "waitingRoomEquipment",
  CYCLE_STORAGE_EQUIPMENT = "cycleStorageEquipment",
  GENERAL_SIGN = "generalSign",
}
