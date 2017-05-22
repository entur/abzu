import * as types from './Types'

var StopPlaceActions = {}

const sendData = (type, payLoad) => {
  return {
    type: type,
    payLoad: payLoad
  }
}

StopPlaceActions.changeLocationNewStop = location => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_LOCATION_NEW_STOP, [location.lat, location.lng]) )
  }
}

StopPlaceActions.useNewStopAsCurrent = () => {
  return function (dispatch) {
    dispatch( sendData(types.USE_NEW_STOP_AS_CURENT, null) )
  }
}

StopPlaceActions.changeStopName = (name) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_STOP_NAME, name) )
  }
}

StopPlaceActions.changeStopDescription = description => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_STOP_DESCRIPTION, description) )
  }
}

StopPlaceActions.changeStopType = type => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_STOP_TYPE, type) )
  }
}

StopPlaceActions.setMarkerOnMap = marker => {
  return function(dispatch) {
    let activeMarker = JSON.parse(JSON.stringify(marker))
    activeMarker.isActive = true
    dispatch( sendData(types.SET_ACTIVE_MARKER, activeMarker) )
  }
}

StopPlaceActions.changeMapCenter = position => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_MAP_CENTER, position) )
  }
}

StopPlaceActions.addAltName = payLoad => {
  return function(dispatch) {
    dispatch( sendData(types.ADDED_ALT_NAME, payLoad) )
  }
}

StopPlaceActions.removeAltName = index => {
  return function(dispatch) {
    dispatch( sendData(types.REMOVED_ALT_NAME, index) )
  }
}

StopPlaceActions.removeElementByType = (index, type) => {
  return function(dispatch) {
    dispatch( sendData(types.REMOVED_ELEMENT_BY_TYPE, {
      index: index,
      type: type
    }) )
  }
}

StopPlaceActions.changeElementName = (index, name, type) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGE_ELEMENT_NAME, {
      name: name,
      index: index,
      type: type
    }))
  }
}

StopPlaceActions.changeCurrentStopPosition = position => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_ACTIVE_STOP_POSITION, {
      location: position
    }))
  }
}

StopPlaceActions.changeWeightingForStop = value => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_WEIGHTING_STOP_PLACE, value) )
  }
}

StopPlaceActions.changeElementDescription = (index, description, type) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGED_ELEMENT_DESCRIPTION, {
      index: index,
      description: description,
      type: type
    }))
  }
}

StopPlaceActions.changeQuayCompassBearing = (index, compassBearing) => {
  return function(dispatch) {
    dispatch( (sendData(types.CHANGED_QUAY_COMPASS_BEARING, {
      index: index,
      compassBearing: compassBearing
    })))
  }
}


StopPlaceActions.setElementFocus = (index, type) => {
  return function(dispatch) {
    dispatch( sendData(types.SET_FOCUS_ON_ELEMENT, {
      index: index,
      type: type
    }))
  }
}

StopPlaceActions.createNewStop = (location) => {
  return function(dispatch) {
    dispatch( sendData(types.CREATED_NEW_STOP, [ Number(location.lat), Number(location.lng) ]) )
  }
}

StopPlaceActions.discardChangesForEditingStop = () => {
  return function(dispatch) {
    dispatch( sendData(types.RESTORED_TO_ORIGINAL_STOP_PLACE, null) )
  }
}

StopPlaceActions.setActiveMap = (map) => {
  return function(dispatch) {
    dispatch( sendData(types.SET_ACTIVE_MAP, map) )
  }
}

StopPlaceActions.addElementToStop = (type, position) => {
  return function(dispatch) {
    if (type === 'stop_place') {
      dispatch( sendData(types.CHANGED_ACTIVE_STOP_POSITION, {
        location: position
      }))
    } else {
      dispatch( sendData(types.ADDED_JUNCTION_ELEMENT, {
        type: type,
        position: position
      }))
    }
  }
}

StopPlaceActions.changeElementPosition = (index, type, position) => {
  return function(dispatch) {
    dispatch( sendData(types.CHANGE_ELEMENT_POSITION, {
      index: index,
      position: position,
      type: type
    }))
  }
}

StopPlaceActions.changeParkingTotalCapacity = (index, totalCapacity) => dispatch => {
  dispatch(sendData(types.CHANGED_PARKING_TOTAL_CAPACITY, {
    index: index,
    totalCapacity: totalCapacity
    })
  )
}

StopPlaceActions.changeParkingName = (index, name) => dispatch => {
  dispatch(sendData(types.CHANGED_PARKING_NAME, {
      index: index,
      name: name
    })
  )
}

export default StopPlaceActions
