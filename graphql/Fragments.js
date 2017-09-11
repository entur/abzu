import gql from 'graphql-tag';

const Fragments = {};

Fragments.accessibilityAssessment = {
  verbose: gql`
      fragment AccessibilityAssessment on AccessibilityAssessment {
          limitations {
              wheelchairAccess
              stepFreeAccess
              escalatorFreeAccess
              liftFreeAccess
              audibleSignalsAvailable
          }
      }
  `
}

Fragments.placeEquipments = {
  verbose: gql`
      fragment PlaceEquipments on PlaceEquipments {
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
  `
};

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
              ...AccessibilityAssessment
          }
          placeEquipments {
              ...PlaceEquipments
          }
      },
      ${Fragments.placeEquipments.verbose},
      ${Fragments.accessibilityAssessment.verbose}
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
        tags {
            name
            comment
            created
            createdBy
            idReference
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
            ...AccessibilityAssessment
        }
        placeEquipments {
            ...PlaceEquipments
        }
        validBetween {
            fromDate
            toDate
        }
    }
    ${Fragments.quay.verbose},
    ${Fragments.placeEquipments.verbose},
    ${Fragments.accessibilityAssessment.verbose}
  `,
  reportView: gql`
      fragment ReportStopPlace on StopPlace {
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
          geometry {
              coordinates
          }
          quays {
              ...VerboseQuay
          }
          tags {
              name
              comment
              created
              createdBy
              idReference
          }
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
              ...AccessibilityAssessment
          }
          placeEquipments {
              ...PlaceEquipments
          }
          validBetween {
              fromDate
              toDate
          }
      }
      ${Fragments.quay.verbose},
      ${Fragments.placeEquipments.verbose},
      ${Fragments.accessibilityAssessment.verbose}
  `,
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
          tags {
              name
              comment
              created
              createdBy
              idReference
          }
          description {
              value
          }
          children {
              ...VerboseStopPlace
          }
          version
          validBetween {
              fromDate
              toDate
          }
      },
      ${Fragments.stopPlace.verbose},
  `,
  reportView: gql`
    fragment ReportParentStopPlace on ParentStopPlace {
        __typename
        id
        name {
            value
        }
        tags {
            name
            comment
            created
            createdBy
            idReference
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
        keyValues {
            values
            key
        }
        geometry {
            coordinates
        }
        children {
            ...ReportStopPlace
        }
    },
    ${Fragments.stopPlace.reportView}
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
