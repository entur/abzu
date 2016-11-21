import * as types from './../actions/actionTypes'
import { setDecimalPrecision } from '../utils'

const initialState = {
  centerPosition: [
    67.928595,
    13.083002,
  ],
  neighbouringMarkers: [],
  zoom: 17,
  activeStopIsLoading: false,
  editedStopChanged: false,
  nearbyStopsCancelToken: null,
  activeStopPlaceOriginal: [],
  activeStopPlace: null,
  multiPolylineDataSource: [],
  enablePolylines: true,
  isCreatingPolylines: false,
  polylineStartQuay: {
    coordinates: [],
    quayIndex: null
  }
}

const editStopReducer = (state = initialState, action) => {

  switch (action.type) {

    case types.CHANGED_MAP_CENTER:
      return Object.assign({}, state, { centerPosition: action.payLoad })

    case types.RECEIVED_STOP:
      const original = JSON.parse(JSON.stringify(action.payLoad))
      // patch for request latency from server, seeing that state can be replaced by HTTP response sequence misorder
      let filteredNeighbouringMarkers = state.neighbouringMarkers.filter((stop) => stop.markerProps.id !== action.payLoad.markerProps.id)
      return Object.assign({}, state, {
        activeStopPlaceOriginal: original,
        editedStopChanged: false,
        activeStopIsLoading: false,
        activeStopPlace: action.payLoad,
        neighbouringMarkers: filteredNeighbouringMarkers,
        multiPolylineDataSource: [],
      })

    case types.REQUESTED_STOP:
      return Object.assign({}, state, { activeStopIsLoading: true})

    case types.ERROR_STOP:
      return Object.assign({}, state, { activeStopIsLoading: false})

    case types.ADDED_NEW_QUAY:
      let markerToExpand = Object.assign({}, state.activeStopPlace, {})

      let newQuay = {
        name: "",
        shortName: "",
        description: "",
        centroid: {
          location: {
            latitude: setDecimalPrecision(Number(Number(markerToExpand.markerProps.position[0]) + ( Math.floor((Math.random() * 10) + 1) / 10000 )), 6),
            longitude: setDecimalPrecision(Number(Number(markerToExpand.markerProps.position[1]) + ( Math.floor((Math.random() * 10) + 1) / 10000 )), 6)
          }
        },
        allAreasWheelchairAccessible: false,
        quayType: 'other',
        new: true
      }

      markerToExpand.markerProps.quays.push(newQuay)

      return Object.assign({}, state, { editedStopChanged: true, activeStopPlace: markerToExpand})

    case types.REMOVED_QUAY:
      let markerToReduce = Object.assign({}, state.activeStopPlace, {})
      markerToReduce.markerProps.quays.splice(action.payLoad,1)

      const multiPolylinesWithQuayRemoved = changePositionInPolyLineUponQuayRemove(
          state.multiPolylineDataSource.slice(0),
          action.payLoad
      )

      let newPolylineStartQuay = state.polylineStartQuay
      if (newPolylineStartQuay == action.payLoad) {
        newPolylineStartQuay = null
      }

      return Object.assign({}, state, {
        editedStopChanged: true,
        activeStopPlace: markerToReduce,
        multiPolylineDataSource: multiPolylinesWithQuayRemoved,
        polylineStartQuay: newPolylineStartQuay
      })

    case types.CHANGED_QUAY_NAME:
      let markerToChangeQN = Object.assign({}, state.activeStopPlace,{})
      markerToChangeQN.markerProps.quays[action.payLoad.index].name = action.payLoad.name

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeQN})

    case types.CHANGED_QUAY_DESCRIPTION:
      let markerToChangeQD = Object.assign({}, state.activeStopPlace,{})
      markerToChangeQD.markerProps.quays[action.payLoad.index].description = action.payLoad.description

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeQD})

    case types.CHANGED_WHA:
      let markerToChangeWHA = Object.assign({}, state.activeStopPlace,{})
      markerToChangeWHA.markerProps.quays[action.payLoad.index].allAreasWheelchairAccessible = action.payLoad.value

      return Object.assign({}, state, {editedStopChanged: true, activeStopPlace: markerToChangeWHA})

    case types.CHANGED_QUAY_POSITION:

      let quayIndex = action.payLoad.quayIndex

      let activeStopPlacesQP = {...state.activeStopPlace}

      activeStopPlacesQP.markerProps.quays[quayIndex].centroid.location = {
          latitude: action.payLoad.position.lat,
          longitude: action.payLoad.position.lng
      }

      let changedQuayMultiPolyline = changePositionInPolyLineUponQuayMove(
          state.multiPolylineDataSource.slice(0),
          quayIndex,
          [action.payLoad.position.lat, action.payLoad.position.lng]
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

      return Object.assign({}, state, {nearbyStopsCancelToken: action.payLoad})

    case types.RECEIVED_STOPS_EDITING_NEARBY:
      // patch for request latency from server, seeing that state can be replaced by HTTP response sequence misorder
      let filteredStopsNearby = action.payLoad.filter((stop) => stop.markerProps.id !== state.activeStopPlace.markerProps.id)

      return Object.assign({}, state, {neighbouringMarkers: filteredStopsNearby})

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

    case types.STARTED_CREATING_POLYLINE:
      const multiPolylinesWithNewStarted = addFirstQuayToPolyline(state.multiPolylineDataSource, action.payLoad)

      return Object.assign({}, state, {
        multiPolylineDataSource: multiPolylinesWithNewStarted,
        isCreatingPolylines: true,
        editedStopChanged: true,
        polylineStartQuay: action.payLoad
      })

    case types.ADDED_COORDINATES_TO_POLYLINE:
      const multiPolylinesWithCoordsAdded = addPointToPolyline(state.multiPolylineDataSource, action.payLoad)

      return Object.assign({}, state, {
        multiPolylineDataSource: multiPolylinesWithCoordsAdded,
        lastAddedCoordinate: action.payLoad
      })

    case types.ADDED_FINAL_COORDINATES_TO_POLYLINE:
      const multiPolylinesWithFinalCoordsAdded = addFinalQuayPointToPolyline(state.multiPolylineDataSource.slice(0), action.payLoad)
      return Object.assign({}, state, {
        multiPolylineDataSource: multiPolylinesWithFinalCoordsAdded,
        isCreatingPolylines: false
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

    default:
      return state
  }
}

const addFirstQuayToPolyline = (multiPolylineDataSource, source) => {

  try {

    let polyline = {
      startQuay: {
        coordinates: source.coordinates.map( (c) => Number(c)),
        index: source.quayIndex
      },
      inlinePositions: []
    }

    return multiPolylineDataSource.concat(polyline)

  } catch(e) {
    console.error('addFirstQuayToPolyline', e)
  }
}

const addPointToPolyline = (multiPolyline, coords) => {

  try {

    let polylineIndex = multiPolyline.length-1

    if (multiPolyline[polylineIndex]) {
      multiPolyline[polylineIndex].inlinePositions.push([Number(coords[0]), Number(coords[1])])
    }
    return multiPolyline
  } catch(e) {
    console.error('addPointToPolyline', e)
  }

}

const addFinalQuayPointToPolyline = (multiPolyline, source) => {

  try {

    let polylineIndex = multiPolyline.length-1

    if (multiPolyline[polylineIndex]) {
      multiPolyline[polylineIndex].endQuay = {
        coordinates: source.coordinates.map( (c) => Number(c)),
        index: source.quayIndex
      }
    }
    return multiPolyline
  } catch(e) {
    console.error('addFinalQuayPointToPolyline', e)
  }
}

const changePositionInPolyLineUponQuayMove = (multiPolyline, quayIndex, coordinates) => {

  multiPolyline.map( (polyline) => {

    if (polyline.startQuay && polyline.startQuay.index == quayIndex) {
      polyline.startQuay.coordinates = coordinates.map( (coordinate) => Number(coordinate))
    }

    if (polyline.endQuay && polyline.endQuay.index == quayIndex) {
      polyline.endQuay.coordinates = coordinates.map( (coordinate) => Number(coordinate))
    }
    return polyline
  })
  return multiPolyline
}

const changePositionInPolyLineUponQuayRemove =  (multiPolyline, quayIndex) => {

  return multiPolyline.filter( (polyline) => {
    return ((polyline.startQuay.index !== quayIndex) &&
        (polyline.endQuay.index !== quayIndex))
  })
}

export default editStopReducer
