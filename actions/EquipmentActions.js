
import * as types from './Types'

var EqupmentActions = {}

const sendData = (type, payLoad) => ({
    type: type,
    payLoad: payLoad
})

EqupmentActions.updateTicketMachineState = (state, entityType, id) => dispatch => {
    dispatch(sendData(types.CHANGED_TICKET_MACHINE_STATE, {
      state: state,
      type: entityType,
      id: id
    }))
}

EqupmentActions.updateShelterEquipmentState = (state, entityType, id) => dispatch => {
    dispatch(sendData(types.CHANGED_SHELTER_EQUIPMENT_STATE, {
      state: state,
      type: entityType,
      id: id
    }))
}

EqupmentActions.updateSanitaryState = (state, entityType, id) => dispatch => {
    dispatch(sendData(types.CHANGED_SANITARY_EQUIPMENT_STATE, {
      state: state,
      type: entityType,
      id: id
    }))
}

EqupmentActions.updateWaitingRoomState = (state, entityType, id) => dispatch => {
    dispatch(sendData(types.CHANGED_WAITING_ROOM_STATE, {
      state: state,
      type: entityType,
      id: id
    }))
}

EqupmentActions.updateCycleStorageState = (state, entityType, id) => dispatch => {
    dispatch(sendData(types.CHANGED_CYCLE_STORAGE_STATE, {
      state: state,
      type: entityType,
      id: id
    }))
}

export default EqupmentActions