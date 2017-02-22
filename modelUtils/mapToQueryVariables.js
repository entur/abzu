
const helpers = {}

helpers.mapQuayToVariables = quay => {

  let newQuay = {
    id: quay.id,
    geometry: null,
    compassBearing: quay.compassBearing,
    publicCode: quay.publicCode,
    description: {
      value: quay.description,
      lang: 'no'
    }
  }

  if (quay.location) {
    newQuay.geometry = {
      coordinates: [
        [ quay.location[1], quay.location[0] ]
      ],
        type: "Point"
    }
  }

  return newQuay
}

helpers.mapStopToVariables = stop => {

  let newStop =  {
    id: stop.id,
    name: stop.name,
    description: stop.description || null,
    stopPlaceType: stop.stopPlaceType,
    quays: stop.quays.map(quay => helpers.mapQuayToVariables(quay))
  }

  if (stop.location) {
    newStop.coordinates = [
      [ stop.location[1], stop.location[0] ]
    ]
  }

  return newStop
}


export default helpers