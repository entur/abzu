import gql from 'graphql-tag';

const Fragments = {};

Fragments.quay = {
  verbose: gql`
      fragment VerboseQuay on Quay {
          id
          geometry {
              coordinates
          }
          version
          compassBearing
          publicCode
          privateCode {
              value
          }
          description {
              value
          }
          keyValues {
              key
              values
          }
          accessibilityAssessment {
              limitations {
                  wheelchairAccess
                  stepFreeAccess
                  escalatorFreeAccess
                  liftFreeAccess
                  audibleSignalsAvailable
              }
          }
          placeEquipments {
              generalSign {
                  id
                  signContentType
                  privateCode {
                      value
                  }
              }
              waitingRoomEquipment {
                  seats
                  heated
                  stepFree
              }
              sanitaryEquipment {
                  numberOfToilets
                  gender
              }
              ticketingEquipment {
                  ticketOffice
                  ticketMachines
                  numberOfMachines
              }
              cycleStorageEquipment {
                  numberOfSpaces
                  cycleStorageType
              }
              shelterEquipment {
                  seats
                  stepFree
                  enclosed
              }
          }
      }
  `
};

Fragments.parentStopPlace = {
  verbose: gql`
      fragment VerboseParentStopPlace on ParentStopPlace {
          __typename
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
          children {
              id
              name {
                  value
              }
              stopPlaceType
              submode
              transportMode
          }
      }
    `
};

Fragments.stopPlace = {
  verbose: gql`
    fragment VerboseStopPlace on StopPlace {
        __typename
        id
        name {
            value
        }
        alternativeNames {
            nameType
            name {
                value
                lang
            }
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
        weighting
        stopPlaceType
        submode
        transportMode
        version
        keyValues {
            key
            values
        }
        tariffZones {
            name {
                value
            }
            id 
        }
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
        accessibilityAssessment {
            limitations {
                wheelchairAccess
                stepFreeAccess
                escalatorFreeAccess
                liftFreeAccess
                audibleSignalsAvailable
            }
        }
        placeEquipments {
            generalSign {
                id
                signContentType
                privateCode {
                    value
                }
            }
            waitingRoomEquipment {
                seats
                heated
                stepFree
            }
            sanitaryEquipment {
                numberOfToilets
                gender
            }
            ticketingEquipment {
                ticketOffice
                ticketMachines
                numberOfMachines
            }
            cycleStorageEquipment {
                numberOfSpaces
                cycleStorageType
            }
            shelterEquipment {
                seats
                stepFree
            }
        }
        validBetween {
            fromDate
            toDate
        }
    }
    ${Fragments.quay.verbose}
  `
};

Fragments.pathLink = {
  verbose: gql`
      fragment VerbosePathLink on PathLink {
          id
          transferDuration {
              defaultDuration
          }
          geometry {
              type
              coordinates
          }
          from {
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
      }
  `
};

Fragments.parking = {
  verbose: gql`
      fragment VerboseParking on Parking {
          id
          totalCapacity
          name {
              value
          } 
          geometry {
              coordinates
          }
          parkingVehicleTypes
          validBetween {
              fromDate
              toDate
          }
      }
    `
};

export default Fragments;
