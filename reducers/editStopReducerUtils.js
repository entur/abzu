import { elementMap } from './../actions/elementTypes'

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
  new: true
}

export const addStartPointToPolyline = (multiPolylineDataSource, source) => {
  try {
    let polyline = {
      startPoint: {
        coordinates: source.coordinates.map( (c) => Number(c)),
        index: source.index,
        type: source.type
      },
      inlinePositions: []
    }
    return multiPolylineDataSource.concat(polyline)
  } catch(e) {
    console.error('addStartPointToPolyline', e)
  }
}

export const addPointToPolyline = (multiPolyline, coords) => {
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

export const addEndPointToPolyline = (multiPolyline, source) => {
  try {
    let polylineIndex = multiPolyline.length-1

    if (multiPolyline[polylineIndex]) {
      multiPolyline[polylineIndex].endPoint = {
        coordinates: source.coordinates.map( (c) => Number(c)),
        index: source.index,
        type: source.type
      }
    }
    return multiPolyline
  } catch(e) {
    console.error('addEndPointToPolyline', e)
  }
}

export const changePositionInPolyLineUponPointMove = (multiPolyline, index, coordinates, type) => {
  multiPolyline.map( (polyline) => {

    if (polyline.startPoint && polyline.startPoint.index == index && polyline.startPoint.type === type) {
      polyline.startPoint.coordinates = coordinates.map( (coordinate) => Number(coordinate))
    }

    if (polyline.endPoint && polyline.endPoint.index == index && polyline.endPoint.type === type) {
      polyline.endPoint.coordinates = coordinates.map( (coordinate) => Number(coordinate))
    }
    return polyline
  })
  return multiPolyline
}

export const changePositionInPolyLineUponPointRemove =  (multiPolyline, index, type) => {
  return multiPolyline.filter( (polyline) => {
    return ((polyline.startPoint.index !== index) &&
    (polyline.endPoint.index !== index) && (polyline.endPoint.type !== type))
  })
}

export const setDefaultCompassBearingisEnabled = stop => {
  if (!stop || !stop.markerProps) return false

  const withoutCompassBearing = ['railStation', 'harbourPort', 'busStation', 'airport']

  if (withoutCompassBearing.indexOf(stop.markerProps.stopPlaceType) > -1) {
    return false
  }

  return !(stop.markerProps.quays && stop.markerProps.quays.length > 2)
}

export const removeElementByType = (action, state) => {
  let marker = Object.assign({}, state.activeStopPlace, {})

  if (action.payLoad.type === 'quay') {
    marker.markerProps.quays.splice(action.payLoad.index, 1)
  } else if (action.payLoad.type === 'entrance') {
    marker.markerProps.entrances.splice(action.payLoad.index, 1)
  } else if (action.payLoad.type === 'pathJunction') {
    marker.markerProps.pathJunctions.splice(action.payLoad.index, 1)
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
    activeStopPlace: marker,
    multiPolylineDataSource: multiPolylinesWithElementRemoved,
    polylineStartPoint: newPolylineStartElement
  })
}

export const updateNeighbourMarkersWithQuays = (map, neighbourMarkers) => {

  let newNeighbourMarkers = neighbourMarkers.slice()

  map.forEach((quays, id) => {

    neighbourMarkers.forEach((neighbour) => {
      if (neighbour.markerProps.id == id) {
        let neighbourQuays = quays.map((quay) => {
          quay.belongsToNeighbourStop = true
          return quay
        })
        neighbour.markerProps.quays = neighbourQuays
      }
    })
  })
    return newNeighbourMarkers
}


  export const changeElementNameByType = (type, action, state) => {
    let marker = Object.assign({}, state.activeStopPlace,{})
    let typeName = elementMap[type]
    marker.markerProps[typeName][action.payLoad.index].name = action.payLoad.name

    return Object.assign({}, state, { editedStopChanged: true, activeStopPlace: marker })
  }

  export const changeElementDescriptionByType = (type, action, state) => {
    let marker = Object.assign({}, state.activeStopPlace,{})
    let typeName = elementMap[type]
    marker.markerProps[typeName][action.payLoad.index].description = action.payLoad.description

    return Object.assign({}, state, { editedStopChanged: true, activeStopPlace: marker })

  }

  export const changeJunctionElementPosition = (action, state) => {
    let stop = Object.assign({}, state.activeStopPlace, {})
    let newJunctionCentroidId = {
      location: {
        latitude: action.payLoad.position.lat,
        longitude: action.payLoad.position.lng
      }
    }

    if (action.payLoad.type === 'pathJunction') {
      stop.markerProps.pathJunctions[action.payLoad.index].centroid = newJunctionCentroidId
    } else if (action.payLoad.type === 'entrance') {
      stop.markerProps.entrances[action.payLoad.index].centroid = newJunctionCentroidId
    }

    let changedJunctionMultiPolyline = changePositionInPolyLineUponPointMove(
      state.multiPolylineDataSource.slice(0),
      action.payLoad.index,
      [action.payLoad.position.lat, action.payLoad.position.lng],
      action.payLoad.type
    )

    return Object.assign({}, state, {
      editStopChanged: true,
      activeStopPlace: stop,
      multiPolylineDataSource: changedJunctionMultiPolyline,
    })
  }

  export const changeQuayPosition = (action, state) => {
    const quayIndex = action.payLoad.quayIndex

    let stopPlace = {...state.activeStopPlace}

    stopPlace.markerProps.quays[quayIndex].centroid.location = {
      latitude: action.payLoad.position.lat,
      longitude: action.payLoad.position.lng
    }

    const changedQuayMultiPolyline = changePositionInPolyLineUponPointMove(
      state.multiPolylineDataSource.slice(0),
      quayIndex,
      [action.payLoad.position.lat, action.payLoad.position.lng],
      'quay'
    )

    return Object.assign({}, state, {
      editedStopChanged: true,
      activeStopPlace: stopPlace,
      multiPolylineDataSource: changedQuayMultiPolyline,
    })
  }

  export const addJunctionElement = (action, state) => {
    let stop = Object.assign({}, state.activeStopPlace, {})
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
      stop.markerProps.pathJunctions = stop.markerProps.pathJunctions || []
      stop.markerProps.pathJunctions.push(newJunctionElement)
    } else if (action.payLoad.type === 'entrance') {
      stop.markerProps.entrances = stop.markerProps.entrances || []
      stop.markerProps.entrances.push(newJunctionElement)
    } else if (action.payLoad.type === 'quay') {
      stop.markerProps.quays = stop.markerProps.quays || []
      const newQuayToAdd = Object.assign({}, newQuay, {
        centroid: newJunctionElement.centroid
      })
      stop.markerProps.quays.push(newQuayToAdd)
    } else if (action.payLoad.type === 'stop_place') {
      stop.markerProps.position = junctionPosition
    }
    else{
      console.error(`Type of ${action.payLoad.type} is not a supported junction element`)
    }

    return Object.assign({}, state, {
      editedStopChanged: true,
      activeStopPlace: stop
    })
  }





