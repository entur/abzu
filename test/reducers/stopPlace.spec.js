import * as types from '../../actions/Types';
import expect from 'expect';
import { stopPlaceReducer } from './../../reducers/';
import stopPlaceData from './json/stopPlace.json';

describe('stop place reducer', () => {
  it('should create new stop with coordinates', () => {
    const location = [40, 10];

    const action = {
      type: types.CREATED_NEW_STOP,
      payLoad: location,
    };

    const state = stopPlaceReducer({}, action);
    expect(state.newStop.location).toEqual(location);
  });

  it('update stop name should not mutate state', () => {
    const action = {
      type: 'APOLLO_QUERY_RESULT',
      result: stopPlaceData,
      operationName: 'stopPlace',
    };
    const stateBefore = stopPlaceReducer({}, action);

    const changeNameAction = {
      type: types.CHANGED_STOP_NAME,
      payLoad: 'new stop name',
    };
    const stateAfter = stopPlaceReducer(stateBefore, changeNameAction);

    expect(stateAfter).toNotEqual(stateBefore);
    expect(stateAfter.current).toNotEqual(stateBefore.current);
    expect(stateAfter.current.name).toEqual('new stop name');
  });

  it('update to stop description should not mutate state', () => {
    const action = {
      type: 'APOLLO_QUERY_RESULT',
      result: stopPlaceData,
      operationName: 'stopPlace',
    };
    const stateBefore = stopPlaceReducer({}, action);

    const changeNameAction = {
      type: types.CHANGED_STOP_DESCRIPTION,
      payLoad: 'new description',
    };
    const stateAfter = stopPlaceReducer(stateBefore, changeNameAction);

    expect(stateAfter).toNotEqual(stateBefore);
    expect(stateAfter.current).toNotEqual(stateBefore.current);
    expect(stateAfter.current.description).toEqual('new description');
  });

  it('update to stop location should not mutate state', () => {
    const action = {
      type: 'APOLLO_QUERY_RESULT',
      result: stopPlaceData,
      operationName: 'stopPlace',
    };

    const newDehli = [28.6448, 77.216721];

    const stateBefore = stopPlaceReducer({}, action);

    const changeNameAction = {
      type: types.CHANGED_ACTIVE_STOP_POSITION,
      payLoad: { location: newDehli },
    };
    const stateAfter = stopPlaceReducer(stateBefore, changeNameAction);

    expect(stateAfter).toNotEqual(stateBefore);
    expect(stateAfter.current).toNotEqual(stateBefore.current);
    expect(stateAfter.current.location).toEqual(newDehli);
  });

  it('should restore stop upon discarding changes', () => {
    const action = {
      type: 'APOLLO_QUERY_RESULT',
      result: stopPlaceData,
      operationName: 'stopPlace',
    };
    const stateBefore = stopPlaceReducer({}, action);

    expect(stateBefore.originalCurrent).toEqual(stateBefore.current);

    const changeNameAction = {
      type: types.CHANGED_STOP_DESCRIPTION,
      payLoad: 'awesome description',
    };
    const stateAfter = stopPlaceReducer(stateBefore, changeNameAction);

    expect(stateAfter.originalCurrent).toNotEqual(stateAfter.current);
    expect(stateAfter.stopHasBeenModified).toEqual(true);

    const restoreAction = {
      type: types.RESTORED_TO_ORIGINAL_STOP_PLACE,
      payLoad: null,
    };

    const finalState = stopPlaceReducer(stateAfter, restoreAction);

    expect(finalState.originalCurrent).toEqual(finalState.current);
  });
});
