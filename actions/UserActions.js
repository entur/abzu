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

  return function(dispatch, getState) {

    const state = getState()

    let chipsAlreadyAdded = state.userReducer.searchFilters.topoiChips
    let suggestions = state.userReducer.topoiSource

    suggestions = suggestions.filter( (suggestion) => {

      for (let i = 0; i < chipsAlreadyAdded.length; i++) {
        if (JSON.stringify(chipsAlreadyAdded[i]) === JSON.stringify(suggestion)) {
          return false
        }
      }
      return true
    })

    dispatch ( sendData(types.GET_TOPOGRAPHICAL_PLACES, suggestions) )
  }
}


UserActions.addToposChip = (chip) => {
  return function(dispatch) {
    if (typeof chip.name !== 'undefined' && typeof chip.type !== 'undefined')
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
    let favoriteManager = new FavoriteManager()
    let savableContent = favoriteManager.createSavableContent(searchText, searchFilters.stopType, searchFilters.topoiChips)
    favoriteManager.save(savableContent)
  }
}

UserActions.removeSearchAsFavorite = (searchText) => {
  return function(dispatch, getState) {
    const state = getState()
    const searchFilters =  state.userReducer.searchFilters
    let favoriteManager = new FavoriteManager()
    let savableContent = favoriteManager.createSavableContent(searchText, searchFilters.stopType, searchFilters.topoiChips)
    favoriteManager.remove(savableContent)
  }
}

export default UserActions
