/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


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
};

Fragments.groupOfStopPlaces = {
  verbose: gql`
      fragment GroupOfStopPlaces on GroupOfStopPlaces {
          id
          members {
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
                  type
              }
              ...on StopPlace {
                  stopPlaceType
                  submode
                  adjacentSites {
                      ref
                  }
                  quays {
                      id
                      privateCode { value }
                      publicCode
                      geometry {
                          coordinates
                          type
                      }
                  }
              }
              ...on ParentStopPlace {
                  id
                  children {
                      id
                      stopPlaceType
                      submode
                      geometry {
                          coordinates
                          type
                      }
                      name {
                          value
                      }
                  }
              }
          }
          name {
              value
          }
          description {
              value
          }
      }
  `
};

Fragments.placeEquipments = {
  verbose: gql`
      fragment PlaceEquipments on PlaceEquipments {
          id
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
        adjacentSites {
            ref
        }
        quays {
            ...VerboseQuay
        }
        groups {
            id
            name {
                value
            }
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
          alternativeNames {
            nameType
            name {
              value
              lang
              __typename
            }
            __typename
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
          groups {
              id
              name {
                  value
              }
          }
          children {
              ...VerboseStopPlace
          }
          version
          validBetween {
              fromDate
              toDate
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
        validBetween {
            fromDate
            toDate
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
          parkingPaymentProcess
          rechargingAvailable
      }
    `
};


export default Fragments;
