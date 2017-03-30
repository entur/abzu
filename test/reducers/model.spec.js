import expect from 'expect'
import { stopPlaceReducer } from './../../reducers/'
import stopPlaceMock from './json/stopPlace.json'
import stopPlaceMock10Quays from './json/stopPlaceWith10Quays.json'
import clientStop from './json/clientStop.json'
import QueryVariablesMapper from '../../modelUtils/mapToQueryVariables'
import { describe, before, it } from 'mocha'

describe('Model: map format from server to expected client model', () => {


  it('should server response stop to client model correctly', () => {

    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceMock,
      operationName: 'stopPlace'
    }
    const state = stopPlaceReducer({}, action)

    const formattedStop = {
      id: 'NSR:StopPlace:933',
      name: 'Aspestrand',
      location: [
        60.260427,
        5.435734
      ],
      stopPlaceType: 'onstreetBus',
      isActive: true,
      topographicPlace: 'Aremark',
      parentTopographicPlace: 'Østfold',
      accessibilityAssessment: {
        limitations: {
          wheelchairAccess: "PARTIAL",
          stepFreeAccess: "PARTIAL",
          escalatorFreeAccess: "PARTIAL",
          liftFreeAccess: "PARTIAL",
          audibleSignalsAvailable: "PARTIAL"
        }
      },
      quays: [
        {
          id: 'NSR:Quay:1694',
          location: [
            60.260427,
            5.435734
          ],
          compassBearing: 344,
          description: '',
          publicCode: '1',
          accessibilityAssessment: {
            limitations: {
              wheelchairAccess: "PARTIAL",
              stepFreeAccess: "PARTIAL",
              escalatorFreeAccess: "PARTIAL",
              liftFreeAccess: "PARTIAL",
              audibleSignalsAvailable: "PARTIAL"
            }
          },
        },
        {
          id: 'NSR:Quay:1695',
          location: [
            60.260427,
            5.435734
          ],
          compassBearing: 164,
          description: '',
          publicCode: '2',
          accessibilityAssessment: {
            limitations: {
              wheelchairAccess: "PARTIAL",
              stepFreeAccess: "PARTIAL",
              escalatorFreeAccess: "PARTIAL",
              liftFreeAccess: "PARTIAL",
              audibleSignalsAvailable: "PARTIAL"
            }
          },
        }
      ],
      entrances: [],
      pathJunctions: [],
      parking: []
    }

    expect(state.current).toEqual(formattedStop)
  })

  it('should map client stop to schema correctly', () => {


     const schemaValidStop = QueryVariablesMapper.mapStopToVariables(clientStop)
     const expectedStop = {
       "id": "NSR:StopPlace:19744",
       "name": "Aspelundsveien",
       "stopPlaceType": "onstreetBus",
       "description": "Beskrivelse",
       "coordinates": [ [
           11.170963,
           59.587427
         ] ],
       accessibilityAssessment: {
         limitations: {
           wheelchairAccess: "PARTIAL",
           stepFreeAccess: "PARTIAL",
           escalatorFreeAccess: "PARTIAL",
           liftFreeAccess: "PARTIAL",
           audibleSignalsAvailable: "PARTIAL"
         }
       },
       "quays": [
         {
           "id": "NSR:Quay:30025",
           "compassBearing": 212,
           "publicCode": null,
           "description": {
             value: "",
             lang: "no"
            },
           "geometry": {
             coordinates: [ [
               11.17094,
               59.587486
             ] ],
             type: "Point"
           },
           "accessibilityAssessment": undefined,
         },
         {
           "id": "NSR:Quay:30026",
           "accessibilityAssessment": undefined,
           "compassBearing": 38,
           "publicCode": null,
           "description": {
             value: "",
             lang: "no"
           },
           "geometry": {
             coordinates: [ [
               11.170986,
               59.587368
             ] ],
             type: "Point",
           }
         }
       ],
     }

    expect(schemaValidStop).toEqual(expectedStop)

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
    state = stopPlaceReducer({}, action)
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

      state = stopPlaceReducer(state, changePublicCode)

      expect(state.current.quays[quayIndex].publicCode).toEqual(newPublicCode)

      const stopValidWithSchema = QueryVariablesMapper.mapStopToVariables(state.current)

      expect(state.current.quays[quayIndex].id).toEqual(stopValidWithSchema.quays[quayIndex].id)

    }

  })
})

