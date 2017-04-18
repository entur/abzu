export const defaultEquipments = {
  ticketingEquipment: {
    isChecked: {
      ticketOffice: true,
      ticketMachines: true,
      numberOfMachines: 1
    },
    isUnChecked: {
      ticketOffice: false,
      ticketMachines: false,
      numberOfMachines: 0
    }
  },
  shelterEquipment: {
    isChecked: {
      seats: 1,
      stepFree: false,
      enclosed: false,
    },
    isUnChecked: {
      seats: 0,
      stepFree: false,
      enclosed: false
    }
  },
  sanitaryEquipment: {
    isChecked: {
      gender: 'both',
      numberOfToilets: 1
    },
    isUnChecked: {
      gender: 'none',
      numberOfToilets: 0
    }
  },
  waitingRoomEquipment: {
    isChecked: {
      heated: false,
      seats: 1,
      stepFree: false,
    },
    isUnChecked: {
      heated: false,
      seats: 0,
      stepFree: false
    }
  },
  cycleStorageEquipment: {
    isChecked: {
      cycleStorageType: "racks",
      numberOfSpaces: 1
    },
    isUnChecked: {
      cycleStorageType: "racks",
      numberOfSpaces: 0
    }
  }
}

export const types = {
  ticketMachine: 'ticketingEquipment',
  shelterEquipment: 'shelterEquipment',
  sanitaryEquipment: 'sanitaryEquipment',
  waitingRoomEquipment: 'waitingRoomEquipment',
  cycleStorageEquipment: 'cycleStorageEquipment'
}