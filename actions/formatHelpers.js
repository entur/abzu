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

  formattedStop.quays = Map()

  if (copy.quays) {
    copy.quays.forEach( quay => {
      console.log("quay", quay)
      formattedStop.quays = formattedStop.quays.set(quay.id, helpers.mapQuayToClientQuay(quay))
    })
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

export default helpers