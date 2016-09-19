import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from './../../actions/actionTypes'
import expect from 'expect'
import fs from 'fs'

import { stopPlacesReducer } from './../../reducers/'

describe('stop places reducer', () => {

  it('should return the initial state', () => {
    expect(stopPlacesReducer(null, {})).toNotEqual({})
  })

  it('should return stop places', () => {

    const stopPlacesExample = JSON.parse(fs.readFileSync(__dirname + '/../creators/json/stopPlaces.json', 'utf-8'))

    expect(stopPlacesReducer({}, {
        type: types.SUCCESS_STOP_NAMES,
        payLoad: stopPlacesExample
    }))
    .toEqual({
        stopPlaceNames: {
          places:
            stopPlacesExample
        }
    })
  })
})
