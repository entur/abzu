import { getStateByOperation } from './graphQLreducerUtils'

const graphQLreducer = (state = {}, action) => {

    switch (action.type) {
      case "APOLLO_QUERY_RESULT":
        return getStateByOperation(state, action)
      default: return state
    }
}

export default graphQLreducer