import * as types from '../actions/Types'
import Immutable from 'immutable'
import {
  addStartPointToPolyline,
  addPointToPolyline,
  addEndPointToPolyline,
  setDefaultCompassBearingisEnabled,
  updateNeighbourMarkersWithQuays,
} from './editStopReducerUtils'

export const initialState = {
  neighbouringMarkers: [],
  neighbouringMarkersQuaysMap: Immutable.Map({}),
  zoom: 17,
  editedStopChanged: false,
  nearbyStopsCancelToken: null,
  activeStopPlaceOriginal: [],
  activeStopPlace: null,
  multiPolylineDataSource: [],
  enablePolylines: true,
  isCompassBearingEnabled: true,
  isCreatingPolylines: false,
  polylineStartPoint: {
    coordinates: [],
    index: -1,
    type: null
  },
  focusedElement: {
    type: 'quay',
    index: -1
  }
}

const editStopReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.NAVIGATE_TO:
      return Object.assign({}, state, {
        polylineStartPoint: {
          coordinates: [],
          index: -1,
          type: null
        },
        focusedElement: {
          type: 'quay',
          index: -1
        }
      })


    // TODO: Refactor and remove this
    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, { centerPosition: action.payLoad })

    // TODO: Refactor and move this to userReducer
    case types.TOGGLED_IS_MULTIPOLYLINES_ENABLED:
      return Object.assign({}, state, { enablePolylines: action.payLoad })

    // TODO: Refactor and move this to userReducer
    case types.TOGGLED_IS_COMPASS_BEARING_ENABLED:
      return Object.assign({}, state, { isCompassBearingEnabled: action.payLoad })


    case types.STARTED_CREATING_POLYLINE:
      return Object.assign({}, state, {
        isCreatingPolylines: true,
        polylineStartPoint: action.payLoad,
        enablePolylines: true
      })

    case types.ADDED_COORDINATES_TO_POLYLINE:
      return Object.assign({}, state, {
        lastAddedCoordinate: action.payLoad,
      })

    case types.ADDED_FINAL_COORDINATES_TO_POLYLINE:
      return Object.assign({}, state, {
        isCreatingPolylines: false,
        enablePolylines: true
      })

    case types.REMOVED_POLYLINE_FROM_INDEX:
      const multiPolylinesRemovePolylindex = state.multiPolylineDataSource.slice(0)

      if (multiPolylinesRemovePolylindex[action.payLoad]) {
        multiPolylinesRemovePolylindex.splice(action.payLoad, 1)
      }

      return Object.assign({}, state, {
        multiPolylineDataSource: multiPolylinesRemovePolylindex
      })

    case types.REMOVED_LAST_POLYLINE:
      return Object.assign({}, state, {
        isCreatingPolylines: false
      })

    case types.SET_ACTIVE_MAP:
      return Object.assign({}, state, { activeMap: action.payLoad})

    case types.SET_FOCUS_ON_ELEMENT:
      return Object.assign({}, state, {
        focusedElement: {
          index: action.payLoad.index,
          type: action.payLoad.type
        }
      })

    case types.SHOW_EDIT_STOP_ADDITIONAL:
      return Object.assign({}, state, {
        focusedElement: {
          index: -1,
          type: 'quay'
        }
      })

    default:
      return state
  }
}

export default editStopReducer
