import * as types from './actionTypes'

var MapActionCreator = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

MapActionCreator.setActiveMarkers = (activeMarker) => {
  return function(dispatch) {
    dispatch( sendData(types.SET_ACTIVE_MARKERS, activeMarker) )
    dispatch( sendData(types.CHANGED_MAP_CENTER, activeMarker.position) )
    dispatch( sendData(types.SET_ZOOM, 15) )
  }
}

MapActionCreator.addNewQuay = () => {
  return function(dispatch) {
    dispatch( sendData(types.ADDED_NEW_QUAY, null) )
  }
}

MapActionCreator.removeQuay = (index) => {
  return function(dispatch) {
    dispatch( sendData(types.REMOVED_QUAY, index) )
  }
}

MapActionCreator.changeQuayName = (index, name) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_NAME, {
      name: name,
      index: index
    }))
  }
}

MapActionCreator.changeQuayType = (index, type) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_TYPE, {
      index: index,
      type: type
    }))
  }
}

MapActionCreator.changeQuayPosition = (index, position) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_POSITION, {
      index: index,
      position: position
    }))
  }
}

MapActionCreator.changeQuayDescription = (index, description) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_QUAY_DESCRIPTION, {
      index: index,
      description: description
    }))
  }
}

export default MapActionCreator
