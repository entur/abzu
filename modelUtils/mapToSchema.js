
const helpers = {}

helpers.mapQuayToSchema = quay => ({
  id: quay.id,
  location: {
    latitude: quay.location[0],
    longitude: quay.location[1]
  },
  compassBearing: quay.compassBearing,
  plateCode: quay.plateCode,
  description: {
    value: quay.description,
    lang: 'no'
  }
})

helpers.mapStopToSchema = stop =>  ({
  id: stop.id,
  name: stop.name,
  description: stop.description || null,
  latitude: stop.location[0],
  longitude: stop.location[1],
  stopPlaceType: stop.stopPlaceType,
  quays: stop.quays.map(quay => helpers.mapQuayToSchema(quay))
})


export default helpers