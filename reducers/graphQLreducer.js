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

      case types.CHANGED_STOP_NAME:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentStopWithName(state.current, action.payLoad)
        })

      case types.CHANGED_STOP_DESCRIPTION:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentStopWithDescription(state.current, action.payLoad)
        })


      case types.CHANGED_STOP_TYPE:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentStopWithType(state.current, action.payLoad)
        })

      case types.CHANGED_ACTIVE_STOP_POSITION:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentStopWithPosition(state.current, action.payLoad.location)
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

      case types.ADDED_JUNCTION_ELEMENT:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithNewElement(state.current, action.payLoad)
        })

      case types.CHANGE_ELEMENT_POSITION:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithElementPositionChange(state.current, action.payLoad)
        })

      case types.CHANGE_ELEMENT_NAME:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithElementNameChange(state.current, action.payLoad)
        })

      case types.CHANGED_ELEMENT_DESCRIPTION:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithElementDescriptionChange(state.current, action.payLoad)
        })

      case types.REMOVED_ELEMENT_BY_TYPE:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithoutElement(state.current, action.payLoad)
        })

      default: return state
    }
}

export default graphQLreducer