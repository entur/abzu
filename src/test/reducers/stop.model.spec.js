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

import QueryVariablesMapper from "../../modelUtils/mapToQueryVariables";
import { hasExpired } from "../../modelUtils/validBetween";
import stopPlaceReducer from "./../../reducers/stopPlaceReducer";
import clientStop from "./json/clientStop.json";
import stopPlaceMock from "./json/stopPlace.json";
import stopPlaceMock10Quays from "./json/stopPlaceWith10Quays.json";

window.config = {
  defaultLanguageCode: "nor",
};

describe("Model: map format from server to expected client model", () => {
  test("should map GraphQL response to client model for StopPlace", () => {
    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceMock,
      operationName: "stopPlace",
    };
    const state = stopPlaceReducer({}, action);

    expect(state.current).toMatchSnapshot();
  });

  test("should map parking to schema validated query variables", () => {
    const parking = [
      {
        name: "park&ride example",
        location: [63.207698, 11.088595],
        totalCapacity: "100",
        parkingVehicleTypes: ["car"],
        validBetween: null,
        accessibilityAssessment: {
          limitations: {
            wheelchairAccess: "UNKNOWN",
            stepFreeAccess: "TRUE",
            escalatorFreeAccess: "UNKNOWN",
            liftFreeAccess: "UNKNOWN",
            audibleSignalsAvailable: "UNKNOWN",
            visualSignsAvailable: "UNKNOWN",
          },
        },
      },
    ];

    let result = QueryVariablesMapper.mapParkingToVariables(
      parking,
      "NSR:StopPlace:1",
    );

    expect(result).toMatchSnapshot();
  });

  test("should map client stop to schema correctly", () => {
    const schemaValidStop = QueryVariablesMapper.mapStopToVariables(clientStop);
    expect(schemaValidStop).toMatchSnapshot();
  });
});

describe("Changes correct properties", () => {
  var state = {};

  beforeAll(() => {
    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceMock10Quays,
      operationName: "stopPlace",
    };
    state = stopPlaceReducer({}, action);
    expect(state.current.quays.length).toEqual(10);
  });

  test("should change property of correct quay", () => {
    for (let quayIndex = 0; quayIndex < 10; quayIndex++) {
      const newPublicCode = `new public code ${quayIndex}`;

      const changePublicCode = {
        type: "CHANGE_PUBLIC_CODE_NAME",
        payload: {
          type: "quay",
          name: newPublicCode,
          index: quayIndex,
        },
      };

      state = stopPlaceReducer(state, changePublicCode);

      expect(state.current.quays[quayIndex].publicCode).toEqual(newPublicCode);

      const stopValidWithSchema = QueryVariablesMapper.mapStopToVariables(
        state.current,
      );

      expect(state.current.quays[quayIndex].id).toEqual(
        stopValidWithSchema.quays[quayIndex].id,
      );
    }
  });

  test("Should correctly determine if a stop has expired or not based on validBetween", () => {
    const expiredDate = {
      fromDate: "2017-05-31T11:03:01.770+0200",
      toDate: "2017-05-31T11:03:01.842+0200",
    };

    const hasStopExpired = hasExpired(expiredDate);

    expect(hasStopExpired).toEqual(true);

    const validDate = {
      fromDate: "2017-05-31T11:03:01.770+0200",
      toDate: null,
    };

    const hasStopExpired2 = hasExpired(validDate);

    expect(hasStopExpired2).toEqual(false);
  });
});
