import * as types from './Types';
import { browserHistory } from 'react-router';
import configureLocalization from '../localization/localization';
import FavoriteManager from '../singletons/FavoriteManager';

var UserActions = {};

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

UserActions.navigateToMainAfterDelete = () => dispatch => {
  dispatch(sendData(types.NAVIGATE_TO_MAIN_AFTER_DELETE, null));
  goToRoute('/','');
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

UserActions.toggleIsCreatingNewStop = () => (dispatch, getState) => {
  const state = getState();
  const isCreatingNewStop = state.user.isCreatingNewStop;

  if (isCreatingNewStop) {
    dispatch(sendData(types.DESTROYED_NEW_STOP, null));
  }
  dispatch(sendData(types.TOGGLED_IS_CREATING_NEW_STOP, null));
};

UserActions.toggleMultiPolylinesEnabled = value => dispatch => {
  dispatch(sendData(types.TOGGLED_IS_MULTIPOLYLINES_ENABLED, value));
};

UserActions.toggleCompassBearingEnabled = value => dispatch => {
  dispatch(sendData(types.TOGGLED_IS_COMPASS_BEARING_ENABLED, value));
};

UserActions.toggleExpiredShowExpiredStops = value => dispatch => {
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

UserActions.saveSearchAsFavorite = title => (dispatch, getState) => {
  const state = getState();
  const searchFilters = state.user.searchFilters;
  let favoriteManager = new FavoriteManager();
  let savableContent = favoriteManager.createSavableContent(
    title,
    searchFilters.text,
    searchFilters.stopType,
    searchFilters.topoiChips
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
};

UserActions.openFavoriteNameDialog = () => dispatch => {
  dispatch(sendData(types.OPENED_FAVORITE_NAME_DIALOG, null));
};

UserActions.closeFavoriteNameDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_FAVORITE_NAME_DIALOG, null));
};

UserActions.changeActiveBaselayer = name => dispatch => {
  dispatch(sendData(types.CHANGED_ACTIVE_BASELAYER, name));
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

UserActions.showMergeStopDialog = (id, name) => dispatch => {
  dispatch(
    sendData(types.OPENED_MERGE_STOP_DIALOG, {
      id: id,
      name: name
    })
  );
};

UserActions.hideMergeStopDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_MERGE_STOP_DIALOG, null));
};

UserActions.hideMergeQuaysDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_MERGE_QUAYS_DIALOG, null));
};

UserActions.startMergingQuayFrom = id => dispatch => {
  dispatch(sendData(types.STARTED_MERGING_QUAY_FROM, id));
};

UserActions.endMergingQuayTo = id => dispatch => {
  dispatch(sendData(types.ENDED_MERGING_QUAY_TO, id));
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

UserActions.requestDeleteStopPlace = () => dispatch => {
  dispatch(sendData(types.REQUESTED_DELETE_STOP_DIALOG, null));
};

UserActions.openKeyValuesDialog = keyValues => dispatch => {
  dispatch(sendData(types.OPENED_KEY_VALUES_DIALOG, keyValues));
};

UserActions.closeKeyValuesDialog = () => dispatch => {
  dispatch(sendData(types.CLOSED_KEY_VALUES_DIALOG, null));
};

export default UserActions;
