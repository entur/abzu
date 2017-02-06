import { setDecimalPrecision } from '../utils/'

const helpers = {}

helpers.mapStopToClientStop = (stop, isActive) => {

  let copy = JSON.parse(JSON.stringify(stop))
  const { latitude, longitude } = copy.location

  let formattedStop = {
    id: copy.id,
    name: copy.name.value,
    location: [ setDecimalPrecision(latitude, 6), setDecimalPrecision(longitude, 6) ],
    stopPlaceType: copy.stopPlaceType,
    allAreasWheelchairAccessible: copy.allAreasWheelchairAccessible,
    topographicPlace: copy.topographicPlace.name.value,
    isActive: isActive
  }

  if (isActive) {

    formattedStop.quays = []
    formattedStop.entrances = []
    formattedStop.pathJunctions = []

    if (copy.quays) {
      copy.quays.forEach( quay => {
        formattedStop.quays = formattedStop.quays.set(quay.id, helpers.mapQuayToClientQuay(quay))
      })
    }
  }

  return formattedStop
}

helpers.mapQuayToClientQuay = quay => {
  let copy = JSON.parse(JSON.stringify(quay))
  const { latitude, longitude } = copy.location

  return {
    id: copy.id,
    location: [ setDecimalPrecision(latitude, 6), setDecimalPrecision(longitude, 6) ],
    allAreasWheelChairAccessible: copy.allAreasWheelChairAccessible,
    compassBearing: copy.compassBearing
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
      topographicPlace: stop.topographicPlace.name.value,
      isActive: false
    }
  })
}

helpers.createNewStopFromLocation = location => {
  return ({
    id: null,
    name: '',
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

export default helpers