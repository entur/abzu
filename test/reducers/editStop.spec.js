import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from './../../actions/actionTypes'
import expect from 'expect'
import fs from 'fs'
import { editStopReducer } from './../../reducers/'

const initialState = {
  centerPosition: {
    lat: 67.928595,
    lng: 13.0830025,
  },
  activeMarkers: [],
  zoom: 17,
  activeStopIsLoading: false
}

describe('edit stop reducer', () => {

  it('Should return the initial state', () => {
    expect(editStopReducer(undefined, {}))
      .toEqual(initialState)
  })

  it('Should change map upon CHANGED_MAP_CENTER', () => {
    const centerPosition = {
      lat: 67.928595,
      lng: 13.0830025,
    }
    expect(editStopReducer(initialState, { centerPosition: centerPosition} ))
      .toEqual(Object.assign({}, initialState, {centerPosition: centerPosition}))
  })

  it('Should set active markers', () => {
    expect(editStopReducer(initialState, { activeMarkers: []}))
      .toEqual(Object.assign({}, initialState, {activeMarkers: []}))
  })

})
