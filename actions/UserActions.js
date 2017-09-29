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
import { browserHistory } from 'react-router';
import configureLocalization from '../localization/localization';
import FavoriteManager from '../singletons/FavoriteManager';
import SettingsManager from '../singletons/SettingsManager';
import { getMergeInfoForStops, getAddStopPlaceInfo } from '../graphql/Actions';
import { getIn } from '../utils/';
import ParentStopPlace from '../models/ParentStopPlace';

var UserActions = {};

let Settings = new SettingsManager();

const sendData = (type, payLoad) => ({
  type: type,
  payLoad: payLoad
});

const goToRoute = (path, id) => {
  const basePath = window.config.endpointBase;
  if (path.length && path[0] === '/') {
    path = path.slice(1);
  }
  browserHistory.push(basePath + path + id);
}

UserActions.navigateTo = (path, id) => dispatch => {
  dispatch(sendData(types.NAVIGATE_TO, id));
  goToRoute(path, id);
};

UserActions.toggleShowFutureAndExpired = value => dispatch => {
  dispatch(sendData(types.TOGGLE_SHOW_FUTURE_AND_EXPIRED, value));
}

UserActions.navigateToMainAfterDelete = () => dispatch => {
  dispatch(sendData(types.NAVIGATE_TO_MAIN_AFTER_DELETE, null));
  goToRoute('/','');
};

UserActions.closeLookupCoordinatesDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_LOOKUP_COORDINATES_DIALOG, null));
};

UserActions.openLookupCoordinatesDialog = () => dispatch => {
  dispatch(sendData(types.OPEN_LOOKUP_COORDINATES_DIALOG, null));
};

UserActions.openSuccessfullyCreatedNewStop = stopPlaceId => dispatch => {
  dispatch(sendData(types.SHOW_CREATED_NEW_STOP_INFO, stopPlaceId));
};

UserActions.closeSuccessfullyCreatedNewStop = () => dispatch => {
  dispatch(sendData(types.HIDE_CREATED_NEW_STOP_INFO, null));
};

UserActions.clearSearchResults = () => dispatch => {
  dispatch(sendData(types.CLEAR_SEARCH_RESULTS, null));
};

UserActions.hideEditStopAdditional = () => dispatch => {
  dispatch(sendData(types.HID_EDIT_STOP_ADDITIONAL, null));
};

UserActions.showEditStopAdditional = () => dispatch => {
  dispatch(sendData(types.SHOW_EDIT_STOP_ADDITIONAL, null));
};

UserActions.hideEditQuayAdditional = () => dispatch => {
  dispatch(sendData(types.HID_EDIT_QUAY_ADDITIONAL, null));
};

UserActions.showEditQuayAdditional = () => dispatch => {
  dispatch(sendData(types.SHOW_EDIT_QUAY_ADDITIONAL, null));
};

UserActions.toggleIsCreatingNewStop = isMultiModal => (dispatch, getState) => {
  const state = getState();
  const isCreatingNewStop = state.user.isCreatingNewStop;

  if (isCreatingNewStop) {
    dispatch(sendData(types.DESTROYED_NEW_STOP, null));
  }
  dispatch(sendData(types.TOGGLED_IS_CREATING_NEW_STOP, isMultiModal));
};

UserActions.toggleMultimodalEdges = value => dispatch => {
  Settings.setShowMultimodalEdges(value);
  dispatch(sendData(types.TOGGLED_IS_MULTIMODAL_EDGES_ENABLED, value));
}

UserActions.togglePathLinksEnabled = value => dispatch => {
  Settings.setShowPathLinks(value);
  dispatch(sendData(types.TOGGLED_IS_MULTIPOLYLINES_ENABLED, value));
};

UserActions.toggleCompassBearingEnabled = value => dispatch => {
  Settings.setShowCompassBearing(value);
  dispatch(sendData(types.TOGGLED_IS_COMPASS_BEARING_ENABLED, value));
};

UserActions.toggleExpiredShowExpiredStops = value => dispatch => {
  Settings.setShowExpiredStops(value);
  dispatch(sendData(types.TOGGLED_IS_SHOW_EXPIRED_STOPS, value));
};

UserActions.applyStopTypeSearchFilter = filters => dispatch => {
  dispatch(sendData(types.APPLIED_STOPTYPE_SEARCH_FILTER, filters));
};

UserActions.openSnackbar = (message, status) => dispatch => {
  dispatch(sendData(types.OPENED_SNACKBAR, { message, status }));
};

UserActions.dismissSnackbar = () => dispatch => {
  dispatch(sendData(types.DISMISSED_SNACKBAR, null));
};

UserActions.applyLocale = locale => dispatch => {
  dispatch(sendData(types.APPLIED_LOCALE, locale));
  configureLocalization(locale).then(localization => {
    dispatch(UserActions.changeLocalization(localization));
  });
};

UserActions.changeLocalization = localization => dispatch => {
  dispatch(sendData(types.CHANGED_LOCALIZATION, localization));
};

UserActions.hideQuaysForNeighbourStop = id => dispatch => {
  dispatch(sendData(types.HID_QUAYS_FOR_NEIGHBOUR_STOP, id));
};

UserActions.addToposChip = chip => dispatch => {
  if (typeof chip.text !== 'undefined' && typeof chip.type !== 'undefined')
    dispatch(sendData(types.ADDED_TOPOS_CHIP, chip));
};

UserActions.setToposchips = chips => dispatch => {
  dispatch(sendData(types.SET_TOPOS_CHIPS, chips));
};

UserActions.setStopPlaceTypes = stopPlaces => dispatch => {
  dispatch(sendData(types.SET_STOP_PLACE_TYPES, stopPlaces));
};

UserActions.deleteChip = key => dispatch => {
  dispatch(sendData(types.DELETED_TOPOS_CHIP, key));
};

UserActions.setCenterAndZoom = (position, zoom) => (dispatch, getState) => {
  const state = getState();
  let newZoom = zoom || state.stopPlace.zoom;
  dispatch(sendData(types.SET_CENTER_AND_ZOOM, { position, zoom: newZoom }));
};

UserActions.saveSearchAsFavorite = title => (dispatch, getState) => {
  const state = getState();
  const searchFilters = state.user.searchFilters;
  let favoriteManager = new FavoriteManager();
  let savableContent = favoriteManager.createSavableContent(
    title,
    searchFilters.text,
    searchFilters.stopType,
    searchFilters.topoiChips,
    searchFilters.showFutureAndExpired
  );
  favoriteManager.save(savableContent);
  dispatch(UserActions.closeFavoriteNameDialog());
};

UserActions.removeSearchAsFavorite = item => dispatch => {
  let favoriteManager = new FavoriteManager();
  favoriteManager.remove(item);
  dispatch(sendData(types.REMOVE_SEARCH_AS_FAVORITE, item));
};

UserActions.setSearchText = text => dispatch => {
  dispatch(sendData(types.SET_SEARCH_TEXT, text));
};

UserActions.setMissingCoordinates = (position, stopPlaceId) => dispatch => {
  dispatch(
    sendData(types.SET_MISSING_COORDINATES, {
      stopPlaceId: stopPlaceId,
      position: position
    })
  );
};

UserActions.loadFavoriteSearch = favorite => dispatch => {
  dispatch(UserActions.setToposchips(favorite.topoiChips));
  dispatch(UserActions.setStopPlaceTypes(favorite.stopType));
  dispatch(UserActions.setSearchText(favorite.searchText));
  dispatch(UserActions.toggleShowFutureAndExpired(favorite.showFutureAndExpired));
};

UserActions.openFavoriteNameDialog = () => dispatch => {
  dispatch(sendData(types.OPENED_FAVORITE_NAME_DIALOG, null));
};

UserActions.closeFavoriteNameDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_FAVORITE_NAME_DIALOG, null));
};

UserActions.changeActiveBaselayer = layer => dispatch => {
  Settings.setMapLayer(layer);
  dispatch(sendData(types.CHANGED_ACTIVE_BASELAYER, layer));
};

UserActions.removeStopsNearbyForOverview = () => dispatch => {
  dispatch(sendData(types.REMOVED_STOPS_NEARBY_FOR_OVERVIEW, null));
};

UserActions.startCreatingPolyline = (coordinates, id, type) => dispatch => {
  dispatch(
    sendData(types.STARTED_CREATING_POLYLINE, {
      coordinates: coordinates,
      id: id,
      type: type
    })
  );
};

UserActions.removeAllFilters = () => dispatch => {
  dispatch(
    sendData(types.REMOVED_ALL_FILTERS, null)
  )
};

UserActions.addCoordinatesToPolylines = coords => dispatch => {
  dispatch(sendData(types.ADDED_COORDINATES_TO_POLYLINE, coords));
};

UserActions.addFinalCoordinesToPolylines = (coords, id, type) => dispatch => {
  dispatch(
    sendData(types.ADDED_FINAL_COORDINATES_TO_POLYLINE, {
      coordinates: coords,
      id: id,
      type: type
    })
  );
};

UserActions.removePolylineFromIndex = index => dispatch => {
  dispatch(sendData(types.REMOVED_POLYLINE_FROM_INDEX, index));
};

UserActions.removeLastPolyline = () => dispatch => {
  dispatch(sendData(types.REMOVED_LAST_POLYLINE, null));
};

UserActions.editPolylineTimeEstimate = (index, seconds) => dispatch => {
  dispatch(
    sendData(types.EDITED_TIME_ESTIMATE_FOR_POLYLINE, {
      index: index,
      estimate: seconds
    })
  );
};

UserActions.changeElementTypeTab = value => dispatch => {
  dispatch(sendData(types.CHANGED_ELEMENT_TYPE_TAB, value));
};

UserActions.changeElementTypeTabByType = type => dispatch => {
  let typesMap = {
    'quay': 0,
    'entrance': 1,
    'pathJunction': 1,
    'parking': 2
  };
  let value = typesMap[type] || 0;
  dispatch(UserActions.changeElementTypeTab(value));
}

UserActions.showMergeStopDialog = (fromStopPlaceID, name) => (dispatch, getState) => {

  let state = getState();
  let client = state.user.client;

  dispatch(
    sendData(types.OPENED_MERGE_STOP_DIALOG, {
      id: fromStopPlaceID,
      name: name,
    })
  );

  if (client) {
    getMergeInfoForStops(client, fromStopPlaceID).then( response => {
      dispatch(
        sendData(types.OPENED_MERGE_STOP_DIALOG, {
          id: fromStopPlaceID,
          name: name,
          quays: getQuaysForMergeInfo(response.data.stopPlace)
        })
      );
    }).catch( err => { console.log(err); });
  }
};

UserActions.hideMergeStopDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_MERGE_STOP_DIALOG, null));
};

UserActions.hideMergeQuaysDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_MERGE_QUAYS_DIALOG, null));
};

UserActions.startMergingQuayFrom = id => (dispatch, getState) => {
  let state = getState();
  let quays = state.stopPlace.current.quays;
  let quay = getQuayById(quays, id);
  dispatch(sendData(types.STARTED_MERGING_QUAY_FROM, quay));
};

UserActions.endMergingQuayTo = id => (dispatch, getState) => {
  let state = getState();
  let quays = state.stopPlace.current.quays;
  let quay = getQuayById(quays, id);
  dispatch(sendData(types.ENDED_MERGING_QUAY_TO, quay));
};

UserActions.cancelMergingQuayFrom = () => dispatch => {
  dispatch(sendData(types.CANCELLED_MERGING_QUAY_FROM, null));
};

UserActions.hideDeleteQuayDialog = () => dispatch => {
  dispatch(sendData(types.CANCELLED_DELETE_QUAY_DIALOG, null));
};

UserActions.hideDeleteStopDialog = () => dispatch => {
  dispatch(sendData(types.CANCELLED_DELETE_STOP_DIALOG, null));
};

UserActions.requestDeleteQuay = (stopPlaceId, quayId) => dispatch => {
  dispatch(
    sendData(types.REQUESTED_DELETE_QUAY, {
      stopPlaceId,
      quayId
    })
  );
};

UserActions.requestTerminateStopPlace = () => dispatch => {
  dispatch(sendData(types.TERMINATE_DELETE_STOP_DIALOG, null));
};

UserActions.closeMoveQuayDialog = () => dispatch => {
  dispatch(sendData(types.CANCELLED_MOVE_QUAY_DIALOG, null));
};

UserActions.openKeyValuesDialog = (keyValues, type, index) => dispatch => {
  dispatch(sendData(types.OPENED_KEY_VALUES_DIALOG, {
    keyValues,
    type,
    index
  }));
};

UserActions.closeKeyValuesDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_KEY_VALUES_DIALOG, null));
};

UserActions.moveQuay = quayProps => dispatch => {
  dispatch(sendData(types.REQUESTED_MOVE_QUAY, quayProps));
};

UserActions.closeMoveQuayToNewStopDialog = () => dispatch => {
  dispatch(sendData(types.CANCELLED_MOVE_QUAY_NEW_STOP, null));
};

UserActions.moveQuayToNewStopPlace = quayProps => dispatch => {
  dispatch(sendData(types.REQUESTED_MOVE_QUAY_NEW_STOP, quayProps));
};

UserActions.setZoomLevel = zoomLevel => dispatch => {
  dispatch(sendData(types.SET_ZOOM_LEVEL, zoomLevel));
};

UserActions.lookupCoordinates = (latLng, triggeredByDrag) => dispatch => {
  dispatch(sendData(types.LOOKUP_COORDINATES, {position: latLng, triggeredByDrag}));
};

UserActions.showRemoveStopPlaceFromParent = stopPlaceId => dispatch => {
  dispatch(sendData(types.SHOW_REMOVE_STOP_PLACE_FROM_PARENT, stopPlaceId));
};

UserActions.hideRemoveStopPlaceFromParent = () => dispatch => {
  dispatch(sendData(types.HIDE_REMOVE_STOP_PLACE_FROM_PARENT, null));
};

UserActions.createMultimodalWith = (client, stopPlaceId, fromMain) => dispatch => {
  getAddStopPlaceInfo(client, [stopPlaceId]).then( response => {
    if (response.data) {
      const foundStop = Object.values(response.data)[0][0];
      const newStopPlace = new ParentStopPlace().createNew(
        foundStop.name,
        foundStop
      );
      dispatch(
        sendData(types.CREATE_NEW_MULTIMODAL_STOP_FROM_EXISTING, {
          newStopPlace,
          fromMain
        })
      );
      dispatch(UserActions.navigateTo('/edit/', 'new'));
    }
  });
}

const getQuayById = (quays = [], quayId) => {
  for (let i = 0; quays.length; i++) {
    if (quays[i].id === quayId) return quays[i];
  }
  return null;
};

const getQuaysForMergeInfo = stopPlace => {
  if (!stopPlace || !stopPlace.length) return [];

  return stopPlace[0].quays.map( quay => ({
    publicCode: quay.publicCode,
    compassBearing: quay.compassBearing,
    privateCode: getIn(quay, ['privateCode', 'value'], null),
    id: quay.id
  }));
}


export default UserActions;
