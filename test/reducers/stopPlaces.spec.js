import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from './../../actions/actionTypes'
import expect from 'expect'
import fs from 'fs'

import { stopPlacesReducer } from './../../reducers/'

describe('stop places reducer', () => {

  it('Should return the initial state', () => {
    expect(stopPlacesReducer(null, {})).toNotEqual({})
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
        type: types.SET_ACTIVE_MARKERS,
        payLoad: formattedStopPlace
      }))
      .toEqual({
        activeMarkers: [formattedStopPlace]
      })
    })

    it('Should zoom level of stop places map', () => {

      const zoomLevel = 13

      expect(stopPlacesReducer({}, {
        type: types.SET_ZOOM,
        payLoad: zoomLevel
      }))
      .toEqual({
        zoom: zoomLevel
      })
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
            places: stopPlaces
          }
        })

      })

      it('Should retturn error message upon running into an error when receiving stop names', () => {

        const errorMessage = 'Error 404 – Not Found'

        expect(stopPlacesReducer({}, {
          type: types.ERROR_STOP_NAMES,
          payLoad: errorMessage
        }))
        .toEqual({
          stopPlaceNames: {
            errorMessage: errorMessage
          }
        })
      })
    })
