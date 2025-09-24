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
import { defaultCenterPosition } from "../components/Map/mapDefaults";
import { calculatePolygonCenter } from "../utils/mapUtils";
import {
  addMemberToGroup,
  getGroupOfStopPlace,
  removeMemberFromGroup,
} from "./groupReducerUtils";

const newGroup = {
  name: "",
  description: "",
  members: [],
};

/**
 * If a custom centerPosition is set in bootstrap.json, it's going to override this initial value
 */
export const initialState = {
  current: Object.assign({}, newGroup),
  original: Object.assign({}, newGroup),
  isModified: false,
  isFetchingMember: false,
  centerPosition: defaultCenterPosition,
  sourceForNewGroup: null,
};

const groupOfStopPlacesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.APOLLO_QUERY_RESULT:
    case types.APOLLO_MUTATION_RESULT:
      return getGroupOfStopPlace(state, action);

    case types.REQUESTED_MEMBER_INFO:
      return Object.assign({}, state, {
        isFetchingMember: true,
      });

    case types.DISCARDED_GOS_CHANGES:
      return Object.assign({}, state, {
        current: Object.assign({}, state.original),
        isModified: false,
      });

    case types.RECEIVED_MEMBER_INFO:
      return Object.assign({}, state, {
        isFetchingMember: false,
        current: addMemberToGroup(state.current, action.payload),
        isModified: true,
      });

    case types.RECEIVED_MEMBERS_INFO:
      return Object.assign({}, state, {
        isFetchingMember: false,
        current: addMemberToGroup(state.current, action.payload),
        isModified: true,
      });

    case types.REMOVED_GROUP_MEMBER:
      return Object.assign({}, state, {
        isFetchingMember: false,
        current: removeMemberFromGroup(state.current, action.payload),
        isModified: true,
      });

    case types.CHANGED_STOP_PLACE_GROUP_NAME:
      return Object.assign({}, state, {
        current: {
          ...state.current,
          name: action.payload,
        },
        isModified: true,
      });

    case types.SETUP_NEW_GROUP:
      const newCreatedGroup = addMemberToGroup(newGroup, action.payload);
      return Object.assign({}, state, {
        current: newCreatedGroup,
        original: Object.assign({}, newCreatedGroup),
        isModified: false,
        notFound: false,
        centerPosition: calculatePolygonCenter(newCreatedGroup.members),
        zoom: 16,
      });

    case types.CHANGED_STOP_PLACE_GROUP_DESCRIPTION:
      return Object.assign({}, state, {
        current: {
          ...state.current,
          description: action.payload,
        },
        isModified: true,
      });

    case types.CHANGED_STOP_PLACE_GROUP_PURPOSE_OF_GROUPING:
      return Object.assign({}, state, {
        current: {
          ...state.current,
          purposeOfGrouping: action.payload,
        },
        isModified: true,
      });

    case types.CREATED_NEW_GROUP_OF_STOP_PLACES:
      return Object.assign({}, state, {
        sourceForNewGroup: action.payload,
      });

    case types.ERROR_NEW_GROUP:
      return Object.assign({}, state, {
        sourceForNewGroup: null,
      });

    case types.NAVIGATE_TO:
      if (action.payload === "") {
        return Object.assign({}, state, {
          sourceForNewGroup: null,
          current: newGroup,
        });
      } else {
        return state;
      }

    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, {
        centerPosition: action.payload.position,
      });

    default:
      return state;
  }
};

export default groupOfStopPlacesReducer;
