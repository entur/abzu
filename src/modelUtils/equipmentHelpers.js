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


import { getIn } from '../utils';
import { defaultEquipments, types } from '../models/Equipments';

const EquipmentHelpers = {};

EquipmentHelpers.getTicketMachineState = entity => {
  const equipmentState = getIn(
    entity,
    ['placeEquipments', 'ticketingEquipment'],
    null,
  );
  return equipmentState !== null;
};

EquipmentHelpers.getShelterEquipmentState = entity => {
  const equipmentState = getIn(
    entity,
    ['placeEquipments', 'shelterEquipment'],
    null,
  );
  return equipmentState !== null;
};

EquipmentHelpers.getSanitaryEquipmentState = entity => {
  const sanitaryState = getIn(
    entity,
    ['placeEquipments', 'sanitaryEquipment'],
    null,
  );
  return sanitaryState !== null;
};

EquipmentHelpers.get512SignEquipment = entity => {
  const generalSign = getIn(entity, ['placeEquipments', 'generalSign'], null);
  if (
    generalSign &&
    generalSign.privateCode &&
    generalSign.privateCode.value == '512' &&
    generalSign.signContentType === 'transportMode'
  ) {
    return true;
  }
  return false;
};

EquipmentHelpers.update512SignEquipment = (entity, payLoad) => {
  const copyOfEntity = JSON.parse(JSON.stringify(entity));
  return updateEquipmentForEntitity(copyOfEntity, payLoad, types.generalSign);
};

EquipmentHelpers.getWaitingRoomState = entity => {
  const waitingRoomState = getIn(
    entity,
    ['placeEquipments', 'waitingRoomEquipment'],
    null,
  );
  return waitingRoomState !== null;
};

EquipmentHelpers.getCycleStorageEquipment = entity => {
  const cycleStorageState = getIn(
    entity,
    ['placeEquipments', 'cycleStorageEquipment'],
    null,
  );
  return cycleStorageState !== null;
};

EquipmentHelpers.updateTicketMachineState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntitity(updatedStop, payLoad, types.ticketMachine);
};

EquipmentHelpers.updateShelterEquipmentState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntitity(
    updatedStop,
    payLoad,
    types.shelterEquipment,
  );
};

EquipmentHelpers.updateSanitaryEquipmentState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntitity(
    updatedStop,
    payLoad,
    types.sanitaryEquipment,
  );
};

EquipmentHelpers.updateWaitingRoomState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntitity(
    updatedStop,
    payLoad,
    types.waitingRoomEquipment,
  );
};

EquipmentHelpers.updateCycleStorageEquipmentState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace));
  return updateEquipmentForEntitity(
    updatedStop,
    payLoad,
    types.cycleStorageEquipment,
  );
};


const updateEquipmentForEntitity = (entity, payLoad, typeOfEquipment) => {
  const { state, type, id } = payLoad;

  let stateFromCheckbox = typeof state === 'boolean';

  let overrideState = null;

  if (stateFromCheckbox) {
    if (state) {
      overrideState = defaultEquipments[typeOfEquipment].isChecked;
    } else {
      overrideState = defaultEquipments[typeOfEquipment].isUnChecked;
    }
  } else {
    overrideState = state;
  }

  if (type === 'stopPlace') {
    if (!entity.placeEquipments) {
      entity.placeEquipments = {};
    }

    entity.placeEquipments[typeOfEquipment] = overrideState;
  } else if (type === 'quay') {
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
