import { getStateByOperation } from './graphQLreducerUtils'
import * as types from '../actions/actionTypes'
import formatHelpers from '../actions/formatHelpers'

const graphQLreducer = (state = {}, action) => {

    switch (action.type) {
      case "APOLLO_QUERY_RESULT":
        return getStateByOperation(state, action)

      case types.CREATED_NEW_STOP:
        return Object.assign({}, state, {
          newStop: formatHelpers.createNewStopFromLocation(action.payLoad),
        })

      case types.CHANGED_LOCATION_NEW_STOP:
        return Object.assign({}, state, {
          newStop: formatHelpers.createNewStopFromLocation(action.payLoad)
        })

      case types.USE_NEW_STOP_AS_CURENT:
        return Object.assign({}, state, {
          current: JSON.parse(JSON.stringify(state.newStop)),
          centerPosition: state.newStop.location,
          zoom: 14,
        })

      case types.SET_ACTIVE_MARKER:
        return Object.assign({}, state, {
          activeSearchResult: action.payLoad
        })

      default: return state
    }
}

export default graphQLreducer