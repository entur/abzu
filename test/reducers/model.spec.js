import expect from 'expect'
import { graphQLReducer } from './../../reducers/'
import stopPlaceMock from './json/stopPlace.json'
import stopPlaceMock10Quays from './json/stopPlaceWith10Quays.json'
import schemaMap from '../../modelUtils/mapToSchema'
import { describe, before, it } from 'mocha'

describe('Model: map format from server to expected client model', () => {


  it('should map stop to model correctly', () => {

    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceMock,
      operationName: 'stopPlace'
    }
    const state = graphQLReducer({}, action)

    const formattedStop = {
      id: 'NSR:StopPlace:933',
      name: 'Aspestrand',
      location: [59.175951, 11.725364],
      stopPlaceType: 'onstreetBus',
      isActive: true,
      topographicPlace: 'Aremark',
      parentTopographicPlace: 'Østfold',
      quays: [
        {
          id: 'NSR:Quay:1694',
          location: [59.176073, 11.726214],
          compassBearing: 344,
          description: '',
          publicCode: '1',
        },
        {
          id: 'NSR:Quay:1695',
          location: [59.17583, 11.724514],
          compassBearing: 164,
          description: '',
          publicCode: '2',
        }
      ],
      entrances: [],
      pathJunctions: []
    }

    expect(state.current).toEqual(formattedStop)
  })
})

describe('Changes correct properties', () => {

  var state = {}

  before( done => {
    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceMock10Quays,
      operationName: 'stopPlace'
    }
    state = graphQLReducer({}, action)
    expect(state.current.quays.length).toEqual(10)
    done()
  })

  it('should change property of correct quay', () => {

    for (let quayIndex = 0; quayIndex < 10; quayIndex++) {

      const newPublicCode = `new public code ${quayIndex}`

      const changePublicCode = {
        type: 'CHANGE_ELEMENT_NAME',
        payLoad: {
          type: 'quay',
          name: newPublicCode,
          index: quayIndex,
        }
      }

      state = graphQLReducer(state, changePublicCode)

      expect(state.current.quays[quayIndex].publicCode).toEqual(newPublicCode)

      const stopValidWithSchema = schemaMap.mapStopToSchema(state.current)

      expect(state.current.quays[quayIndex].id).toEqual(stopValidWithSchema.quays[quayIndex].id)

    }

  })
})

