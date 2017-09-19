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

import * as types from './Types';
import * as limitations from '../models/Limitations';

var AssessmentActions = {};

const sendData = (type, payLoad) => ({
  type: type,
  payLoad: payLoad,
});

AssessmentActions.setStopWheelchairAccess = value => dispatch => {
  dispatch(
    sendData(types.CHANGED_STOP_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      limitationType: limitations.wheelchairAccess,
    }),
  );
};

AssessmentActions.setStopStepFreeAccess = value => dispatch => {
  dispatch(
    sendData(types.CHANGED_STOP_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      limitationType: limitations.stepFreeAccess,
    }),
  );
};

AssessmentActions.setQuayWheelchairAccess = (value, index) => dispatch => {
  dispatch(
    sendData(types.CHANGED_QUAY_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      index: index,
      limitationType: limitations.wheelchairAccess,
    }),
  );
};

AssessmentActions.setQuayStepFreeAccess = (value, index) => dispatch => {
  dispatch(
    sendData(types.CHANGED_QUAY_ACCESSIBLITY_ASSESSMENT, {
      value: value,
      index: index,
      limitationType: limitations.stepFreeAccess,
    }),
  );
};

export default AssessmentActions;
