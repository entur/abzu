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
import { userReducer } from "./../../reducers/";
import { initialState } from "./../../reducers/userReducer";

describe("user reducer", () => {
  test("Should return the initial state", () => {
    expect(userReducer(undefined, {})).toEqual(initialState);
  });

  test("Should navigate to path", () => {
    const editPathChange = {
      type: types.NAVIGATE_TO,
      payLoad: "/stop_place/",
    };

    expect(userReducer(undefined, editPathChange)).toEqual({
      ...initialState,
      path: "/stop_place/",
    });
  });

  test("Should toggle new stop form visibility", () => {
    expect(
      userReducer(undefined, {
        type: types.TOGGLED_IS_CREATING_NEW_STOP,
        payLoad: false,
      })
    ).toEqual({
      ...initialState,
      isCreatingNewStop: true,
    });
  });

  test("Should apply search filters", () => {
    const filters = [];

    expect(
      userReducer(undefined, {
        type: types.APPLIED_STOPTYPE_SEARCH_FILTER,
        payLoad: filters,
      })
    ).toEqual({
      ...initialState,
      searchFilters: { ...initialState.searchFilters, stopType: filters },
    });
  });

  test("Should change localization", () => {
    const localization = {
      locale: "nb",
      message: [],
    };

    expect(
      userReducer(undefined, {
        type: types.CHANGED_LOCALIZATION,
        payLoad: localization,
      })
    ).toEqual({
      ...initialState,
      localization: localization,
    });
  });

  test("Should apply language change", () => {
    const locale = "nb";

    expect(
      userReducer(undefined, {
        type: types.APPLIED_LOCALE,
        payLoad: locale,
      })
    ).toEqual({
      ...initialState,
      appliedLocale: locale,
    });
  });

  test("Should set active baselayer for maps", () => {
    let newBaselayer = "OpenStreetMap";

    expect(
      userReducer(undefined, {
        type: types.CHANGED_ACTIVE_BASELAYER,
        payLoad: newBaselayer,
      })
    ).toEqual({
      ...initialState,
      activeBaselayer: newBaselayer,
    });
  });
});
