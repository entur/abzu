import gql from 'graphql-tag'
import Fragments from './Fragments'

export const stopQuery = gql`
    query stopPlace($id: String!) {
        stopPlace(id: $id) {
            ...VerboseStopPlace
        }
    },
    ${Fragments.stopPlace.verbose}
`

export const pathLinkQuery = gql`
  query pathLink($stopPlaceId: String!) {
      pathLink(stopPlaceId: $stopPlaceId) {
          id
          from {
              quay {
                  id
                  geometry {
                      type coordinates
                  }
              }
          }
          geometry {
              type
              coordinates
          }
          to {
              quay {
                  id
                  geometry {
                      type
                      coordinates
                  }
              }
          }
      }
  },
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
                quay {
                    id
                    geometry {
                        type coordinates
                    }
                }
            }
            geometry {
                type
                coordinates
            }
            to {
                quay {
                    id
                    geometry {
                        type
                        coordinates
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
