import * as types from './../actions/actionTypes'
import Immutable from 'Immutable'
import {
  addStartPointToPolyline,
  addPointToPolyline,
  addEndPointToPolyline,
  changePositionInPolyLineUponPointMove,
  changePositionInPolyLineUponPointRemove,
  setDefaultCompassBearingisEnabled,
  updateNeighbourMarkersWithQuays
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
  }
}

const newQuay = {
  name: "",
  shortName: "",
  description: "",
  centroid: {
    location: {
      latitude: null,
      longitude: null,
    }
  },
  allAreasWheelchairAccessible: false,
  quayType: 'other',
  compassBearing: 0,
  new: true
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
        console.log("newNeigbourQ", newNeighbourQuaysMapHid)
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
        isCompassBearingEnabled: setDefaultCompassBearingisEnabled(action.payLoad)
      })

    case types.REQUESTED_STOP:
      return Object.assign({}, state, { activeStopIsLoading: true})

    case types.ERROR_STOP:
      return Object.assign({}, state, { activeStopIsLoading: false})

    case types.REMOVED_ELEMENT_BY_TYPE:
      let markerToReduce = Object.assign({}, state.activeStopPlace, {})

      if (action.payLoad.type === 'quay') {
        markerToReduce.markerProps.quays.splice(action.payLoad.index, 1)
      } else if (action.payLoad.type === 'entrance') {
        markerToReduce.markerProps.entrances.splice(action.payLoad.index, 1)
      } else if (action.payLoad.type === 'pathJunction') {
        markerToReduce.markerProps.pathJunctions.splice(action.payLoad.index, 1)
      }

      const multiPolylinesWithElementRemoved = changePositionInPolyLineUponPointRemove(
          state.multiPolylineDataSource.slice(0),
          action.payLoad.index,
          action.payLoad.type
      )

      let newPolylineStartElement = state.polylineStartPoint

      if (newPolylineStartElement == action.payLoad) {
        newPolylineStartElement = null
      }

      return Object.assign({}, state, {
        editedStopChanged: true,
        activeStopPlace: markerToReduce,
        multiPolylineDataSource: multiPolylinesWithElementRemoved,
        polylineStartPoint: newPolylineStartElement
      })

    case types.CHANGED_QUAY_NAME:
      let markerToChangeQN = Object.assign({}, state.activeStopPlace,{})
      markerToChangeQN.markerProps.quays[action.payLoad.index].name = action.payLoad.name

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeQN})

    case types.CHANGED_ENTRANCE_NAME:
      let markerToChangeEntrance = Object.assign({}, state.activeStopPlace,{})
      markerToChangeEntrance.markerProps.entrances[action.payLoad.index].name = action.payLoad.name

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeEntrance})

    case types.CHANGED_PATH_JUNCTION_NAME:
      let markerToChangePJ = Object.assign({}, state.activeStopPlace,{})
      markerToChangePJ.markerProps.pathJunctions[action.payLoad.index].name = action.payLoad.name

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangePJ})

    case types.CHANGED_QUAY_DESCRIPTION:
      let markerToChangeQD = Object.assign({}, state.activeStopPlace,{})
      markerToChangeQD.markerProps.quays[action.payLoad.index].description = action.payLoad.description

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeQD})

    case types.CHANGED_ENTRANCE_DESCRIPTION:
      let markerToChangeED = Object.assign({}, state.activeStopPlace,{})
      markerToChangeED.markerProps.entrances[action.payLoad.index].description = action.payLoad.description

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeED})

    case types.CHANGED_PATH_JUNCTION_DESCRIPTION:
      let markerToChangePJD = Object.assign({}, state.activeStopPlace,{})
      markerToChangePJD.markerProps.pathJunctions[action.payLoad.index].description = action.payLoad.description

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangePJD})

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

      case types.CHANGED_QUAY_POSITION:

      let quayIndex = action.payLoad.quayIndex

      let activeStopPlacesQP = {...state.activeStopPlace}

      activeStopPlacesQP.markerProps.quays[quayIndex].centroid.location = {
          latitude: action.payLoad.position.lat,
          longitude: action.payLoad.position.lng
      }

      let changedQuayMultiPolyline = changePositionInPolyLineUponPointMove(
          state.multiPolylineDataSource.slice(0),
          quayIndex,
          [action.payLoad.position.lat, action.payLoad.position.lng],
          'quay'
      )

      return Object.assign({}, state, {
        editedStopChanged: true,
        activeStopPlace: activeStopPlacesQP,
        multiPolylineDataSource: changedQuayMultiPolyline,
      })

    case types.CHANGED_ACTIVE_STOP_POSITION:
      let activeStopPlacesASP = {...state.activeStopPlace}
      const { position } = action.payLoad
      activeStopPlacesASP.markerProps.position = [position.lat, position.lng]

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlacesASP})

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

    case types.CHANGED_STOP_NAME:
      let activeStopPlaceCSN = {...state.activeStopPlace}
      activeStopPlaceCSN.markerProps.name = action.payLoad

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlaceCSN})

    case types.CHANGED_STOP_DESCRIPTION:
      let activeStopPlaceCSD = {...state.activeStopPlace}
      activeStopPlaceCSD.markerProps.description = action.payLoad

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlaceCSD})

    case types.CHANGED_STOP_TYPE:
      let activeStopPlaceCST = {...state.activeStopPlace}
      activeStopPlaceCST.markerProps.stopPlaceType = action.payLoad

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: activeStopPlaceCST})

    case types.RESTORED_TO_ORIGINAL_STOP_PLACE:
      const originalCopy = JSON.parse(JSON.stringify(state.activeStopPlaceOriginal))
      return Object.assign({}, state, {
        editedStopChanged: false,
        activeStopPlace: originalCopy,
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

    case types.SET_FOCUS_ON_QUAY:
      return Object.assign({}, state, { focusedQuayIndex: action.payLoad})

    case types.ADDED_JUNCTION_ELEMENT:

      let stopToExpand = Object.assign({}, state.activeStopPlace, {})
      let junctionPosition = action.payLoad.position.slice(0)

      let newJunctionElement = {
        description: "",
        new: true,
        name: "",
        centroid: {
          location: {
            latitude: junctionPosition[0],
            longitude: junctionPosition[1],
          }
        },
      }

      if (action.payLoad.type === 'pathJunction') {
        stopToExpand.markerProps.pathJunctions = stopToExpand.markerProps.pathJunctions || []
        stopToExpand.markerProps.pathJunctions.push(newJunctionElement)
      } else if (action.payLoad.type === 'entrance') {
        stopToExpand.markerProps.entrances = stopToExpand.markerProps.entrances || []
        stopToExpand.markerProps.entrances.push(newJunctionElement)
      } else if (action.payLoad.type === 'quay') {
        stopToExpand.markerProps.quays = stopToExpand.markerProps.quays || []
        const newQuayToAdd = Object.assign({}, newQuay, {
          centroid: newJunctionElement.centroid
        })
        stopToExpand.markerProps.quays.push(newQuayToAdd)
      } else {
        console.error(`Type of ${action.payLoad.type} is not a supported junction element`)
      }

      return Object.assign({}, state, {
        editedStopChanged: true,
        activeStopPlace: stopToExpand
      })

    case types.CHANGED_JUNCTION_POSITION:
      let stopforNewJunctionPostion = Object.assign({}, state.activeStopPlace, {})
      let newJunctionCentroidId = {
        location: {
          latitude: action.payLoad.position.lat,
          longitude: action.payLoad.position.lng
        }
      }

      if (action.payLoad.type === 'pathJunction') {
        stopforNewJunctionPostion.markerProps.pathJunctions[action.payLoad.index].centroid = newJunctionCentroidId
      } else if (action.payLoad.type === 'entrance') {
        stopforNewJunctionPostion.markerProps.entrances[action.payLoad.index].centroid = newJunctionCentroidId
      }

      let changedJunctionMultiPolyline = changePositionInPolyLineUponPointMove(
        state.multiPolylineDataSource.slice(0),
        action.payLoad.index,
        [action.payLoad.position.lat, action.payLoad.position.lng],
        action.payLoad.type
      )

      return Object.assign({}, state, {
        editStopChanged: true,
        activeStopPlace: stopforNewJunctionPostion,
        multiPolylineDataSource: changedJunctionMultiPolyline,
      })


      default:
        return state
  }
}

export default editStopReducer
