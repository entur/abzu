import { getStateByOperation, getObjectFromCache } from './graphQLreducerUtils'
import * as types from '../actions/actionTypes'
import formatHelpers from '../modelUtils/mapToClient'

const graphQLreducer = (state = {}, action) => {

    switch (action.type) {
      case "APOLLO_QUERY_RESULT":
        return getStateByOperation(state, action)

      case "APOLLO_MUTATION_RESULT":
        return getStateByOperation(state, action)

      case "APOLLO_QUERY_RESULT_CLIENT":
        return getObjectFromCache(state, action)

      case types.RESTORED_TO_ORIGINAL_STOP_PLACE:
        return Object.assign({}, state, {
          stopHasBeenModified: false,
          current: JSON.parse(JSON.stringify(state.originalCurrent))
        })

      case types.REMOVED_STOPS_NEARBY_FOR_OVERVIEW:
        return Object.assign({}, state, {
          neighbourStops: []
        })

      case types.CREATED_NEW_STOP:
        return Object.assign({}, state, {
          newStop: formatHelpers.createNewStopFromLocation(action.payLoad),
          stopHasBeenModified: false
        })

      case types.CHANGED_QUAY_COMPASS_BEARING:
        return Object.assign({}, state, {
          current: formatHelpers.updateCompassBearing(state.current, action.payLoad),
          stopHasBeenModified: true
        })

      case types.CHANGED_LOCATION_NEW_STOP:
        return Object.assign({}, state, {
          newStop: formatHelpers.createNewStopFromLocation(action.payLoad),
          stopHasBeenModified: true
        })

      case types.CHANGED_STOP_NAME:
        return {...state, current: {
          ...state.current, name: action.payLoad,
        }, stopHasBeenModified: true }

      case types.CHANGED_STOP_DESCRIPTION:
        return {...state, current: {
          ...state.current, description: action.payLoad,
        }, stopHasBeenModified: true }

      case types.CHANGED_STOP_TYPE:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentStopWithType(state.current, action.payLoad),
          stopHasBeenModified: true
        })

      case types.CHANGED_ACTIVE_STOP_POSITION:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentStopWithPosition(state.current, action.payLoad.location),
          stopHasBeenModified: true
        })

      case types.USE_NEW_STOP_AS_CURENT:
        return Object.assign({}, state, {
          current: JSON.parse(JSON.stringify(state.newStop)),
          centerPosition: state.newStop.location,
          zoom: 14,
          stopHasBeenModified: false
        })

      case types.SET_ACTIVE_MARKER:
        return Object.assign({}, state, {
          activeSearchResult: action.payLoad,
          centerPosition: getProperCenterLocation(action.payLoad.location),
          zoom: getProperZoomLevel(action.payLoad.location),
        })

      case types.SET_MISSING_COORDINATES:
        return Object.assign({}, state, {
          centerPosition: getProperCenterLocation(action.payLoad.location),
          zoom: getProperZoomLevel(action.payLoad.location)
        })

      case types.ADDED_JUNCTION_ELEMENT:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithNewElement(state.current, action.payLoad),
          stopHasBeenModified: true
        })

      case types.CHANGE_ELEMENT_POSITION:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithElementPositionChange(state.current, action.payLoad),
          stopHasBeenModified: true
        })

      case types.CHANGE_ELEMENT_NAME:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithElementNameChange(state.current, action.payLoad),
          stopHasBeenModified: true
        })

      case types.CHANGED_ELEMENT_DESCRIPTION:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithElementDescriptionChange(state.current, action.payLoad),
          stopHasBeenModified: true
        })

      case types.REMOVED_ELEMENT_BY_TYPE:
        return Object.assign({}, state, {
          current: formatHelpers.updateCurrentWithoutElement(state.current, action.payLoad),
          stopHasBeenModified: true
        })

      case types.CHANGED_MAP_CENTER:
        return Object.assign({}, state, {
          centerPosition: action.payLoad
        })

      default: return state
    }
}

const getProperCenterLocation = location => {
  return location || [62.928595, 12.083002]
}

const getProperZoomLevel = location => {
  return location ? 15 : 5
}

export default graphQLreducer