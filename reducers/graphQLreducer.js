import { getStateByOperation } from './graphQLreducerUtils'
import * as types from '../actions/actionTypes'
import formatHelpers from '../actions/formatHelpers'

const graphQLreducer = (state = {}, action) => {

    switch (action.type) {
      case "APOLLO_QUERY_RESULT":
        return getStateByOperation(state, action)

      case types.CREATED_NEW_STOP:
        return Object.assign({}, state, {
          newStop: formatHelpers.createNewStopFromLocation(action.payLoad)
        })

      default: return state
    }
}

export default graphQLreducer