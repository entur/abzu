import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from './../../actions/actionTypes'
import expect from 'expect'
import fs from 'fs'

const initialState = {
  centerPosition: {
    lat: 61.670029,
    lng: 6.4423426500000005
  },
  activeMarker: null,
  neighbouringMarkers: [],
  zoom: 7,
  stopPlaceNames: {
    isLoading: false,
    errorMessage: '',
    places: []
  },
  activeStopPlace: {}
}

const newStop = {
  "text": "<<>>",
  "markerProps": {
    "key": "marker0",
    "name": "",
    "position": [
      60.127827768866226,
      9.714660644531248
    ],
    "children": "",
    "description": "",
    "municipality": "",
    "county": "",
    "quays": [],
    "stopPlaceType": null
  },
  "isNewStop": true
}

import { stopPlacesReducer } from './../../reducers/'

describe('stop places reducer', () => {

  it('Should return the initial state', () => {
    expect(stopPlacesReducer(undefined, {})).toEqual(initialState)
  })

  it('Should correctly set center position of stop places map', () => {

    const stopPlacesExample = JSON.parse(fs.readFileSync(__dirname + '/../creators/json/stopPlaces.json', 'utf-8'))
    const centerPosition = [
      59.918792999999994,
      10.734455
    ]

    expect(stopPlacesReducer({}, {
      type: types.CHANGED_MAP_CENTER,
      payLoad: centerPosition
    }))
    .toEqual({
      centerPosition: centerPosition
    })
  })

  it('Should set an active marker used for stop places map', () => {
    const formattedStopPlace = JSON.parse(fs.readFileSync(__dirname
      + '/json/formattedStopPlace.json', 'utf-8'))

      expect(stopPlacesReducer({}, {
        type: types.SET_ACTIVE_MARKER,
        payLoad: formattedStopPlace
      }))
      .toEqual({
        activeMarker: formattedStopPlace
      })
    })

    it('Should set zoom level of stop places map', () => {

      const zoomLevel = 13

      expect(stopPlacesReducer({}, {
        type: types.SET_ZOOM,
        payLoad: zoomLevel
      }))
      .toEqual({
        zoom: zoomLevel
      })
    })

    it('Should create a new stop', () => {

      expect(stopPlacesReducer(initialState, {
        type: types.CREATED_NEW_STOP,
        payLoad: newStop
      }))
        .toEqual({...initialState, newStopPlace: newStop})
    })

    it('Should destroy new stop created', () => {

      let newState = stopPlacesReducer(initialState, {
        type: types.CREATED_NEW_STOP,
        payLoad: newStop
      })

      let finalState = stopPlacesReducer(newState, {
        type: types.DESTROYED_NEW_STOP
      })

      expect(finalState.newStopPlace).toNotEqual(newStop)

    })

    it('Requesting stop names should indicate loading', () => {

      const isLoading = true

      expect(stopPlacesReducer({}, {
        type: types.REQUESTED_STOP_NAMES
      }))
      .toEqual({
        stopPlaceNames: {
          isLoading: isLoading
        }
      })

    })

    it('Receiving stop names should return stop names', () => {

      const stopPlaces = [JSON.parse(fs.readFileSync(__dirname
        + '/json/formattedStopPlace.json', 'utf-8'))]

        expect(stopPlacesReducer({}, {
          type: types.RECEIVED_STOP_NAMES,
          payLoad: stopPlaces
        }))
        .toEqual({
          stopPlaceNames: {
            isLoading: false,
            places: stopPlaces
          }
        })

      })

      it('Should return error message upon running into an error when receiving stop names', () => {

        const errorMessage = 'Error 404 – Not Found'

        expect(stopPlacesReducer({}, {
          type: types.ERROR_STOP_NAMES,
          payLoad: errorMessage
        }))
        .toEqual({
          stopPlaceNames: {
            isLoading: false,
            errorMessage: errorMessage
          }
        })
      })
    })
