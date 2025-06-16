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

import * as limitations from "../models/Limitations";
import { createThunk } from "./";
import * as types from "./Types";

var AssessmentActions = {};

AssessmentActions.setStopWheelchairAccess = (value) => (dispatch) => {
  dispatch(
    createThunk(types.CHANGED_STOP_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      limitationType: limitations.wheelchairAccess,
    }),
  );
};

AssessmentActions.setStopStepFreeAccess = (value) => (dispatch) => {
  dispatch(
    createThunk(types.CHANGED_STOP_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      limitationType: limitations.stepFreeAccess,
    }),
  );
};

AssessmentActions.setStopAudibleSignalsAvailable = (value) => (dispatch) => {
  dispatch(
    createThunk(types.CHANGED_STOP_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      limitationType: limitations.audibleSignalsAvailable,
    }),
  );
};

AssessmentActions.setQuayWheelchairAccess = (value, index) => (dispatch) => {
  dispatch(
    createThunk(types.CHANGED_QUAY_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      index: index,
      limitationType: limitations.wheelchairAccess,
    }),
  );
};

AssessmentActions.setQuayStepFreeAccess = (value, index) => (dispatch) => {
  dispatch(
    createThunk(types.CHANGED_QUAY_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      index: index,
      limitationType: limitations.stepFreeAccess,
    }),
  );
};

AssessmentActions.setQuayAudibleSignalsAvailable =
  (value, index) => (dispatch) => {
    dispatch(
      createThunk(types.CHANGED_QUAY_ACCESSIBLITY_ASSESSMENT, {
        value: value,
        index: index,
        limitationType: limitations.audibleSignalsAvailable,
      }),
    );
  };

export default AssessmentActions;
