export const defaultEquipments = {
  ticketingEquipment: {
    isChecked: {
      ticketOffice: true,
      ticketMachines: true,
      numberOfMachines: 1
    },
    isUnChecked: null
  },
  shelterEquipment: {
    isChecked: {
      seats: 1,
      stepFree: false,
      enclosed: false,
    },
    isUnChecked: null
  },
  sanitaryEquipment: {
    isChecked: {
      gender: 'both',
      numberOfToilets: 1
    },
    isUnChecked: null
  },
  waitingRoomEquipment: {
    isChecked: {
      heated: false,
      seats: 1,
      stepFree: false,
    },
    isUnChecked: null
  },
  cycleStorageEquipment: {
    isChecked: {
      cycleStorageType: "racks",
      numberOfSpaces: 1
    },
    isUnChecked: null
  }
}

export const types = {
  ticketMachine: 'ticketingEquipment',
  shelterEquipment: 'shelterEquipment',
  sanitaryEquipment: 'sanitaryEquipment',
  waitingRoomEquipment: 'waitingRoomEquipment',
  cycleStorageEquipment: 'cycleStorageEquipment'
}