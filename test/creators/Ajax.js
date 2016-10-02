/*import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from './../../actions/actionTypes'
import nock from 'nock'
import expect from 'expect'
import {  AjaxActions } from './../../actions/'
import cfgreader from './../../config/readConfig'
import fs from 'fs'
import formatMarkers from './../../actions/AjaxActions'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

cfgreader.readConfig( (function(config) {
  window.config = config
}))

const tiamatBaseUrl = 'http://localhost/'

window.config = {
  tiamatBaseUrl: tiamatBaseUrl
}

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('Should request and receive stop places filtered by input', () => {

    const placeName = 'Skalleberg'
    const stopPlacesExample = JSON.parse(fs.readFileSync(__dirname + '/json/stopPlaces.json', 'utf-8'))

    nock(tiamatBaseUrl + 'stop_place/')
      .log(console.log)
      .get('?name=' + placeName)
      .reply(200, stopPlacesExample)

    const expectedActions = [
     { type: types.REQUESTED_STOP_NAMES, payLoad: null },
     { type: types.RECEIVED_STOP_NAMES, payLoad: stopPlacesExample }
    ]

    const store = mockStore({
      userReducer: {
        stopPlaceNames: {
          isLoading: false,
          errorMessage: '',
          content: []
        },
        searchFilters: {
          stopType: []
        }
      }
    })

    return store.dispatch( AjaxActions.getStopNames(placeName))
      .then((result) => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

})*/
