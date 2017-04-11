import { getIn } from '../utils'

const EquipmentHelpers = {}

EquipmentHelpers.getTicketMachineState = stopPlace => {
  return  getIn(stopPlace, ['placeEquipments', 'ticketingEquipment', 'ticketMachines'], false)
}

EquipmentHelpers.getShelterEquipmentState = stopPlace => {
  const numberOfSeats = getIn(stopPlace, ['placeEquipments', 'shelterEquipment', 'seats'], 0)
  return numberOfSeats > 0
}

EquipmentHelpers.getSanitaryEquiptmentState = stopPlace => {
  const numberOfToilets = getIn(stopPlace, ['placeEquipments', 'sanitaryEquipment', 'numberOfToilets'], 0)
  return numberOfToilets > 0
}

EquipmentHelpers.getWaitingRoomState = stopPlace => {
  const numberOfSeats = getIn(stopPlace, ['placeEquipments', 'waitingRoomEquipment', 'seats'], 0)
  return numberOfSeats > 0
}

EquipmentHelpers.getCycleStorageEquipment = stopPlace => {
  const numberOfSpaces = getIn(stopPlace, ['placeEquipments', 'cycleStorageEquipment', 'numberOfSpaces'], 0)
  return numberOfSpaces > 0
}

export default EquipmentHelpers
