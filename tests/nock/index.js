import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import AsyncActions from './../../actions/AsyncActions'
import * as types from './../../actions/actionTypes'
import nock from 'nock'
import expect from 'expect'
import cfgreader from './../../config/readConfig'

const Suppliers = [{
  "id": 1,
  "name": "Ã˜stfold / Ã˜stfold Kollektivtrafikk",
    "sftpAccount": "ostfold",
    "chouetteInfo": {
    "id": 1,
    "prefix": "OST",
    "referential": "ost",
    "organisation": "Rutebanken",
    "user": "admin@rutebanken.org",
    "regtoppVersion": null,
    "regtoppCoordinateProjection": "EPSG:32632",
    "regtoppCalendarStrategy": null,
    "dataFormat": "regtopp",
    "enableValidation": true
    }
}]

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

cfgreader.readConfig( (function(config) {
  window.config = config
}))

window.config = {
  nabuBaseUrl: "https://carbon.rutebanken.org/apiman-gateway/rutebanken/nabu/1.0/"
}

describe('async actions', () => {

  afterEach(() => {
    nock.cleanAll()
  })

  it('creates ultimately RECEIVED_SUPPLIERS when fetching suppliers has been done', () => {

    nock('https://carbon.rutebanken.org/apiman-gateway/rutebanken/nabu/1.0/jersey/')
      .log(console.log)
      .get('/providers/all')
      .reply(200, Suppliers)

    const expectedActions = [
     { type: types.REQUESTED_SUPPLIERS, payLoad: null },
     { type: types.RECEIVED_SUPPLIERS, payLoad: Suppliers }
    ]
    const store = mockStore({ suppliers: [] })

    return store.dispatch(AsyncActions.getAllSuppliers())
      .then((result) => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

  it('creates ultimately RECEIVED_EVENTS when fetching events has been done', () => {

    nock('https://carbon.rutebanken.org/apiman-gateway/rutebanken/nabu/1.0/jersey')
      .log(console.log)
      .get('/jobs/1')
      .reply(200, [])

    const expectedActions = [
     { type: types.REQUESTED_EVENTS, payLoad: null },
     { type: types.CHANGED_ACTIVE_PROVIDER, payLoad: 1 },
     { type: types.RECEIVED_EVENTS, payLoad: []}
    ]
    const store = mockStore({ events: [] })

    return store.dispatch(AsyncActions.getProviderStatus(1))
      .then((result) => {
        expect(store.getActions()).toEqual(expectedActions)
      })
  })

})
