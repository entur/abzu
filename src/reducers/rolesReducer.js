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

import * as types from "../actions/Types";
import {
  getAllowanceInfoForGroup,
  getAllowanceSearchInfo,
  getAllowanceInfoFromPosition,
  getAllowanceInfoForStop,
  getLatLng,
  reduceFetchedPolygons,
} from "./rolesReducerUtils";

export const initialState = {};

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.APOLLO_QUERY_RESULT:
      if (action.operationName === "stopPlaceAndPathLink") {
        return Object.assign({}, state, {
          auth: state.auth,
          allowanceInfo: getAllowanceInfoForStop(action, state),
        });
      } else if (action.operationName === "getGroupOfStopPlaces") {
        return Object.assign({}, state, {
          auth: state.auth,
          allowanceInfo: getAllowanceInfoForGroup(action.result, state),
        });
      } else if (action.operationName === "getPolygons") {
        return Object.assign({}, state, {
          ...state,
          fetchedPolygons: reduceFetchedPolygons(action.result),
        });
      } else {
        return state;
      }

    case types.SET_ACTIVE_MARKER:
      return Object.assign({}, state, {
        ...state,
        auth: state.auth,
        allowanceInfoSearchResult: getAllowanceSearchInfo(
          action.payLoad,
          state.auth.roleAssignments
        ),
        allowanceInfo: {
          ...state.allowanceInfo,
          ...getAllowanceInfoFromPosition(action.payLoad.location),
        },
      });

    case types.SETUP_NEW_GROUP:
      return Object.assign({}, state, {
        ...state,
        auth: state.auth,
        allowanceInfo: getAllowanceInfoFromPosition(
          getLatLng(action.payLoad.data.stopPlace[0]),
          state.auth.roleAssignments
        ),
      });

    case types.USE_NEW_STOP_AS_CURRENT:
      return Object.assign({}, state, {
        ...state,
        auth: state.auth,
        allowanceInfo: getAllowanceInfoFromPosition(
          action.payLoad,
          state.auth.roleAssignments
        ),
      });

    case types.CREATE_NEW_MULTIMODAL_STOP_FROM_EXISTING:
      const { newStopPlace } = action.payLoad;
      return Object.assign({}, state, {
        ...state,
        auth: state.auth,
        allowanceInfo: getAllowanceInfoFromPosition(
          newStopPlace.location,
          state.auth.roleAssignments
        ),
      });

    default:
      return state;
  }
};

export default rolesReducer;
