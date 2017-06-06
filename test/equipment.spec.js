import expect from 'expect';
import helpers from '../modelUtils/equipmentHelpers';
import equiptedStopPlace from './mock/equiptedStopPlace';
import unequiptedStopPlace from './mock/unequiptedStopPlace';

describe('equipment helper', () => {
  it('should give binary representation of ticket machine based on data', () => {
    const first = helpers.getTicketMachineState(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.getTicketMachineState(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  it('should give binary representation of shelterEquipment based on data', () => {
    const first = helpers.getShelterEquipmentState(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.getShelterEquipmentState(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  it('should give binary representation of sanitaryEquipment based on data', () => {
    const first = helpers.getSanitaryEquipmentState(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.getSanitaryEquipmentState(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  it('should give binary representation of waitingRoom based on data', () => {
    const first = helpers.getWaitingRoomState(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.getWaitingRoomState(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  it('should give binary representation of cycleStorageEquipment based on data', () => {
    const first = helpers.getCycleStorageEquipment(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.getCycleStorageEquipment(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  it('should give binary representation of sign512Equipment based on data', () => {
    const first = helpers.get512SignEquipment(equiptedStopPlace);
    expect(first).toEqual(true);

    const second = helpers.get512SignEquipment(unequiptedStopPlace);
    expect(second).toEqual(false);
  });

  it('should enable sign512Equipment prop for signEquipment on StopPlace based on data', () => {
    const payLoadTrue = {
      state: true,
      type: 'stopPlace',
      id: null,
    };

    let stopPlace = helpers.update512SignEquipment(
      unequiptedStopPlace,
      payLoadTrue,
    );

    const equipted = helpers.get512SignEquipment(stopPlace);
    expect(equipted).toEqual(true);
  });

  it('should disable sign512Equipment prop for signEquipment on StopPlace based on data', () => {
    const payLoadFalse = {
      state: false,
      type: 'stopPlace',
      id: null,
    };
    let stopPlace = helpers.update512SignEquipment(
      equiptedStopPlace,
      payLoadFalse,
    );
    const unequipted = helpers.get512SignEquipment(stopPlace);
    expect(unequipted).toEqual(false);
  });

  it('should enable sign512Equipment prop for signEquipment on Quayx based on data and index', () => {
    let unEquiptedWith512Sign = {
      quays: [],
    };

    for (let i = 0; i < 3; i++) {
      unEquiptedWith512Sign.quays.push(unequiptedStopPlace);
    }

    let equiptedWith512 = helpers.get512SignEquipment(
      unEquiptedWith512Sign.quays[0],
    );
    expect(equiptedWith512).toEqual(false);

    const payLoadTrue = {
      state: true,
      type: 'quay',
      id: 1,
    };

    let stopPlace = helpers.update512SignEquipment(
      unEquiptedWith512Sign,
      payLoadTrue,
    );

    const equiptedQuay = helpers.get512SignEquipment(stopPlace.quays[1]);
    const unEquiptedQuay = helpers.get512SignEquipment(stopPlace.quays[0]);
    expect(equiptedQuay).toEqual(true);
    expect(unEquiptedQuay).toEqual(false);
  });
});
