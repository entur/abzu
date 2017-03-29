import { setDecimalPrecision, getIn } from '../utils/'
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

helpers.mapPathLinkToClient = pathLinks => {

  if (!pathLinks) return []

  return pathLinks.map( pathLink => {

    let clientPathLink = JSON.parse(JSON.stringify(pathLink))

    let latlngCoordinates = []

    let startCoordinates = getIn(clientPathLink, ['from', 'placeRef', 'addressablePlace', 'geometry', 'coordinates'], null)
    let inBetweenCoordinates = getIn(clientPathLink, ['geometry', 'coordinates'])
    let endCoordinates = getIn(clientPathLink, ['to', 'placeRef', 'addressablePlace', 'geometry', 'coordinates'], null)

    if (startCoordinates) {
      startCoordinates[0].reverse()
      latlngCoordinates.push(startCoordinates[0])
    }

    if (inBetweenCoordinates) {
      inBetweenCoordinates.map( lngLat => lngLat.reverse())
      clientPathLink.inBetween = inBetweenCoordinates
      latlngCoordinates.push.apply(latlngCoordinates, clientPathLink.inBetween)
    }

    if (endCoordinates) {
      endCoordinates[0].reverse()
      latlngCoordinates.push(endCoordinates[0])
    }

    clientPathLink.distance = calculateDistance(latlngCoordinates)

    if (pathLink.transferDuration && pathLink.transferDuration.defaultDuration) {
      clientPathLink.estimate = pathLink.transferDuration.defaultDuration
    } else {
      clientPathLink.estimate = calculateEstimate(clientPathLink.distance)
    }
    return clientPathLink
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
        placeRef: {
          ref: action.payLoad.id,
          addressablePlace: {
            id: action.payLoad.id,
            version: 'any',
            geometry: {
              type: 'Point',
              coordinates: [ action.payLoad.coordinates ]
            }
          }
        }
      }
    }
    return pathLink.concat(newPathLink)
  }

  if (action.type === types.ADDED_FINAL_COORDINATES_TO_POLYLINE) {

    let lastPathLink = JSON.parse(JSON.stringify(pathLink[pathLink.length-1]))

    let latlngCoordinates = []

    let endCoordinates = getIn(lastPathLink, ['to', 'placeRef', 'addressablePlace', 'geometry', 'coordinates'], null)

    if (endCoordinates) {
      latlngCoordinates.push(endCoordinates[0])
    }

    if (lastPathLink.inBetween) {
      latlngCoordinates.push.apply(latlngCoordinates, lastPathLink.inBetween)
    }

    lastPathLink.to = {
      placeRef: {
        ref: action.payLoad.id,
        version: 'any',
        addressablePlace: {
          id: action.payLoad.id,
          geometry: {
            type: 'Point',
            coordinates: [ action.payLoad.coordinates ]
          }
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

    if (stop.importedId) {
      formattedStop.importedId = stop.importedId
    }

    if (isActive) {

      formattedStop.quays = []
      formattedStop.entrances = []
      formattedStop.pathJunctions = []
      formattedStop.parking = []

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

  if (quay.importedId) {
    clientQuay.importedId = quay.importedId
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

    let parentTopographicPlace = getIn(stop, ['topographicPlace', 'parentTopographicPlace', 'name', 'value'], '')
    let topographicPlace = getIn(stop, ['topographicPlace', 'name', 'value'], '')

    const clientStop = {
      id: stop.id,
      name: stop.name.value,
      isMissingLocation: !stop.geometry,
      stopPlaceType: stop.stopPlaceType,
      topographicPlace: topographicPlace,
      parentTopographicPlace: parentTopographicPlace,
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
    parking: [],
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
    case 'parking':
      copy.parking = copy.parking.concat(newElement); break;

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
    case 'parking':
      copy.parking = removeElementByIndex(copy.parking, index)
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