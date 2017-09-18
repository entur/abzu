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
