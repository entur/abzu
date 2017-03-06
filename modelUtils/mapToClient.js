import { setDecimalPrecision } from '../utils/'
import { LatLng } from 'leaflet'
import * as types from "../actions/Types";

const helpers = {}

const calculateDistance = coords => {
  let latlngDistances = coords.map ( (position) => new LatLng(position[0], position[1]))
  let totalDistance = 0
  for (let i = 0; i < latlngDistances.length; i++) {
    if (latlngDistances[i+1] == null) break
    totalDistance += latlngDistances[i].distanceTo(latlngDistances[i+1])
  }

  return totalDistance
}

const calculateEstimate = distance => {
  const walkingSpeed = 1.34112  // i.e. 3 mph / 3.6
  return Math.max(Math.floor(distance / ( walkingSpeed)), 1)
}

helpers.mapPathLinkToClient = pathLink => {

  if (!pathLink) return []

  return pathLink.map( link => {

    let newLink = JSON.parse(JSON.stringify(link))
    let latlngCoordinates = []

    if (newLink.from.quay && newLink.from.quay.geometry.coordinates && newLink.from.quay.geometry.coordinates.length) {

      newLink.from.quay.geometry.coordinates[0].reverse()
      latlngCoordinates.push(newLink.from.quay.geometry.coordinates[0])
    }

    if (newLink.geometry && newLink.geometry.coordinates && newLink.geometry.coordinates.length) {
      newLink.inBetween = newLink.geometry.coordinates.map( lngLat => lngLat.reverse())
      newLink.inBetween.forEach( coords => {
        latlngCoordinates.push(coords)
      })
    }

    if (newLink.to.quay && newLink.to.quay.geometry.coordinates && newLink.to.quay.geometry.coordinates) {
      newLink.to.quay.geometry.coordinates[0].reverse()
      latlngCoordinates.push(newLink.to.quay.geometry.coordinates[0])
    }

    newLink.distance = calculateDistance(latlngCoordinates)

    if (link.transferDuration && link.transferDuration.defaultDuration) {
      newLink.estimate = link.transferDuration.defaultDuration
    } else {
      newLink.estimate = calculateEstimate(newLink.distance)
    }
    return newLink
  })

}

helpers.updateEstimateForPathLink = (action, pathLink) => {
  const { index, estimate } = action.payLoad
  let updatedPathLink = JSON.parse(JSON.stringify(pathLink))
  updatedPathLink[index].estimate = estimate
  return updatedPathLink
}

helpers.addNewPointToPathlink = (action, pathLink) => {
  const coordinates = action.payLoad
  let updatedPathLink = JSON.parse(JSON.stringify(pathLink))

  let lastPathLink = updatedPathLink[updatedPathLink.length-1]

  if (!lastPathLink.inBetween) {
    lastPathLink.inBetween = []
  }

  lastPathLink.inBetween.push(coordinates)

  return updatedPathLink
}

helpers.updatePathLinkWithNewEntry = (action, pathLink) => {

  if (action.type === types.STARTED_CREATING_POLYLINE) {

    let newPathLink = {
      from: {
        quay: {
          id: action.payLoad.id,
          geometry: {
            type: 'Point',
            coordinates: [ action.payLoad.coordinates ]
          }
        }
      }
    }
    return pathLink.concat(newPathLink)
  }

  if (action.type === types.ADDED_FINAL_COORDINATES_TO_POLYLINE) {

    let lastPathLink = JSON.parse(JSON.stringify(pathLink[pathLink.length-1]))

    let latlngCoordinates = []

    if (lastPathLink.from && lastPathLink.from.quay) {
      latlngCoordinates.push(lastPathLink.from.quay.geometry.coordinates[0])
    }

    lastPathLink.to = {
      quay: {
        id: action.payLoad.id,
        geometry: {
          type: 'Point',
          coordinates: [ action.payLoad.coordinates ]
        }
      }
    }

    latlngCoordinates.push(action.payLoad.coordinates)

    lastPathLink.distance = calculateDistance(latlngCoordinates)
    lastPathLink.estimate = calculateEstimate(lastPathLink.distance)

    return pathLink.slice(0, pathLink.length-1).concat(lastPathLink)
  }

}

helpers.mapStopToClientStop = (stop, isActive) => {

  try {

    let formattedStop = {
      id: stop.id,
      name: stop.name.value,
      stopPlaceType: stop.stopPlaceType,
      isActive: isActive
    }

    if (stop.topographicPlace) {
      if (stop.topographicPlace.name) {
        formattedStop.topographicPlace = stop.topographicPlace.name.value
      }
      if (stop.topographicPlace.parentTopographicPlace && stop.topographicPlace.parentTopographicPlace.name) {
        formattedStop.parentTopographicPlace =  stop.topographicPlace.parentTopographicPlace.name.value
      }
    }

    if (stop.description) {
      formattedStop.description = stop.description.value
    }


    if (stop.geometry && stop.geometry.coordinates) {
      let coordinates = stop.geometry.coordinates[0].slice()
      // Leaflet uses latLng, GeoJSON [long,lat]
      formattedStop.location = [ setDecimalPrecision(coordinates[1], 6), setDecimalPrecision(coordinates[0], 6) ]
    }

    if (isActive) {

      formattedStop.quays = []
      formattedStop.entrances = []
      formattedStop.pathJunctions = []

      if (stop.quays) {
        formattedStop.quays = stop.quays.map( quay => helpers.mapQuayToClientQuay(quay)).sort( (a,b) => (a.publicCode || '') - b.publicCode || '')
      }
    }

    return formattedStop
  } catch (e) {
    console.log("error", e)
  }

}

helpers.mapQuayToClientQuay = quay => {

  const clientQuay = {
    id: quay.id,
    compassBearing: quay.compassBearing,
    publicCode: quay.publicCode,
    description: quay.description ? quay.description.value : ''
  }

  if (quay.geometry && quay.geometry.coordinates) {

    let coordinates = quay.geometry.coordinates[0].slice()

    clientQuay.location = [ setDecimalPrecision(coordinates[1], 6), setDecimalPrecision(coordinates[0], 6) ]
  }

  return clientQuay
}

helpers.mapNeighbourStopsToClientStops = stops => {
  return stops.map( stop => helpers.mapStopToClientStop(stop, false))
}

helpers.mapSearchResultatToClientStops = stops => {
  return stops.map( stop => {
    const clientStop = {
      id: stop.id,
      name: stop.name.value,
      isMissingLocation: !stop.geometry,
      stopPlaceType: stop.stopPlaceType,
      topographicPlace: (stop.topographicPlace && stop.topographicPlace.name) ? stop.topographicPlace.name.value : '',
      parentTopographicPlace: (stop.topographicPlace && stop.topographicPlace.parentTopographicPlace && stop.topographicPlace.parentTopographicPlace.name) ?  stop.topographicPlace.parentTopographicPlace.name.value : '',
      isActive: false
    }

    if (stop.geometry && stop.geometry.coordinates) {

      let coordinates = stop.geometry.coordinates[0].slice()

      clientStop.location = [ setDecimalPrecision(coordinates[1], 6), setDecimalPrecision(coordinates[0], 6) ]

    }

    return clientStop
  })
}

helpers.createNewStopFromLocation = location => {
  return ({
    id: null,
    name: '',
    description: '',
    location: location.map ( pos => setDecimalPrecision(pos, 6)),
    stopPlaceType: null,
    topographicPlace: '',
    quays: [],
    entrances: [],
    pathJunctions: [],
    isNewStop: true,
    isActive: true
  })
}

helpers.getCenterPosition = geometry => {
  if (!geometry) return null
  return [ setDecimalPrecision(geometry.coordinates[0][1], 6), setDecimalPrecision(geometry.coordinates[0][0], 6) ]
}


helpers.updateCurrentStopWithType = (current, type) => {
  return Object.assign({}, current, {
    stopPlaceType: type
  })
}

helpers.updateCurrentStopWithPosition = (current, location) => {
  return Object.assign({}, current, {
    location: location
  })
}

helpers.updateCurrentWithNewElement = (current, payLoad) => {

  const { type, position } = payLoad
  const copy = JSON.parse(JSON.stringify(current))

  const newElement = {
    location: position.slice(),
    compassBearing: null,
    name: '',
  }

  switch (type) {
    case 'quay':
      copy.quays = copy.quays.concat(newElement); break;
    case 'entrance':
      copy.entrances = copy.entrances.concat(newElement); break;
    case 'pathJunction':
      copy.pathJunctions = copy.pathJunctions.concat(newElement); break;

    default: throw new Error('element not supported', type)
  }
  return copy
}

helpers.updateCurrentWithoutElement = (current, payLoad) => {
  const { type, index } = payLoad
  const copy = JSON.parse(JSON.stringify(current))

  switch (type) {
    case 'quay':
      copy.quays = removeElementByIndex(copy.quays, index)
      break
    case 'entrance':
      copy.entrances = removeElementByIndex(copy.entrances, index)
      break
    case 'pathJunction':
      copy.pathJunctions = removeElementByIndex(copy.pathJunctions, index)
      break
    default: throw new Error('element not supported', type)
  }
  return copy
}


helpers.updateCurrentWithElementPositionChange = (current, payLoad) => {
  const { index, type, position } = payLoad
  const copy = JSON.parse(JSON.stringify(current))

  switch (type) {
    case 'quay':
      copy.quays[index] = Object.assign({}, copy.quays[index], { location: position })
      break
    case 'entrance':
      copy.entrances[index] = Object.assign({}, copy.entrances[index], { location: position })
      break
    case 'pathJunction':
      copy.pathJunctions[index] = Object.assign({}, copy.pathJunctions[index], { location: position })
      break
    default: throw new Error('element not supported', type)
  }

  return copy
}

helpers.updateCurrentWithElementNameChange = (current, payLoad) => {
  const { index, type, name } = payLoad
  const copy = JSON.parse(JSON.stringify(current))

  switch (type) {
    case 'quay':
      copy.quays[index] = Object.assign({}, copy.quays[index], { publicCode: name })
      break
    case 'entrance':
      copy.entrances[index] = Object.assign({}, copy.entrances[index], { name: name })
      break
    case 'pathJunction':
      copy.pathJunctions[index] = Object.assign({}, copy.pathJunctions[index], { name: name })
      break
    default: throw new Error('element not supported', type)
  }
  return copy
}

helpers.updateCompassBearing = (current, payLoad) => {
  const { compassBearing, index } = payLoad
  const quaysCopy = current.quays.slice()
  quaysCopy[index].compassBearing = compassBearing
  return {
    ...current, quays: quaysCopy
  }
}

helpers.updateCurrentWithElementDescriptionChange = (current, payLoad) => {
  const { index, type, description } = payLoad
  const copy = JSON.parse(JSON.stringify(current))

  switch (type) {
    case 'quay':
      copy.quays[index] = Object.assign({}, copy.quays[index], { description: description })
      break
    case 'entrance':
      copy.entrances[index] = Object.assign({}, copy.entrances[index], { description: description })
      break
    case 'pathJunction':
      copy.pathJunctions[index] = Object.assign({}, copy.pathJunctions[index], { description: description })
      break
    default: throw new Error('element not supported', type)
  }
  return copy
}

helpers.mapNeighbourQuaysToClient = (original, payLoad) => {

  let neighbourQuaysMap = { ... original } || {}

  if (!payLoad || !payLoad.length) return neighbourQuaysMap

  const stopPlace = payLoad[0]

  neighbourQuaysMap[stopPlace.id] = stopPlace.quays.map( quay => {

    let clientQuay = {}

    clientQuay.id = quay.id

    if (quay.geometry && quay.geometry.coordinates) {
      let coordinates = quay.geometry.coordinates[0].slice()
      clientQuay.location = [ setDecimalPrecision(coordinates[1], 6), setDecimalPrecision(coordinates[0], 6) ]
    }

    clientQuay.compassBearing =  quay.compassBearing

    return clientQuay
  })

  return neighbourQuaysMap
}

const removeElementByIndex = (list, index) =>
  [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ]

export default helpers