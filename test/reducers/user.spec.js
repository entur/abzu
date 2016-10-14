import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from './../../actions/actionTypes'
import expect from 'expect'
import fs from 'fs'
import { userReducer } from './../../reducers/'

const initialState = {
  path: '/',
  isCreatingNewStop: false,
  searchFilters: {
    stopType: [],
    topoiChips: [
     // e.g. {key: 0, label: 'Nordland', type: 'county', ref: 2},
   ],
   text: ''
  },
  snackbarOptions: {
    isOpen: false,
    message: ''
  },
  localization: {
    locale: null,
    messages: []
  },
  appliedLocale: null,
  // received data from GET:/topographic_place
  topoiSource: [],
  // source for TopographicalFilter autocomplete
  topoiSuggestions: [],
  favoriteNameDialogIsOpen: false,
  removedFavorites: [],
  activeBaselayer: 'Rutebankens kart'
}


describe('user reducer', () => {

  it('Should return the initial state', () => {
    expect(userReducer(undefined, {}))
      .toEqual(initialState)
  })

  it('Should navigate to path', () => {

    const editPathChange = {
      type: types.NAVIGATE_TO,
      payLoad: '/edit/'
    }

    expect(userReducer(undefined, editPathChange))
      .toEqual({...initialState, path: '/edit/'})
  })

  it('Should toggle new stop form visibility', () => {
    expect(userReducer(undefined, { type: types.TOGGLED_IS_CREATING_NEW_STOP }))
      .toEqual({
        ...initialState,
        isCreatingNewStop: true
      })
  })

  it('Should apply search filters', () => {

    const filters = []

    expect(userReducer(undefined, {
      type: types.APPLIED_STOPTYPE_SEARCH_FILTER,
      payLoad: filters
    }))
      .toEqual({
        ...initialState, searchFilters: { ...initialState.searchFilters, stopType:filters }
      })
  })

  it('Should display correct snackbar options', () => {

    const snackbarOptions = {
      isOpen: true,
      message: 'This is some feedback to the user'
    }

    expect(userReducer(undefined, {
      type: types.OPENED_SNACKBAR,
      payLoad: snackbarOptions.message
    }))
      .toEqual({
        ...initialState, snackbarOptions: snackbarOptions
      })
  })

  it('Should dismiss snackbar', () => {

    const snackbarOptions = {
      isOpen: false
    }
    expect(userReducer(undefined, {
      type: types.DISMISSED_SNACKBAR,
      payLoad: null
    }))
      .toEqual({
        ...initialState, snackbarOptions: snackbarOptions
      })
  })

  it('Should change localization', () => {

    const localization = {
      locale: 'nb',
      message: []
    }

    expect(userReducer(undefined, {
      type: types.CHANGED_LOCALIZATION,
      payLoad: localization
    }))
      .toEqual({
        ...initialState, localization: localization
      })
  })

  it('Should apply language change', () => {

    const locale = 'nb'

    expect(userReducer(undefined, {
      type: types.APPLIED_LOCALE,
      payLoad: locale
    }))
      .toEqual({
        ...initialState, appliedLocale: locale
      })
  })

  it('Should set topographical places', () => {

    let topographicalPlaces = require('./json/topographicalPlaces.json')

    expect(userReducer(undefined, {
      type: types.GET_TOPOGRAPHICAL_PLACES,
      payLoad: topographicalPlaces
    }))
      .toEqual({
        ...initialState, topoiSuggestions: topographicalPlaces
      })
  })

  it('Should set active baselayer for maps', () => {
    let newBaselayer = 'OpenStreetMap'

    expect(userReducer(undefined, {
      type: types.CHANGED_ACTIVE_BASELAYER,
      payLoad: newBaselayer
    }))
      .toEqual({
        ...initialState, activeBaselayer: newBaselayer
      })
  })

})
