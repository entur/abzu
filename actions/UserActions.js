import * as types from './actionTypes'
import { browserHistory } from 'react-router'
import configureLocalization from '../localization/localization'
import FavoriteManager from '../singletons/FavoriteManager'

var UserActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

UserActions.navigateTo = (path, id) => {
  return function(dispatch) {

    dispatch( sendData(types.NAVIGATE_TO, id) )

    const basePath = window.config.endpointBase

    if (path.length && path[0] === '/') {
      path = path.slice(1)
    }

    browserHistory.push(basePath+path+id)
  }
}

UserActions.hideEditStopAdditional = () => {
  return function(dispatch) {
    dispatch(sendData(types.HID_EDIT_STOP_ADDITIONAL, null))
  }
}

UserActions.showEditStopAdditional = () => {
  return function(dispatch) {
    dispatch(sendData(types.SHOW_EDIT_STOP_ADDITIONAL, null))
  }
}


UserActions.toggleIsCreatingNewStop = () => {
  return function(dispatch, getState) {

    const state = getState()
    const isCreatingNewStop = state.user.isCreatingNewStop

    if (isCreatingNewStop) {
      dispatch( sendData( types.DESTROYED_NEW_STOP, null) )
    }

    dispatch( sendData (types.TOGGLED_IS_CREATING_NEW_STOP, null) )
  }
}

UserActions.toggleMultiPolylinesEnabled = (value) => {
  return function(dispatch) {
    dispatch( sendData( types.TOGGLED_IS_MULTIPOLYLINES_ENABLED, value))
  }
}

UserActions.toggleCompassBearingEnabled = (value) => {
  return function(dispatch) {
    dispatch( sendData( types.TOGGLED_IS_COMPASS_BEARING_ENABLED, value))
  }
}

UserActions.applyStopTypeSearchFilter = (filters) => {
  return function(dispatch) {
    dispatch( sendData (types.APPLIED_STOPTYPE_SEARCH_FILTER, filters))
  }
}

UserActions.openSnackbar = (message) => {
  return function(dispatch) {
    dispatch( sendData(types.OPENED_SNACKBAR, message) )
  }
}

UserActions.dismissSnackbar = () => {
  return function(dispatch) {
    dispatch( sendData(types.DISMISSED_SNACKBAR, null) )
  }
}

UserActions.applyLocale = (locale) => {
  return function(dispatch) {
    dispatch ( sendData(types.APPLIED_LOCALE, locale) )
    configureLocalization(locale).then( (localization) => {
      dispatch ( UserActions.changeLocalization(localization) )
    })
  }
}

UserActions.changeLocalization = (localization) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_LOCALIZATION, localization) )
  }
}

UserActions.hideQuaysForNeighbourStop = (id) => {
  return function(dispatch) {
    dispatch( sendData(types.HID_QUAYS_FOR_NEIGHBOUR_STOP, id) )
  }
}


UserActions.addToposChip = (chip) => {
  return function(dispatch) {
    if (typeof chip.text !== 'undefined' && typeof chip.type !== 'undefined')
      dispatch(sendData(types.ADDED_TOPOS_CHIP, chip))
  }
}

UserActions.setToposchips = (chips) => {
  return function(dispatch) {
    dispatch(sendData(types.SET_TOPOS_CHIPS, chips))
  }
}

UserActions.setStopPlaceTypes = (stopPlaces) => {
  return function(dispatch) {
    dispatch(sendData(types.SET_STOP_PLACE_TYPES, stopPlaces))
  }
}

UserActions.deleteChip = (key) => {
  return function(dispatch) {
    dispatch(sendData(types.DELETED_TOPOS_CHIP, key))
  }
}

UserActions.saveSearchAsFavorite = (title) => {
  return function(dispatch, getState) {
    const state = getState()
    const searchFilters =  state.user.searchFilters
    let favoriteManager = new FavoriteManager()
    let savableContent = favoriteManager.createSavableContent(title, searchFilters.text, searchFilters.stopType, searchFilters.topoiChips)
    favoriteManager.save(savableContent)
    dispatch(UserActions.closeFavoriteNameDialog())
  }
}

UserActions.removeSearchAsFavorite = () => {
  return function(dispatch, getState) {
    const state = getState()
    const searchFilters =  state.user.searchFilters
    let favoriteManager = new FavoriteManager()
    let savableContent = favoriteManager.createSavableContent('', searchFilters.text, searchFilters.stopType, searchFilters.topoiChips)
    favoriteManager.remove(savableContent)
    dispatch(sendData(types.REMOVE_SEARCH_AS_FAVORITE, savableContent))
  }
}

UserActions.setSearchText = text => {
  return function(dispatch) {
    dispatch(sendData(types.SET_SEARCH_TEXT, text))
  }
}

UserActions.setMissingCoordinates = (position, stopPlaceId) => {
  return function(dispatch) {
    dispatch(sendData(types.SET_MISSING_COORDINATES, {
      stopPlaceId: stopPlaceId,
      position: [position.lat, position.lng]
    }))
  }
}

UserActions.loadFavoriteSearch = (favorite) => {
  return function(dispatch) {
    dispatch(UserActions.setToposchips(favorite.topoiChips))
    dispatch(UserActions.setStopPlaceTypes(favorite.stopType))
    dispatch(UserActions.setSearchText(favorite.searchText))
  }
}

UserActions.openFavoriteNameDialog = () => {
  return function(dispatch) {
    dispatch(sendData(types.OPENED_FAVORITE_NAME_DIALOG, null))
  }
}

UserActions.closeFavoriteNameDialog = () => {
  return function(dispatch) {
    dispatch(sendData(types.CLOSED_FAVORITE_NAME_DIALOG, null))
  }
}

UserActions.changeActiveBaselayer = (name) => {
  return function(dispatch) {
    dispatch(sendData(types.CHANGED_ACTIVE_BASELAYER, name))
  }
}

UserActions.removeStopsNearbyForOverview = () => {
  return function(dispatch) {
    dispatch(sendData(types.REMOVED_STOPS_NEARBY_FOR_OVERVIEW, null))
  }
}

UserActions.startCreatingPolyline = (initialCoords, index, type) => {
  return function(dispatch) {
    dispatch(sendData(types.STARTED_CREATING_POLYLINE, {
      coordinates: initialCoords,
      index: index,
      type: type
    }))
  }
}

UserActions.addCoordinatesToPolylines = (coords) => {
  return function(dispatch) {
    dispatch(sendData(types.ADDED_COORDINATES_TO_POLYLINE, coords))
  }
}

UserActions.addFinalCoordinesToPolylines = (coords, index, type) => {
  return function(dispatch) {
    dispatch(sendData(types.ADDED_FINAL_COORDINATES_TO_POLYLINE, {
      coordinates: coords,
      index: index,
      type: type
    }))
  }
}

UserActions.removePolylineFromIndex = (index) => {
  return function(dispatch) {
    dispatch(sendData(types.REMOVED_POLYLINE_FROM_INDEX, index))
  }
}

UserActions.removeLastPolyline = () => {
  return function(dispatch) {
    dispatch(sendData(types.REMOVED_LAST_POLYLINE, null))
  }
}

UserActions.editPolylineTimeEstimate = (index, estimate) => {
  return function(dispatch) {
    dispatch(sendData(types.EDITED_TIME_ESTIMATE_FOR_POLYLINE, {
      index: index,
      estimate: estimate
    }))
  }
}

UserActions.changeElementTypeTab = (value) => {
  return function(dispatch) {
    dispatch(sendData(types.CHANGED_ELEMENT_TYPE_TAB, value))
  }
}

export default UserActions
