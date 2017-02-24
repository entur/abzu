import gql from 'graphql-tag'

const Fragments = {}

Fragments.quay = {
  verbose: gql`
      fragment VerboseQuay on Quay {
          id
          geometry {
              coordinates
          }
          compassBearing
          publicCode
          description {
              value
          }
      }
  `
}


Fragments.stopPlace = {
  verbose: gql `
    fragment VerboseStopPlace on StopPlace {
        id
        name {
            value
        }
        description {
            value
        }
        geometry {
            coordinates
        }
        quays {
            ...VerboseQuay
        }
        stopPlaceType
        topographicPlace {
            name {
                value
            }
            parentTopographicPlace {
                name {
                    value
                }
            }
            topographicPlaceType
        }
        
    }
    ${Fragments.quay.verbose}
  `
}

Fragments.pathLink = {
  verbose: gql `
      fragment VerbosePathLink on PathLink {
          id
          geometry {
              type
              coordinates
          }
          from {
              id
              quay{
                  id
                  geometry {
                      coordinates
                  }
              }
          }
          to {
              id
              quay {
                  id
                  geometry {
                      coordinates
                  }
              }
          }
      }
  `
}


export default Fragments