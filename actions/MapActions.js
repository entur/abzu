import * as types from './actionTypes'

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

MapActions.setActiveMarkers = (activeMarker) => {
  return function(dispatch) {
    dispatch( sendData(types.SET_ACTIVE_MARKERS, activeMarker) )
    dispatch( sendData(types.CHANGED_MAP_CENTER, activeMarker.markerProps.position) )
    dispatch( sendData(types.SET_ZOOM, 15) )
  }
}

MapActions.addNewQuay = () => {
  return function(dispatch) {
    dispatch( sendData(types.ADDED_NEW_QUAY, null) )
  }
}

MapActions.removeQuay = (index) => {
  return function(dispatch) {
    dispatch( sendData(types.REMOVED_QUAY, index) )
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

MapActions.changeQuayType = (index, type) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_TYPE, {
      index: index,
      type: type
    }))
  }
}

MapActions.changeQuayPosition = (stopIndex, markerIndex, position) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_POSITION, {
      stopIndex: stopIndex,
      markerIndex: markerIndex,
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

MapActions.changeWHA = (index, value) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_WHA, {
      index: index,
      value: value
    }))
  }
}

export default MapActions
