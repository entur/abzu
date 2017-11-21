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
import { createThunk } from './';
import { getAddStopPlaceInfo } from '../graphql/Actions';


var StopPlacesGroupActions = {};

StopPlacesGroupActions.changeName = name => dispatch => {
  dispatch(createThunk(
    types.CHANGED_STOP_PLACE_GROUP_NAME,
    name
  ));
};

StopPlacesGroupActions.changeDescription = description => dispatch => {
  dispatch(createThunk(
    types.CHANGED_STOP_PLACE_GROUP_DESCRIPTION,
    description
  ));
};

StopPlacesGroupActions.removeMemberFromGroup = stopPlaceId => dispatch => {
  dispatch(createThunk(types.REMOVED_GROUP_MEMBER, stopPlaceId));
};

StopPlacesGroupActions.addMemberToGroup = (client, stopPlaceId) => dispatch => {
  dispatch(createThunk(types.REQUESTED_MEMBER_INFO, null));
  getAddStopPlaceInfo(client, [stopPlaceId]).then(result => {
    dispatch(createThunk(types.RECEIVED_MEMBER_INFO, result));
  });
};


export default StopPlacesGroupActions;