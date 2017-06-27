import * as types from '../actions/Types';
import { getAllowanceInfo, getAllowanceSearchInfo } from './rolesReducerUtils';

export const initialState = {};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.APOLLO_QUERY_RESULT:
      if (action.operationName === 'stopPlaceAndPathLink') {
        return Object.assign({}, state, {
          allowanceInfo: getAllowanceInfo(action.result, state.kc.tokenParsed)
        });
      } else {
        return state;
      }

    case types.SET_ACTIVE_MARKER:
      return Object.assign({}, state, {
        allowanceInfoSearchResult: getAllowanceSearchInfo(action.payLoad, state.kc.tokenParsed)
      });

    default:
      return state;
  }
};

export default rolesReducer;
