import expect from 'expect'
import { graphQLReducer } from './../../reducers/'
import stopPlaceData from './json/graphql_stopPlace.json'

describe('Model: map format from server to expected client model', () => {


  it('should map stop to model correctly', () => {

    const action = {
      type: "APOLLO_QUERY_RESULT",
      result: stopPlaceData,
      operationName: 'stopPlace'
    }
    const state = graphQLReducer({}, action)

    const formattedStop = {
      id: 'NSR:StopPlace:933',
      name: 'Aspestrand',
      location: [ 59.175951, 11.725364 ],
      stopPlaceType: 'onstreetBus',
      allAreasWheelchairAccessible: null,
      isActive: true,
      topographicPlace: 'Aremark',
      parentTopographicPlace: 'Østfold',
      quays: [
        { id: 'NSR:Quay:1694',
          location: [ 59.176073, 11.726214 ],
          allAreasWheelChairAccessible: undefined,
          compassBearing: 344,
          description: '',
          plateCode: '1',
        },
        { id: 'NSR:Quay:1695',
          location: [ 59.17583, 11.724514 ],
          allAreasWheelChairAccessible: undefined,
          compassBearing: 164,
          description: '',
          plateCode: '2',
        }
      ],
      entrances: [],
      pathJunctions: []
    }

    expect(state.current).toEqual(formattedStop)
  })

})