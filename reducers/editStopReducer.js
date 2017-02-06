import * as types from './../actions/actionTypes'
import Immutable from 'immutable'
import {
  addStartPointToPolyline,
  addPointToPolyline,
  addEndPointToPolyline,
  setDefaultCompassBearingisEnabled,
  updateNeighbourMarkersWithQuays,
} from './editStopReducerUtils'

export const initialState = {
  centerPosition: [
    67.928595,
    13.083002,
  ],
  neighbouringMarkers: [],
  neighbouringMarkersQuaysMap: Immutable.Map({}),
  zoom: 17,
  activeStopIsLoading: false,
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

    case types.RECEIVED_QUAYS_FOR_NEIGHBOURING_STOP:

      let newNeighbourQuaysMap = state.neighbouringMarkersQuaysMap

      if (action.payLoad.stopId && action.payLoad.quays) {
        newNeighbourQuaysMap = state.neighbouringMarkersQuaysMap.set(action.payLoad.stopId, action.payLoad.quays)
      }
      return Object.assign({}, state, {
        neighbouringMarkers: updateNeighbourMarkersWithQuays(newNeighbourQuaysMap, state.neighbouringMarkers),
        neighbouringMarkersQuaysMap: newNeighbourQuaysMap
      })

    case types.HID_QUAYS_FOR_NEIGHBOUR_STOP:

      let newNeighbourQuaysMapHid = state.neighbouringMarkersQuaysMap

      if (action.payLoad) {
        newNeighbourQuaysMapHid = state.neighbouringMarkersQuaysMap.set(action.payLoad, [])
      }

      return Object.assign({}, state, {
        neighbouringMarkers: updateNeighbourMarkersWithQuays(newNeighbourQuaysMapHid, state.neighbouringMarkers),
        neighbouringMarkersQuaysMap: newNeighbourQuaysMapHid
      })


    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, { centerPosition: action.payLoad })

    case types.RECEIVED_STOP:
      return Object.assign({}, state, {
        activeStopPlaceOriginal: JSON.parse(JSON.stringify(action.payLoad)),
        editedStopChanged: false,
        activeStopIsLoading: false,
        activeStopPlace: action.payLoad,
        neighbouringMarkers: [],
        multiPolylineDataSource: [],
        focusedQuayIndex: null,
        isCompassBearingEnabled: setDefaultCompassBearingisEnabled(action.payLoad),
        focusedElement: initialState.focusedElement
      })

    case types.REQUESTED_STOP:
      return Object.assign({}, state, { activeStopIsLoading: true})

    case types.SET_ZOOM:
      return Object.assign({}, state, { zoom: action.payLoad})

    case types.ERROR_STOP:
      return Object.assign({}, state, { activeStopIsLoading: false})

    case types.REMOVED_ELEMENT_BY_TYPE:
      return removeElementByType(action, state)

    case types.CHANGED_WHA:
      let markerToChangeWHA = Object.assign({}, state.activeStopPlace,{})
      markerToChangeWHA.markerProps.quays[action.payLoad.index].allAreasWheelchairAccessible = action.payLoad.value

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeWHA})

    case types.CHANGED_QUAY_COMPASS_BEARING:
      let markerToChangeCompassBearing = Object.assign({}, state.activeStopPlace,{})
      markerToChangeCompassBearing.markerProps.quays[action.payLoad.index].compassBearing = action.payLoad.compassBearing

      return Object.assign({}, state, {
        editedStopChanged: true,
        activeStopPlace:
        markerToChangeCompassBearing,
        isCompassBearingEnabled: true
      })

    case types.REQUESTED_STOPS_EDITING_NEARBY:

      if (state.nearbyStopsCancelToken != null) {
        let cancelToken = state.nearbyStopsCancelToken
        cancelToken('Operation canceled by new request.')
      }

      return Object.assign({}, state, {
        nearbyStopsCancelToken: action.payLoad.cancel,
        activeMap: action.payLoad.map
      })

    case types.RECEIVED_STOPS_EDITING_NEARBY:
      return Object.assign({}, state, {
        neighbouringMarkers: updateNeighbourMarkersWithQuays(state.neighbouringMarkersQuaysMap, action.payLoad),
      })

    case types.RESTORED_TO_ORIGINAL_STOP_PLACE:
      return Object.assign({}, state, {
        editedStopChanged: false,
        activeStopPlace: JSON.parse(JSON.stringify(state.activeStopPlaceOriginal)),
        multiPolylineDataSource: [],
      })

    case types.TOGGLED_IS_MULTIPOLYLINES_ENABLED:
      return Object.assign({}, state, { enablePolylines: action.payLoad })

    case types.TOGGLED_IS_COMPASS_BEARING_ENABLED:
      return Object.assign({}, state, { isCompassBearingEnabled: action.payLoad })

    case types.STARTED_CREATING_POLYLINE:
      const multiPolylinesWithNewStarted = addStartPointToPolyline(state.multiPolylineDataSource, action.payLoad)

      return Object.assign({}, state, {
        multiPolylineDataSource: multiPolylinesWithNewStarted,
        isCreatingPolylines: true,
        editedStopChanged: true,
        polylineStartPoint: action.payLoad,
        enablePolylines: true
      })

    case types.ADDED_COORDINATES_TO_POLYLINE:
      const multiPolylinesWithCoordsAdded = addPointToPolyline(state.multiPolylineDataSource, action.payLoad)

      return Object.assign({}, state, {
        multiPolylineDataSource: multiPolylinesWithCoordsAdded,
        lastAddedCoordinate: action.payLoad,
        enablePolylines: true
      })

    case types.ADDED_FINAL_COORDINATES_TO_POLYLINE:
      const multiPolylinesWithFinalCoordsAdded = addEndPointToPolyline(state.multiPolylineDataSource.slice(0), action.payLoad)
      return Object.assign({}, state, {
        multiPolylineDataSource: multiPolylinesWithFinalCoordsAdded,
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
      let multiPolyLineLastPolylineRemoved = state.multiPolylineDataSource.slice(0)

      if (multiPolyLineLastPolylineRemoved.length) {
        multiPolyLineLastPolylineRemoved.pop()
      }

      return Object.assign({}, state, {
        multiPolylineDataSource: multiPolyLineLastPolylineRemoved,
        isCreatingPolylines: false
      })

    case types.EDITED_TIME_ESTIMATE_FOR_POLYLINE:
      let multiPolyLineForTimeEstimateChange = state.multiPolylineDataSource.slice(0)

      if (multiPolyLineForTimeEstimateChange[action.payLoad.index] != null) {
        multiPolyLineForTimeEstimateChange[action.payLoad.index] = {
          ...multiPolyLineForTimeEstimateChange[action.payLoad.index],
          estimate: action.payLoad.estimate
        }
      }
      return Object.assign({}, state, { multiPolylineDataSource: multiPolyLineForTimeEstimateChange})

    case types.SET_ACTIVE_MAP:
      return Object.assign({}, state, { activeMap: action.payLoad})

    case types.SET_FOCUS_ON_ELEMENT:
      return Object.assign({}, state, {
        focusedElement: {
          index: action.payLoad.index,
          type: action.payLoad.type
        }
      })

    default:
      return state
  }
}

export default editStopReducer
