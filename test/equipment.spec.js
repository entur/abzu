import expect from 'expect'
import helpers from '../modelUtils/equipmentHelpers'
import equiptedStopPlace from './mock/equiptedStopPlace'
import unequiptedStopPlace from './mock/unequiptedStopPlace'

describe('equipment helper', () => {

  it('should give binary representation of ticket machine based on data', () => {
    const first = helpers.getTicketMachineState(equiptedStopPlace)
    expect(first).toEqual(true)

    const second = helpers.getTicketMachineState(unequiptedStopPlace)
    expect(second).toEqual(false)
  })

  it('should give binary representation of shelterEquipment based on data', () => {
    const first = helpers.getShelterEquipmentState(equiptedStopPlace)
    expect(first).toEqual(true)

    const second = helpers.getShelterEquipmentState(unequiptedStopPlace)
    expect(second).toEqual(false)
  })

  it('should give binary representation of sanitaryEquipment based on data', () => {
    const first = helpers.getSanitaryEquiptmentState(equiptedStopPlace)
    expect(first).toEqual(true)

    const second = helpers.getSanitaryEquiptmentState(unequiptedStopPlace)
    expect(second).toEqual(false)
  })

  it('should give binary representation of waitingRoom based on data', () => {
    const first = helpers.getWaitingRoomState(equiptedStopPlace)
    expect(first).toEqual(true)

    const second = helpers.getWaitingRoomState(unequiptedStopPlace)
    expect(second).toEqual(false)
  })

  it('should give binary representation of cycleStorageEquipment based on data', () => {
    const first = helpers.getCycleStorageEquipment(equiptedStopPlace)
    expect(first).toEqual(true)

    const second = helpers.getCycleStorageEquipment(unequiptedStopPlace)
    expect(second).toEqual(false)
  })

})
