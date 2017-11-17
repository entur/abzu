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

const newGroup = {
  name: '',
  description: '',
  members: []
};

export const initialState = {
  current: newGroup,
  isModified: false
};

const groupOfStopPlacesReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CHANGED_STOP_PLACE_GROUP_NAME:
      return Object.assign({}, state, {
        current: {
          ...state.current,
          name: action.payLoad
        },
        isModified: true
      });

    case types.CHANGED_STOP_PLACE_GROUP_DESCRIPTION:
      return Object.assign({}, state, {
        current: {
          ...state.current,
          description: action.payLoad
        },
        isModified: true
      });

    default:
      return state;
  }
};

export default groupOfStopPlacesReducer;
