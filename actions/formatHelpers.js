import { Map } from 'immutable'

const helpers = {}

helpers.mapStopToClientStop = (stop, isActive) => {

  let copy = JSON.parse(JSON.stringify(stop))
  const { latitude, longitude } = copy.location

  let formattedStop = {
    id: copy.id,
    name: copy.name.value,
    location: [latitude, longitude],
    stopPlaceType: copy.stopPlaceType,
    allAreasWheelchairAccessible: copy.allAreasWheelchairAccessible,
    topographicPlace: copy.topographicPlace.name.value,
    isActive: isActive
  }

  if (isActive) {

    formattedStop.quays = Map()
    formattedStop.entrances = Map()
    formattedStop.pathJunctions = Map()

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
    location: [latitude, longitude],
    allAreasWheelChairAccessible: copy.allAreasWheelChairAccessible,
    compassBearing: copy.compassBearing
  }
}

helpers.mapNeighbourStopsToClientStops = stops => {
  return stops.map( stop => helpers.mapStopToClientStop(stop, false))
}

helpers.mapLocationToPosition = location => {
  if (!location && !location.length) return [67.928595, 13.083002]
  return [ location.latitude, location.longitude ]
}

export default helpers