import { setDecimalPrecision } from '../utils/'

const helpers = {}

helpers.mapQuayToServerQuay = quay => {
  return {
    id: quay.id,
    location: {
      latitude: quay.location[0],
      longitude: quay.location[1]
    },
    allAreasWheelChairAccessible: quay.allAreasWheelChairAccessible,
    compassBearing: quay.compassBearing
  }
}

export default helpers