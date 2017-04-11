import { getIn } from '../utils'

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

export default EquipmentHelpers
