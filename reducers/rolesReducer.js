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

import * as types from '../actions/Types';
import { getAllowanceInfoForStop, getAllowanceSearchInfo, getAllowInfoNewStop } from './rolesReducerUtils';

export const initialState = {};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.APOLLO_QUERY_RESULT:
      if (action.operationName === 'stopPlaceAndPathLink') {
        return Object.assign({}, state, {
          kc: state.kc,
          allowanceInfo: getAllowanceInfoForStop(action.result, state.kc.tokenParsed)
        });
      } else {
        return state;
      }

    case types.SET_ACTIVE_MARKER:
      return Object.assign({}, state, {
        ...state,
        kc: state.kc,
        allowanceInfoSearchResult: getAllowanceSearchInfo(action.payLoad, state.kc.tokenParsed)
      });

    case types.USE_NEW_STOP_AS_CURENT:
      return Object.assign(({}, state, {
        ...state,
        kc: state.kc,
        allowanceInfo: getAllowInfoNewStop(action.payLoad, state.kc.tokenParsed)
      }))

    case types.CREATE_NEW_MULTIMODAL_STOP_FROM_EXISTING:
      return Object.assign(({}, state, {
        ...state,
        kc: state.kc,
        allowanceInfo: getAllowInfoNewStop(action.payLoad, state.kc.tokenParsed)
      }))

    default:
      return state;
  }
};

export default rolesReducer;
