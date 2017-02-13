import { setDecimalPrecision } from '../utils/'

const helpers = {}

helpers.mapQuayToSchema = quay => ({
  id: quay.id,
  location: {
    latitude: quay.location[0],
    longitude: quay.location[1]
  },
  allAreasWheelChairAccessible: quay.allAreasWheelChairAccessible,
  compassBearing: quay.compassBearing
})

helpers.mapStopToSchema = stop =>  ({
  id: stop.id,
  name: stop.name,
  description: stop.description || null,
  latitude: stop.location[0],
  longitude: stop.location[1],
  stopPlaceType: stop.stopPlaceType
})


export default helpers