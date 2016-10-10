import * as types from './actionTypes'
import { Link, browserHistory } from 'react-router'
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

UserActions.toggleIsCreatingNewStop = () => {
  return function(dispatch, getState) {

    const state = getState()
    const isCreatingNewStop = state.userReducer.isCreatingNewStop

    if (isCreatingNewStop) {
      dispatch( sendData( types.DESTROYED_NEW_STOP, null) )
    }

    dispatch( sendData (types.TOGGLED_IS_CREATING_NEW_STOP, null) )
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

UserActions.getTopographicalPlaces = (input) => {
  return function(dispatch) {
    dispatch ( sendData(types.GET_TOPOGRAPHICAL_PLACES, input) )
  }
}

UserActions.addToposChip = (chip) => {
  return function(dispatch) {
    if (typeof chip.label !== 'undefined' && typeof chip.type !== 'undefined')
      dispatch(sendData(types.ADDED_TOPOS_CHIP, chip))
  }
}

UserActions.deleteChip = (key) => {
  return function(dispatch) {
    dispatch(sendData(types.DELETED_TOPOS_CHIP, key))
  }
}

UserActions.saveSearchAsFavorite = (searchText) => {
  return function(dispatch, getState) {
    const state = getState()
    const searchFilters =  state.userReducer.searchFilters
    const savableContent = {
      ...searchFilters, searchText: searchText
    }
    new FavoriteManager().save('__favorites__', savableContent)
  }
}

export default UserActions
