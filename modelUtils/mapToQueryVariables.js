
const helpers = {}

helpers.mapQuayToSchema = quay => ({
  id: quay.id,
  geometry: {
    coordinates: [
      [ quay.location[1], quay.location[0] ]
    ]
  },
  compassBearing: quay.compassBearing,
  publicCode: quay.publicCode,
  description: {
    value: quay.description,
    lang: 'no'
  }
})

helpers.mapStopToSchema = stop => ({
  id: stop.id,
  name: stop.name,
  description: stop.description || null,
  coordinates: [
    [ stop.location[1], stop.location[0] ]
  ],
  stopPlaceType: stop.stopPlaceType,
  quays: stop.quays.map(quay => helpers.mapQuayToSchema(quay))
})


export default helpers