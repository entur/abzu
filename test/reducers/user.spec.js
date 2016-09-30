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
    stopType: []
  }
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
        ...initialState, searchFilters: { stopType:filters }
      })
  })

})
