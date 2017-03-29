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
            id
            from {
                placeRef {
                    version
                    ref
                    addressablePlace {
                        id
                        geometry {
                            coordinates
                        }
                    }
                }
            }
            transferDuration {
                defaultDuration
            }
            geometry {
                coordinates
            }
            to {
                placeRef {
                    version
                    ref
                    addressablePlace {
                        id
                        geometry {
                            coordinates
                            type 
                        }
                    }
                }
            }
        },
        stopPlace(id: $id) {
            ...VerboseStopPlace
        }
    },
    ${Fragments.stopPlace.verbose}
`

export const findStop = gql`
    query findStop($query: String!, $municipalityReference: [String], $stopPlaceType: [StopPlaceType], $countyReference: [String]) {
        stopPlace(query: $query, municipalityReference: $municipalityReference, stopPlaceType: $stopPlaceType, countyReference: $countyReference, size: 7) {
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
