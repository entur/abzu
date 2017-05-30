import moment from 'moment'
import { defaultLimitations } from '../models/Limitations'

const helpers = {}


helpers.mapQuayToVariables = quay => {

  let quayVariables = {
    id: quay.id,
    geometry: null,
    compassBearing: quay.compassBearing,
    publicCode: quay.publicCode,
    accessibilityAssessment: formatAccessibilityAssements(quay.accessibilityAssessment),
    placeEquipments: quay.placeEquipments,
    description: {
      value: quay.description,
      lang: 'no'
    }
  }

  if (quay.privateCode) {
    quayVariables.privateCode = {
      value: quay.privateCode
    }
  }

  if (quay.location) {
    quayVariables.geometry = {
      coordinates: [
        [quay.location[1], quay.location[0]]
      ],
      type: "Point"
    }
  }
  return quayVariables
}

helpers.getFullUTCString = (time, date) => {
  const timeStringFrom = moment(time).utc().format('HH:mm:ss').toString()
  const dateStringFrom = moment(date).utc().format('YYYY-MM-DD').toString()
  return moment(`${dateStringFrom} ${timeStringFrom}`).format('YYYY-MM-DDTHH:mm:ss.SSS') + 'Z'
}

helpers.mapStopToVariables = (original, userInput) => {

  const stop = JSON.parse(JSON.stringify(original))

  let stopVariables = {
    id: stop.id,
    name: stop.name,
    description: stop.description || null,
    stopPlaceType: stop.stopPlaceType,
    quays: stop.quays.map(quay => helpers.mapQuayToVariables(quay)),
    accessibilityAssessment: formatAccessibilityAssements(stop.accessibilityAssessment),
    placeEquipments: stop.placeEquipments,
    alternativeNames: stop.alternativeNames,
    weighting: stop.weighting
  }

  if (userInput) {

    const { timeFrom, timeTo, dateFrom, dateTo, comment } = userInput

    let validPeriod = {}

    if (timeFrom && dateFrom) {
      validPeriod.fromDate = helpers.getFullUTCString(timeFrom, dateFrom)
    }

    if (timeTo && dateTo) {
      validPeriod.toDate = helpers.getFullUTCString(timeTo, dateTo)
    }

    stopVariables.validBetweens = [
      validPeriod
    ]

    stopVariables.versionComment = comment
  }

  if (stop.location) {
    stopVariables.coordinates = [
      [stop.location[1], stop.location[0]]
    ]
  }
  return stopVariables
}

helpers.mapPathLinkToVariables = pathLinks => {

  return pathLinks.map(source => {

    let pathLink = JSON.parse(JSON.stringify(source))

    // TODO : Move these to stripRedundantFields, write test for this

    if (pathLink.from && pathLink.from.placeRef) {
      if (pathLink.from.placeRef.addressablePlace) {
        delete pathLink.from.placeRef.addressablePlace
      }
    }

    if (pathLink.to && pathLink.to.placeRef) {
      if (pathLink.to.placeRef.addressablePlace) {
        delete pathLink.to.placeRef.addressablePlace
      }
    }

    pathLink.transferDuration = {
      defaultDuration: source.estimate
    }

    if (pathLink.inBetween && pathLink.inBetween.length) {
      pathLink.geometry = {
        type: "LineString",
        coordinates: pathLink.inBetween.map(latlng => latlng.reverse())
      }
    }
    return stripRedundantFields(pathLink)
  })
}

helpers.mapParkingToVariables = (parkingArr, parentRef) => {

  return parkingArr.map( source => {

    let parking = {
      totalCapacity: Number(source.totalCapacity) || 0,
      parentSiteRef: parentRef,
      parkingVehicleTypes: source.parkingVehicleTypes
    }

    if (source.id) {
      parking.id = source.id
    }

    parking.name = {
      value: source.name,
      lang: 'nb'
    }

    if (source.location) {

      let coordinates = source.location.map( c => {
        if (!isFloat(c)) {
          return parseFloat(c + ".0000001")
        }
        return c
      }).reverse()

      parking.geometry = {
        type: 'Point',
        coordinates: [ coordinates ]
      }
    } else {
      parking.geometry = null
    }

    return parking
  })
}

const stripRedundantFields = pathLink => {

  delete pathLink.estimate
  delete pathLink.duration
  delete pathLink.inBetween

  if (pathLink.to && pathLink.to.addressablePlace) {
    delete pathLink.to.addressablePlace.geometry
  }

  if (pathLink.from && pathLink.from.addressablePlace) {
    delete pathLink.from.addressablePlace.geometry
  }

  return pathLink
}

const formatAccessibilityAssements = assements => {
  if (assements && assements.limitations) {
    Object.keys(defaultLimitations).map( key => {
      if (!assements.limitations[key]) {
        assements.limitations[key] = "UNKNOWN"
      }
    })
  }
  return assements
}

const isFloat = n =>  Number(n) === n && n % 1 !== 0

export default helpers