import * as types from './actionTypes'

var MapActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

MapActions.changeLocationNewStop = location => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_LOCATION_NEW_STOP, [location.lat, location.lng]) )
  }
}

MapActions.useNewStopAsCurrent = () => {
  return function (dispatch) {
    dispatch( sendData(types.USE_NEW_STOP_AS_CURENT, null) )
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

MapActions.setMarkerOnMap = marker => {
  return function(dispatch) {
    let activeMarker = JSON.parse(JSON.stringify(marker))
    activeMarker.isActive = true
    dispatch( sendData(types.SET_ACTIVE_MARKER, activeMarker) )
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

MapActions.changeEntranceName = (index, name) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_ENTRANCE_NAME, {
      name: name,
      index: index
    }))
  }
}

MapActions.changePathJuctionName = (index, name) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_PATH_JUNCTION_NAME, {
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

MapActions.changeEntranceDescription = (index, description) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_ENTRANCE_DESCRIPTION, {
      index: index,
      description: description
    }))
  }
}

MapActions.changePathJunctionDescription = (index, description) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_PATH_JUNCTION_DESCRIPTION, {
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

MapActions.setElementFocus = (index, type) => {
  return function(dispatch) {
    dispatch( sendData(types.SET_FOCUS_ON_ELEMENT, {
      index: index,
      type: type
    }))
  }
}

MapActions.createNewStop = (location) => {
  return function(dispatch) {
    dispatch( sendData(types.CREATED_NEW_STOP, [ Number(location.lat), Number(location.lng) ]) )
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

export default MapActions
