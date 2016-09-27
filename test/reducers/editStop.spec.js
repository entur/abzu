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


  it('Should append stops nearby to active stop place', () => {
    let stops = JSON.parse(fs.readFileSync(__dirname + '/json/activeStopPlaces.json', 'utf-8'))
    let activeStop = stops[0]
    let nearbyStops = stops.slice(1)

    let newState = editStopReducer({ activeStopPlace: [activeStop]}, {
      type: types.RECEIVED_STOPS_NEARBY,
      payLoad: nearbyStops
    })

    expect(newState.activeStopPlace).toEqual(stops)

  })

  it('Should change name of active stop place', () => {

    let stopPlaces = JSON.parse(fs.readFileSync(__dirname + '/json/activeStopPlaces.json', 'utf-8'))
    const name = 'Somewhere over the rainbow'
    let newState = editStopReducer({ activeStopPlace: stopPlaces }, {
      type: types.CHANGED_STOP_NAME,
      payLoad: name
    })

    expect(newState.activeStopPlace[0].markerProps.name).toEqual( name)

  })

})
