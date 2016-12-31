import * as types from './actionTypes'
import { formatMarkers } from './AjaxActions'

var MapActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

MapActions.changeStopName = (name) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_STOP_NAME, name) )
  }
}

MapActions.changeStopDescription = (description) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_STOP_DESCRIPTION, description) )
  }
}

MapActions.changeStopType = (type) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_STOP_TYPE, type) )
  }
}

MapActions.setActiveMarkers = (activeMarker) => {
  return function(dispatch) {
    activeMarker.active = true
    dispatch( sendData(types.SET_ACTIVE_MARKER, activeMarker) )
    dispatch( MapActions.changeMapCenter(activeMarker.markerProps.position, 15))
  }
}

MapActions.changeMapCenter = (position, zoom) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_MAP_CENTER, position) )
    dispatch( sendData(types.SET_ZOOM, zoom) )
  }
}

MapActions.removeElementByType = (index, type) => {
  return function(dispatch) {
    dispatch( sendData(types.REMOVED_ELEMENT_BY_TYPE, {
      index: index,
      type: type
    }) )
  }
}

MapActions.changeQuayName = (index, name) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_NAME, {
      name: name,
      index: index
    }))
  }
}

MapActions.changeQuayPosition = (index, position) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_POSITION, {
      quayIndex: index,
      position: position
    }))
  }
}

MapActions.changeActiveStopPosition = (position) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_ACTIVE_STOP_POSITION, {
      position: position
    }))
  }
}

MapActions.changeQuayDescription = (index, description) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_DESCRIPTION, {
      index: index,
      description: description
    }))
  }
}

MapActions.changeQuayCompassBearing = (index, compassBearing) => {
  return function(dispatch) {
    dispatch( (sendData(types.CHANGED_QUAY_COMPASS_BEARING, {
      index: index,
      compassBearing: compassBearing
    })))
  }
}

MapActions.changeWHA = (index, value) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_WHA, {
      index: index,
      value: value
    }))
  }
}

MapActions.setQuayFocus = (index) => {
  return function(dispatch) {
    dispatch( sendData(types.SET_FOCUS_ON_QUAY, index))
  }
}

MapActions.createNewStop = (coordinates) => {
  return function(dispatch) {
    let stop = createNewStopTemplate(coordinates)
    dispatch( sendData(types.CREATED_NEW_STOP, stop) )
  }
}

MapActions.discardChangesForEditingStop = () => {
  return function(dispatch) {
    dispatch( sendData(types.RESTORED_TO_ORIGINAL_STOP_PLACE, null) )
  }
}

MapActions.setActiveMap = (map) => {
  return function(dispatch) {
    dispatch( sendData(types.SET_ACTIVE_MAP, map) )
  }
}

MapActions.addJunctionElement = (type, latlng) => {
  return function(dispatch) {
    dispatch( sendData(types.ADDED_JUNCTION_ELEMENT, {
      type: type,
      position: [latlng.lat, latlng.lng]
    }))
  }
}

MapActions.changeJunctionPosition = (index, type, position) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_JUNCTION_POSITION, {
      index: index,
      position: position,
      type: type
    }))
  }
}

const createNewStopTemplate = (coordinates) => {

  let newStopPlace = formatMarkers([{
    name: "",
    description: "",
    municipality: "",
    isNewStop: true,
    county: "",
    centroid: {
      location: {
        longitude: -1,
        latitude: -1
      }
    },
    allAreasWheelchairAccessible: false,
    stopPlaceType: null,
    quays: []
  }])[0]

  newStopPlace.markerProps.position = [coordinates.lat, coordinates.lng]
  newStopPlace.isNewStop = true

  return newStopPlace
}


export default MapActions
