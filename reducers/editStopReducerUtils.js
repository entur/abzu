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