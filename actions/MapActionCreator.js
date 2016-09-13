import * as types from './actionTypes'

const MapActionCreator = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

MapActionCreator.setActiveMarkers = (activeMarkers, centerPosition) => {
  return function(dispatch) {
    dispatch( sendData(types.SET_ACTIVE_MARKERS, activeMarkers) )
    dispatch( sendData(types.CHANGED_MAP_CENTER, centerPosition) )
    dispatch( sendData(types.SET_ZOOM, 15) )
  }
}

export default MapActionCreator
