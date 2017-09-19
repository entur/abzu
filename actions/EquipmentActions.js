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

import * as types from './Types';

var EqupmentActions = {};

const sendData = (type, payLoad) => ({
  type: type,
  payLoad: payLoad,
});

EqupmentActions.updateTicketMachineState = (
  state,
  entityType,
  id,
) => dispatch => {
  dispatch(
    sendData(types.CHANGED_TICKET_MACHINE_STATE, {
      state: state,
      type: entityType,
      id: id,
    }),
  );
};

EqupmentActions.updateShelterEquipmentState = (
  state,
  entityType,
  id,
) => dispatch => {
  dispatch(
    sendData(types.CHANGED_SHELTER_EQUIPMENT_STATE, {
      state: state,
      type: entityType,
      id: id,
    }),
  );
};

EqupmentActions.updateSanitaryState = (state, entityType, id) => dispatch => {
  dispatch(
    sendData(types.CHANGED_SANITARY_EQUIPMENT_STATE, {
      state: state,
      type: entityType,
      id: id,
    }),
  );
};

EqupmentActions.updateWaitingRoomState = (
  state,
  entityType,
  id,
) => dispatch => {
  dispatch(
    sendData(types.CHANGED_WAITING_ROOM_STATE, {
      state: state,
      type: entityType,
      id: id,
    }),
  );
};

EqupmentActions.updateCycleStorageState = (
  state,
  entityType,
  id,
) => dispatch => {
  dispatch(
    sendData(types.CHANGED_CYCLE_STORAGE_STATE, {
      state: state,
      type: entityType,
      id: id,
    }),
  );
};

EqupmentActions.update512SignState = (state, entityType, id) => dispatch => {
  dispatch(
    sendData(types.CHANGED_TRANSPORT_SIGN_STATE, {
      state: state,
      type: entityType,
      id: id,
    }),
  );
};

export default EqupmentActions;
