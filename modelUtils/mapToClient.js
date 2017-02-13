import { setDecimalPrecision } from '../utils/'

const helpers = {}

helpers.mapStopToClientStop = (stop, isActive) => {

  try {
    const { latitude, longitude } = stop.location

    let formattedStop = {
      id: stop.id,
      name: stop.name.value,
      location: [ setDecimalPrecision(latitude, 6), setDecimalPrecision(longitude, 6) ],
      stopPlaceType: stop.stopPlaceType,
      allAreasWheelchairAccessible: stop.allAreasWheelchairAccessible,
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

    if (isActive) {

      formattedStop.quays = []
      formattedStop.entrances = []
      formattedStop.pathJunctions = []

      if (stop.quays) {
        formattedStop.quays = stop.quays.map( quay => helpers.mapQuayToClientQuay(quay))
      }
    }

    return formattedStop
  } catch (e) {
    console.log("error", e)
  }

}

helpers.mapQuayToClientQuay = quay => {
  const { latitude, longitude } = quay.location

  return {
    id: quay.id,
    location: [ setDecimalPrecision(latitude, 6), setDecimalPrecision(longitude, 6) ],
    allAreasWheelChairAccessible: quay.allAreasWheelChairAccessible,
    compassBearing: quay.compassBearing
  }
}

helpers.mapNeighbourStopsToClientStops = stops => {
  return stops.map( stop => helpers.mapStopToClientStop(stop, false))
}

helpers.mapSearchResultatToClientStops = stops => {
  return stops.map( stop => {
    const { latitude, longitude } = JSON.parse(JSON.stringify(stop.location))
    return {
      id: stop.id,
      name: stop.name.value,
      location: [ setDecimalPrecision(latitude, 6), setDecimalPrecision(longitude, 6) ],
      stopPlaceType: stop.stopPlaceType,
      topographicPlace: (stop.topographicPlace && stop.topographicPlace.name) ? stop.topographicPlace.name.value : '',
      parentTopographicPlace: (stop.topographicPlace && stop.topographicPlace.parentTopographicPlace && stop.topographicPlace.parentTopographicPlace.name) ?  stop.topographicPlace.parentTopographicPlace.name.value : '',
      isActive: false
    }
  })
}

helpers.createNewStopFromLocation = location => {
  return ({
    id: null,
    name: '',
    description: '',
    location: location.map ( pos => setDecimalPrecision(pos, 6)),
    stopPlaceType: null,
    allAreasWheelchairAccessible: false,
    topographicPlace: '',
    quays: [],
    entrances: [],
    pathJunctions: [],
    isNewStop: true,
    isActive: true
  })
}

helpers.mapLocationToPosition = location => {
  if (!location && !location.length) return [67.928595, 13.083002]
  return [ setDecimalPrecision(location.latitude, 6), setDecimalPrecision(location.longitude, 6) ]
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
      copy.quays[index] = Object.assign({}, copy.quays[index], { name: name })
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

const removeElementByIndex = (list, index) =>
  [
    ...list.slice(0, index),
    ...list.slice(index + 1)
  ]

export default helpers