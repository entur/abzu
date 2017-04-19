import gql from 'graphql-tag'
import Fragments from './Fragments'

export const neighbourStopPlaceQuays = gql`
  query neighbourStopPlaceQuays($id: String!) {
      stopPlace(id: $id) {
          id 
          quays {
              id 
              version
              geometry {
                  coordinates
              }
              compassBearing
          }
      }
  }
`

export const stopPlaceBBQuery = gql`
    query stopPlaceBBox($ignoreStopPlaceId: String, $lonMin: BigDecimal!, $lonMax: BigDecimal!, $latMin: BigDecimal!, $latMax: BigDecimal!) {
        stopPlaceBBox(ignoreStopPlaceId: $ignoreStopPlaceId, latMin: $latMin, latMax: $latMax, lonMin: $lonMin, lonMax: $lonMax, size: 500) {
            id
            name {
                value
            }
            geometry {
                coordinates
            }
            stopPlaceType
            topographicPlace {
                name {
                    value
                }
                topographicPlaceType
            }
        }
    },
`

export const stopPlaceAndPathLink = gql`
    query stopPlaceAndPathLink($id: String!) {
        pathLink(stopPlaceId: $id) {
            ...VerbosePathLink
        },
        stopPlace(id: $id) {
            ...VerboseStopPlace
        }
        versions: 
            stopPlace(id: $id, allVersions: true) {
                id
                validBetweens {
                    fromDate
                    toDate
                }
                name {
                    value
                    lang
                }
                version
            }
        },
    ${Fragments.stopPlace.verbose},
    ${Fragments.pathLink.verbose},
`

export const findStop = gql`
    query findStop($query: String, $importedId: String, $municipalityReference: [String], $stopPlaceType: [StopPlaceType], $countyReference: [String]) {
        stopPlace(query: $query, importedId: $importedId, municipalityReference: $municipalityReference, stopPlaceType: $stopPlaceType, countyReference: $countyReference, size: 7) {
            id
            name {
                value
            }
            geometry {
                coordinates
            }
            stopPlaceType
            topographicPlace {
                name {
                    value
                }
                topographicPlaceType
                parentTopographicPlace {
                    name {
                        value
                    }
                }
            }
        }
    },
`

export const stopPlaceAllVersions = gql`
    query stopPlaceAllVersions($id: String!) {
        versions:
        stopPlace(id: $id, allVersions: true) {
            id
            validBetweens {
                fromDate
                toDate
            }
            name {
                value
                lang
            }
            version
        }
    },
`

export const stopPlaceAndPathLinkByVersion = gql`
    query stopPlaceAndPathLink($id: String!, $version: Int) {
        pathLink(stopPlaceId: $id) {
            ...VerbosePathLink
        },
        stopPlace(id: $id, version: $version) {
            ...VerboseStopPlace
        }
        versions:
        stopPlace(id: $id, allVersions: true) {
            id
            validBetweens {
                fromDate
                toDate
            }
            name {
                value
                lang
            }
            version
        }
    },
    ${Fragments.stopPlace.verbose},
    ${Fragments.pathLink.verbose},
`

export const topopGraphicalPlacesQuery = gql`
    query TopopGraphicalPlaces {
        topographicPlace {
            id
            name {
                value
            }
            topographicPlaceType
        }
    }
`
