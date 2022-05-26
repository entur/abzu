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

import snackbarReducer, { initialState } from "../reducers/snackbarReducer";
import {
  APOLLO_MUTATION_ERROR,
  ERROR,
  OPENED_SNACKBAR,
} from "../actions/Types";

describe("snackbar", () => {
  test("Should open snackbar on Apollo error", () => {
    const errorMsg = "Something went wrong";

    const snackbarOptions = {
      isOpen: true,
      status: ERROR,
      errorMsg,
    };

    expect(
      snackbarReducer(undefined, {
        type: APOLLO_MUTATION_ERROR,
        error: [
          {
            message: errorMsg,
          },
        ],
      })
    ).toEqual({
      ...initialState,
      snackbarOptions: snackbarOptions,
    });
  });

  test("Should open snackbar upon success", () => {
    const snackbarOptions = {
      isOpen: true,
      errorMsg: null,
      status: "SUCCESS",
    };

    expect(
      snackbarReducer(undefined, {
        type: OPENED_SNACKBAR,
        payload: {
          status: snackbarOptions.status,
        },
      })
    ).toEqual({
      ...initialState,
      snackbarOptions,
    });
  });
});
