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

import {
  defaultEquipmentFacilities,
  Equipment,
  SanitaryFacility,
} from "../models/Equipments";
import { getIn } from "../utils";

const EquipmentHelpers = {};

EquipmentHelpers.isTicketMachinePresent = (entity) => {
  return !!getIn(
    entity,
    ["placeEquipments", "ticketingEquipment", "ticketMachines"],
    null,
  );
};

EquipmentHelpers.isTicketOfficePresent = (entity) => {
  return !!getIn(
    entity,
    ["placeEquipments", "ticketingEquipment", "ticketOffice"],
    null,
  );
};

EquipmentHelpers.isTicketCounterPresent = (entity) => {
  return !!getIn(
    entity,
    ["placeEquipments", "ticketingEquipment", "ticketCounter"],
    null,
  );
};

EquipmentHelpers.getTicketingEquipment = (entity) => {
  return getIn(entity, ["placeEquipments", "ticketingEquipment"], null);
};

EquipmentHelpers.isShelterEquipmentPresent = (entity) => {
  return !!getIn(
    entity,
    ["placeEquipments", "shelterEquipment", "seats"],
    null,
  );
};

EquipmentHelpers.getSanitaryEquipmentPresent = (entity) => {
  return getIn(entity, ["placeEquipments", "sanitaryEquipment"], null);
};

EquipmentHelpers.isSanitaryEquipmentPresent = (entity) => {
  return !!getIn(
    entity,
    ["placeEquipments", "sanitaryEquipment", "numberOfToilets"],
    null,
  );
};

EquipmentHelpers.getSanitaryFacilityList = (entity) => {
  return getIn(
    entity,
    ["placeEquipments", "sanitaryEquipment", "sanitaryFacilityList"],
    [],
  );
};

Equipment.getSanitaryFacilityList = (entity) => {
  return getIn(
    entity,
    ["placeEquipments", "sanitaryEquipment", "sanitaryFacilityList"],
    [],
  );
};

EquipmentHelpers.isSanitaryFacilityWheelchairAccessible = (entity) => {
  const sanitaryFacilityList = Equipment.getSanitaryFacilityList(entity);
  return sanitaryFacilityList.includes(
    SanitaryFacility.WHEEL_CHAIR_ACCESS_TOILET,
  );
};

EquipmentHelpers.is512SignEquipmentPresent = (entity) => {
  const generalSign = getIn(entity, ["placeEquipments", "generalSign"], null);
  if (
    generalSign &&
    generalSign.privateCode &&
    `${generalSign.privateCode.value}` === "512" &&
    generalSign.signContentType === "transportMode"
  ) {
    return true;
  }
  return false;
};

EquipmentHelpers.update512SignEquipment = (entity, payload) => {
  const copyOfEntity = JSON.parse(JSON.stringify(entity));
  return updateEquipmentForEntity(
    copyOfEntity,
    payload,
    Equipment.GENERAL_SIGN,
  );
};

EquipmentHelpers.isWaitingRoomPresent = (entity) => {
  return !!getIn(
    entity,
    ["placeEquipments", "waitingRoomEquipment", "seats"],
    null,
  );
};

EquipmentHelpers.isCycleStorageEquipmentPresent = (entity) => {
  return !!getIn(
    entity,
    ["placeEquipments", "cycleStorageEquipment", "numberOfSpaces"],
    null,
  );
};

EquipmentHelpers.updateTicketingEquipmentState = (stopPlace, payload) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntity(
    updatedStop,
    payload,
    Equipment.TICKETING_EQUIPMENT,
  );
};

EquipmentHelpers.updateShelterEquipmentState = (stopPlace, payload) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntity(
    updatedStop,
    payload,
    Equipment.SHELTER_EQUIPMENT,
  );
};

EquipmentHelpers.updateSanitaryEquipmentState = (stopPlace, payload) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntity(
    updatedStop,
    payload,
    Equipment.SANITARY_EQUIPMENT,
  );
};

EquipmentHelpers.updateWaitingRoomState = (stopPlace, payload) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntity(
    updatedStop,
    payload,
    Equipment.WAITING_ROOM_EQUIPMENT,
  );
};

EquipmentHelpers.updateCycleStorageEquipmentState = (stopPlace, payload) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntity(
    updatedStop,
    payload,
    Equipment.CYCLE_STORAGE_EQUIPMENT,
  );
};

const updateEquipmentForEntity = (entity, payload, typeOfEquipment) => {
  const { state, type, id } = payload;

  let stateFromCheckbox = typeof state === "boolean";

  let overrideState = null;

  if (stateFromCheckbox) {
    if (state) {
      overrideState = defaultEquipmentFacilities[typeOfEquipment].isChecked;
    } else {
      overrideState = defaultEquipmentFacilities[typeOfEquipment].isUnChecked;
    }
  } else {
    overrideState = state;
  }

  if (type === "stopPlace") {
    if (!entity.placeEquipments) {
      entity.placeEquipments = {};
    }

    entity.placeEquipments[typeOfEquipment] = overrideState;
  } else if (type === "quay") {
    if (entity.quays && entity.quays[id]) {
      if (!entity.quays[id].placeEquipments) {
        entity.quays[id].placeEquipments = {};
      }
      entity.quays[id].placeEquipments[typeOfEquipment] = overrideState;
    }
  }

  return entity;
};

export default EquipmentHelpers;
