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

import * as types from "../../actions/Types";
import { stopPlaceReducer } from "./../../reducers/";
import stopPlaceData from "./json/stopPlace.json";

describe("stop place reducer", () => {
  test("should create new stop with coordinates", () => {
    const location = [40, 10];

    const action = {
      type: types.CREATED_NEW_STOP,
      payLoad: {
        location,
        isMultimodal: false,
      },
    };

    const state = stopPlaceReducer({}, action);
    expect(state.newStop.location).toEqual(location);
  });

  test("update stop name should not mutate state", () => {
    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceData,
      operationName: "stopPlace",
    };
    const stateBefore = stopPlaceReducer({}, action);

    const changeNameAction = {
      type: types.CHANGED_STOP_NAME,
      payLoad: "new stop name",
    };
    const stateAfter = stopPlaceReducer(stateBefore, changeNameAction);

    expect(stateAfter).not.toEqual(stateBefore);
    expect(stateAfter.current).not.toEqual(stateBefore.current);
    expect(stateAfter.current.name).toEqual("new stop name");
  });

  test("update to stop description should not mutate state", () => {
    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceData,
      operationName: "stopPlace",
    };
    const stateBefore = stopPlaceReducer({}, action);

    const changeNameAction = {
      type: types.CHANGED_STOP_DESCRIPTION,
      payLoad: "new description",
    };
    const stateAfter = stopPlaceReducer(stateBefore, changeNameAction);

    expect(stateAfter).not.toEqual(stateBefore);
    expect(stateAfter.current).not.toEqual(stateBefore.current);
    expect(stateAfter.current.description).toEqual("new description");
  });

  test("update to stop location should not mutate state", () => {
    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceData,
      operationName: "stopPlace",
    };

    const newDehli = [28.6448, 77.216721];

    const stateBefore = stopPlaceReducer({}, action);

    const changeNameAction = {
      type: types.CHANGED_ACTIVE_STOP_POSITION,
      payLoad: { location: newDehli },
    };
    const stateAfter = stopPlaceReducer(stateBefore, changeNameAction);

    expect(stateAfter).not.toEqual(stateBefore);
    expect(stateAfter.current).not.toEqual(stateBefore.current);
    expect(stateAfter.current.location).toEqual(newDehli);
  });

  test("should restore stop upon discarding changes", () => {
    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceData,
      operationName: "stopPlace",
    };
    const stateBefore = stopPlaceReducer({}, action);

    expect(stateBefore.originalCurrent).toEqual(stateBefore.current);

    const changeNameAction = {
      type: types.CHANGED_STOP_DESCRIPTION,
      payLoad: "awesome description",
    };
    const stateAfter = stopPlaceReducer(stateBefore, changeNameAction);

    expect(stateAfter.originalCurrent).not.toEqual(stateAfter.current);
    expect(stateAfter.stopHasBeenModified).toEqual(true);

    const restoreAction = {
      type: types.RESTORED_TO_ORIGINAL_STOP_PLACE,
      payLoad: null,
    };

    const finalState = stopPlaceReducer(stateAfter, restoreAction);

    expect(finalState.originalCurrent).toEqual(finalState.current);
  });
});
