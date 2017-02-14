import { LatLng } from 'leaflet'

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

      let coordsArray = arrayOfPolylinesFromPolyline(multiPolyline[polylineIndex])
      let latlngDistances = coordsArray.map ( (position) => new LatLng(position[0], position[1]))
      let totalDistance = 0

      for (let i = 0; i < latlngDistances.length; i++) {
        if (latlngDistances[i+1] == null) break
        totalDistance += latlngDistances[i].distanceTo(latlngDistances[i+1])
      }
      const walkingSpeed = 1.34112  // i.e. 3 mph / 3.6
      multiPolyline[polylineIndex].distance = totalDistance
      multiPolyline[polylineIndex].estimate = Math.max(Math.floor(totalDistance / ( walkingSpeed*60 )), 1)
    }

    return multiPolyline
  } catch(e) {
    console.error('addEndPointToPolyline', e)
  }
}


export const setDefaultCompassBearingisEnabled = stop => {
  if (!stop || !stop.markerProps) return false

  const withoutCompassBearing = ['railStation', 'harbourPort', 'busStation', 'airport']

  if (withoutCompassBearing.indexOf(stop.markerProps.stopPlaceType) > -1) {
    return false
  }

  return !(stop.markerProps.quays && stop.markerProps.quays.length > 2)
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


const arrayOfPolylinesFromPolyline = (dataSourceItem) => {

  let arrayOfPolylines = []

  if (dataSourceItem.startPoint) {
    arrayOfPolylines.push(dataSourceItem.startPoint.coordinates)
  }

  if (dataSourceItem.inlinePositions.length) {
    dataSourceItem.inlinePositions.forEach((inlinePosition) => {
      arrayOfPolylines.push(inlinePosition)
    })
  }

  if (dataSourceItem.endPoint) {
    arrayOfPolylines.push(dataSourceItem.endPoint.coordinates)
  }

  return arrayOfPolylines
}

