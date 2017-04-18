import { getIn } from '../utils'
import { defaultEquipments, types } from '../actions/Equipments'

const EquipmentHelpers = {}

EquipmentHelpers.getTicketMachineState = entity => {
  return  getIn(entity, ['placeEquipments', 'ticketingEquipment', 'ticketMachines'], false)
}

EquipmentHelpers.getShelterEquipmentState = entity => {
  const numberOfSeats = getIn(entity, ['placeEquipments', 'shelterEquipment', 'seats'], 0)
  return numberOfSeats > 0
}

EquipmentHelpers.getSanitaryEquiptmentState = entity => {
  const numberOfToilets = getIn(entity, ['placeEquipments', 'sanitaryEquipment', 'numberOfToilets'], 0)
  return numberOfToilets > 0
}

EquipmentHelpers.getWaitingRoomState = entity => {
  const numberOfSeats = getIn(entity, ['placeEquipments', 'waitingRoomEquipment', 'seats'], 0)
  return numberOfSeats > 0
}

EquipmentHelpers.getCycleStorageEquipment = entity => {
  const numberOfSpaces = getIn(entity, ['placeEquipments', 'cycleStorageEquipment', 'numberOfSpaces'], 0)
  return numberOfSpaces > 0
}

EquipmentHelpers.updateTicketMachineState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace))
  return updateEquipmentForStopPlace(updatedStop, payLoad, types.ticketMachine)
}

EquipmentHelpers.updateShelterEquipmentState  = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace))
  return updateEquipmentForStopPlace(updatedStop, payLoad, types.shelterEquipment)
}

EquipmentHelpers.updateSanitaryEquipmentState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace))
  return updateEquipmentForStopPlace(updatedStop, payLoad, types.sanitaryEquipment)
}

EquipmentHelpers.updateWaitingRoomState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace))
  return updateEquipmentForStopPlace(updatedStop, payLoad, types.waitingRoomEquipment)
}

EquipmentHelpers.updateCycleStorageEquipmentState = (stopPlace, payLoad) => {
  let updatedStop = JSON.parse(JSON.stringify(stopPlace))
  return updateEquipmentForStopPlace(updatedStop, payLoad, types.cycleStorageEquipment)
}

const updateEquipmentForStopPlace = (stopPlace, payLoad, typeOfEquipment) => {
  const { state, type, id } = payLoad

  let stateFromCheckbox = typeof state === 'boolean'

  let newState = null

  if (stateFromCheckbox) {
    if (state) {
      newState = defaultEquipments[typeOfEquipment].isChecked
    } else {
      newState = defaultEquipments[typeOfEquipment].isUnChecked
    }
  }

  if (type === 'stopPlace') {

    if (!stopPlace.placeEquipments) {
      stopPlace.placeEquipments = {}
    }
    stopPlace.placeEquipments[typeOfEquipment] = newState

  } else if (type === 'quay') {

    if (stopPlace.quays && stopPlace.quays[id]) {

      if (!stopPlace.quays[id].placeEquipments) {
        stopPlace.quays[id].placeEquipments = {}
      }
      stopPlace.quays[id].placeEquipments[typeOfEquipment] = newState
    }
  }
  return stopPlace
}

export default EquipmentHelpers
