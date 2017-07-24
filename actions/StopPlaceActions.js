import * as types from './Types';
import { getCentroid } from '../utils/mapUtils';
import { UserActions } from './'

var StopPlaceActions = {};

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad,
  };
};

StopPlaceActions.changeLocationNewStop = location => dispatch => {
  dispatch(
    sendData(types.CHANGED_LOCATION_NEW_STOP, [location.lat, location.lng]),
  );
};

StopPlaceActions.useNewStopAsCurrent = () => dispatch => {
  dispatch(sendData(types.USE_NEW_STOP_AS_CURENT, null));
};

StopPlaceActions.changeStopName = name => dispatch => {
  dispatch(sendData(types.CHANGED_STOP_NAME, name));
};

StopPlaceActions.changeStopDescription = description => dispatch => {
  dispatch(sendData(types.CHANGED_STOP_DESCRIPTION, description));
};

StopPlaceActions.changeStopType = type => dispatch => {
  dispatch(sendData(types.CHANGED_STOP_TYPE, type));
};

StopPlaceActions.changeSubmode = (stopPlaceType, transportMode, submode) => dispatch => {
  dispatch(sendData(types.CHANGED_STOP_SUBMODE, {
    stopPlaceType,
    transportMode,
    submode
  }));
}

StopPlaceActions.updateKeyValuesForKey = (key, values) => (dispatch, getState) => {
  let state = getState();
  let origin = state.user.keyValuesOrigin;

  dispatch(sendData(types.UPDATED_KEY_VALUES_FOR_KEY, {
    key,
    values,
    origin
  }));
};

StopPlaceActions.deleteKeyValuesByKey = key => (dispatch, getState) => {
  let state = getState();
  let origin = state.user.keyValuesOrigin;

  dispatch(sendData(types.DELETED_KEY_VALUES_BY_KEY, {
    key,
    origin
  }));
}

StopPlaceActions.createKeyValuesPair = (key, values) => (dispatch, getState) => {
  let state = getState();
  let origin = state.user.keyValuesOrigin;

  dispatch(sendData(types.CREATED_KEY_VALUES_PAIR, {
    key,
    values,
    origin
  }));
}

StopPlaceActions.setMarkerOnMap = marker => dispatch => {
  let activeMarker = JSON.parse(JSON.stringify(marker));
  activeMarker.isActive = true;
  dispatch(sendData(types.SET_ACTIVE_MARKER, activeMarker));
};

StopPlaceActions.changeMapCenter = (position, zoom) => dispatch => {
  dispatch(sendData(types.CHANGED_MAP_CENTER, {
    position,
    zoom
  }));
};

StopPlaceActions.addAltName = payLoad => dispatch => {
  dispatch(sendData(types.ADDED_ALT_NAME, payLoad));
};

StopPlaceActions.removeAltName = index => dispatch => {
  dispatch(sendData(types.REMOVED_ALT_NAME, index));
};

StopPlaceActions.removeElementByType = (index, type) => dispatch => {
  dispatch(
    sendData(types.REMOVED_ELEMENT_BY_TYPE, {
      index: index,
      type: type,
    }),
  );
};

StopPlaceActions.openParkingElement = index => dispatch => {
  dispatch(
    sendData(types.OPEN_PARKING_ELEMENT, index)
  );
}

StopPlaceActions.changePublicCodeName = (index, name, type) => dispatch => {
  dispatch(
    sendData(types.CHANGE_PUBLIC_CODE_NAME, {
      name: name,
      index: index,
      type: type,
    }),
  );
};

StopPlaceActions.changePrivateCodeName = (index, name, type) => dispatch => {
  dispatch(
    sendData(types.CHANGE_PRIVATE_CODE_NAME, {
      name: name,
      index: index,
      type: type,
    }),
  );
};

StopPlaceActions.changeCurrentStopPosition = position => dispatch => {
  dispatch(
    sendData(types.CHANGED_ACTIVE_STOP_POSITION, {
      location: position,
    }),
  );
};

StopPlaceActions.changeWeightingForStop = value => dispatch => {
  dispatch(sendData(types.CHANGED_WEIGHTING_STOP_PLACE, value));
};

StopPlaceActions.changeElementDescription = (
  index,
  description,
  type,
) => dispatch => {
  dispatch(
    sendData(types.CHANGED_ELEMENT_DESCRIPTION, {
      index: index,
      description: description,
      type: type,
    }),
  );
};

StopPlaceActions.changeQuayCompassBearing = (
  index,
  compassBearing,
) => dispatch => {
  dispatch(
    sendData(types.CHANGED_QUAY_COMPASS_BEARING, {
      index: index,
      compassBearing: compassBearing,
    }),
  );
};

StopPlaceActions.setElementFocus = (index, type) => (dispatch, getState) => {

  let state = getState();
  let keyValuesDialogOpen = state.user.keyValuesDialogOpen;
  let keyValuesOrigin = state.user.keyValuesOrigin;

  if (index > -1 && type === 'quay' && keyValuesDialogOpen && keyValuesOrigin && keyValuesOrigin.type === 'quay') {
    dispatch(UserActions.closeKeyValuesDialog());
  }

  dispatch(
    sendData(types.SET_FOCUS_ON_ELEMENT, {
      index: index,
      type: type,
    }),
  );
};

StopPlaceActions.createNewStop = location => dispatch => {
  dispatch(
    sendData(types.CREATED_NEW_STOP, [
      Number(location.lat),
      Number(location.lng),
    ]),
  );
};

StopPlaceActions.discardChangesForEditingStop = () => dispatch => {
  dispatch(sendData(types.RESTORED_TO_ORIGINAL_STOP_PLACE, null));
};

StopPlaceActions.setActiveMap = map => dispatch => {
  dispatch(sendData(types.SET_ACTIVE_MAP, map));
};

StopPlaceActions.addElementToStop = (type, position) => dispatch => {
  if (type === 'stop_place') {
    dispatch(
      sendData(types.CHANGED_ACTIVE_STOP_POSITION, {
        location: position,
      }),
    );
  } else {
    dispatch(
      sendData(types.ADDED_JUNCTION_ELEMENT, {
        type,
        position,
      }),
    );
  }
};

StopPlaceActions.changeElementPosition = (
  index,
  type,
  position,
) => dispatch => {
  dispatch(
    sendData(types.CHANGE_ELEMENT_POSITION, {
      index,
      position,
      type,
    }),
  );
};

StopPlaceActions.changeParkingTotalCapacity = (
  index,
  totalCapacity,
) => dispatch => {
  dispatch(
    sendData(types.CHANGED_PARKING_TOTAL_CAPACITY, {
      index,
      totalCapacity,
    }),
  );
};

StopPlaceActions.changeParkingName = (index, name) => dispatch => {
  dispatch(
    sendData(types.CHANGED_PARKING_NAME, {
      index,
      name,
    }),
  );
};

StopPlaceActions.adjustCentroid = () => (dispatch, getState) => {
  let state = getState();
  let quays = state.stopPlace.current.quays;
  let originalCentroid = state.stopPlace.current.location;

  let latlngs = quays.map( quay => quay.location);
  let centroid = getCentroid(latlngs, originalCentroid);

  dispatch(StopPlaceActions.changeCurrentStopPosition(centroid));
};


export default StopPlaceActions;
