import expect from 'expect'
import { stopPlaceReducer } from './../../reducers/'
import stopPlaceMock from './json/stopPlace.json'
import stopPlaceMock10Quays from './json/stopPlaceWith10Quays.json'
import clientStop from './json/clientStop.json'
import QueryVariablesMapper from '../../modelUtils/mapToQueryVariables'
import { describe, before, it } from 'mocha'

describe('Model: map format from server to expected client model', () => {


  it('should let server response stop map to client model correctly', () => {

    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceMock,
      operationName: 'stopPlace'
    }
    const state = stopPlaceReducer({}, action)

    const formattedStop = {
      id: 'NSR:StopPlace:933',
      name: 'Aspestrand',
      weighting: null,
      location: [
        60.260427,
        5.435734
      ],
      tariffZones: [],
      stopPlaceType: 'onstreetBus',
      isActive: true,
      topographicPlace: 'Aremark',
      parentTopographicPlace: 'Østfold',
      alternativeNames: [],
      accessibilityAssessment: {
        limitations: {
          wheelchairAccess: "UNKNOWN",
          stepFreeAccess: "UNKNOWN",
          escalatorFreeAccess: "UNKNOWN",
          liftFreeAccess: "UNKNOWN",
          audibleSignalsAvailable: "UNKNOWN"
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
              wheelchairAccess: "UNKNOWN",
              stepFreeAccess: "UNKNOWN",
              escalatorFreeAccess: "UNKNOWN",
              liftFreeAccess: "UNKNOWN",
              audibleSignalsAvailable: "UNKNOWN"
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
              wheelchairAccess: "UNKNOWN",
              stepFreeAccess: "UNKNOWN",
              escalatorFreeAccess: "UNKNOWN",
              liftFreeAccess: "UNKNOWN",
              audibleSignalsAvailable: "UNKNOWN"
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


  it('should map parking to schema validated query variables', () => {

    const parking = [
      {
        name: "park&ride example",
        location: [63.207698, 11.088595],
        totalCapacity: "100",
        parkingVehicleTypes: ['car']
      }
    ]

    const expectedOutput = [
      {
        name: {
          lang: "nb",
          value: "park&ride example"
        },
        parentSiteRef: "NSR:StopPlace:1",
        totalCapacity: 100,
        parkingVehicleTypes: ['car'],
        geometry: {
          type: "Point",
          coordinates: [
            [
              11.088595, 63.207698
            ]
          ]
        }
      }
    ]

    let result = QueryVariablesMapper.mapParkingToVariables(parking, "NSR:StopPlace:1")

    expect(result).toEqual(expectedOutput)
  })

  it('should map client stop to schema correctly', () => {

     const schemaValidStop = QueryVariablesMapper.mapStopToVariables(clientStop)
     const expectedStop = {
       "id": "NSR:StopPlace:19744",
       "name": "Aspelundsveien",
       alternativeNames: [],
       "weighting": null,
       "stopPlaceType": "onstreetBus",
       "description": "Beskrivelse",
       "coordinates": [ [
           11.170963,
           59.587427
         ] ],
       accessibilityAssessment: {
         limitations: {
           wheelchairAccess: "UNKNOWN",
           stepFreeAccess: "UNKNOWN",
           escalatorFreeAccess: "UNKNOWN",
           liftFreeAccess: "UNKNOWN",
           audibleSignalsAvailable: "UNKNOWN"
         }
       },
       placeEquipments: undefined,
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
           placeEquipments: undefined
         },
         {
           "id": "NSR:Quay:30026",
           "accessibilityAssessment": undefined,
           placeEquipments: undefined,
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
        type: 'CHANGE_PUBLIC_CODE_NAME',
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

