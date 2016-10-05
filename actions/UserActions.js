import * as types from './actionTypes'
import { Link, browserHistory } from 'react-router'
import configureLocalization from '../localization/localization'

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

export default UserActions
