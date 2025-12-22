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

import gql from "graphql-tag";

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
        visualSignsAvailable
      }
    }
  `,
};

Fragments.entityPermissions = gql`
  fragment EntityPermissions on EntityPermissions {
    allowedStopPlaceTypes
    allowedSubmodes
    bannedStopPlaceTypes
    bannedSubmodes
    canDelete
    canEdit
  }
`;

Fragments.groupOfStopPlaces = {
  verbose: gql`
    fragment GroupOfStopPlaces on GroupOfStopPlaces {
      id
      members {
        __typename
        id
        version
        name {
          value
        }
        description {
          value
        }
        geometry {
          legacyCoordinates
          type
        }
        permissions {
          ...EntityPermissions
        }
        ... on StopPlace {
          stopPlaceType
          submode
          adjacentSites {
            ref
          }
          quays {
            id
            privateCode {
              value
            }
            publicCode
            geometry {
              legacyCoordinates
              type
            }
          }
        }
        ... on ParentStopPlace {
          id
          version
          children {
            id
            version
            stopPlaceType
            submode
            geometry {
              legacyCoordinates
              type
            }
            name {
              value
            }
            permissions {
              ...EntityPermissions
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
      purposeOfGrouping {
        id
        name {
          value
        }
      }
      permissions {
        ...EntityPermissions
      }
    }
    ${Fragments.entityPermissions}
  `,
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
        sanitaryFacilityList
      }
      ticketingEquipment {
        ticketOffice
        ticketMachines
        ticketCounter
        numberOfMachines
        audioInterfaceAvailable
        tactileInterfaceAvailable
        inductionLoops
        lowCounterAccess
        wheelchairSuitable
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
  `,
};

Fragments.localServices = {
  verbose: gql`
    fragment LocalServices on LocalServices {
      assistanceService {
        assistanceFacilityList
        assistanceAvailability
      }
    }
  `,
};

Fragments.facilities = {
  verbose: gql`
    fragment SiteFacilitySet on SiteFacilitySet {
      mobilityFacilityList
    }
  `,
};

Fragments.boardingPosition = {
  verbose: gql`
    fragment VerboseBoardingPosition on BoardingPosition {
      id
      publicCode
      geometry {
        legacyCoordinates
      }
    }
  `,
};

Fragments.quay = {
  verbose: gql`
      fragment VerboseQuay on Quay {
          id
          geometry {
              legacyCoordinates
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
          facilities {
            ...SiteFacilitySet
          }
          boardingPositions {
              ...VerboseBoardingPosition
          }
      },
      ${Fragments.placeEquipments.verbose},
      ${Fragments.accessibilityAssessment.verbose}
      ${Fragments.facilities.verbose}
      ${Fragments.boardingPosition.verbose}
  `,
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
        publicCode
        privateCode {
            value
        }
        description {
            value
        }
        geometry {
            legacyCoordinates
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
        fareZones {
          name {
            value
          }
          privateCode {
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
        localServices {
            ...LocalServices
        }
        validBetween {
            fromDate
            toDate
        }
        modificationEnumeration
        permissions {
            ...EntityPermissions
        }
        url
        postalAddress {
            addressLine1 {
                value
            }
            town {
                value
            }
            postCode
        }
    }
    ${Fragments.quay.verbose},
    ${Fragments.placeEquipments.verbose},
    ${Fragments.localServices.verbose},
    ${Fragments.accessibilityAssessment.verbose}
    ${Fragments.entityPermissions}
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
              legacyCoordinates
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
          localServices {
            ...LocalServices
          }
          validBetween {
              fromDate
              toDate
          }
          modificationEnumeration
      }
      ${Fragments.quay.verbose},
      ${Fragments.placeEquipments.verbose},
      ${Fragments.accessibilityAssessment.verbose}
      ${Fragments.localServices.verbose}
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
              legacyCoordinates
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
          permissions {
              ...EntityPermissions
          }
          url
          postalAddress {
            addressLine1 {
                value
            }
            town {
                value
            }
            postCode
        }
      },
      ${Fragments.stopPlace.verbose},
      ${Fragments.entityPermissions},
  `,
  reportView: gql`
    fragment ReportParentStopPlace on ParentStopPlace {
      __typename
      id
      name {
        value
      }
      version
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
        legacyCoordinates
      }
      validBetween {
        fromDate
        toDate
      }
      children {
        ...ReportStopPlace
      }
      modificationEnumeration
    }
    ${Fragments.stopPlace.reportView}
  `,
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
        legacyCoordinates
      }
      from {
        placeRef {
          version
          ref
          addressablePlace {
            id
            geometry {
              legacyCoordinates
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
              legacyCoordinates
              type
            }
          }
        }
      }
    }
  `,
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
        legacyCoordinates
      }
      parkingVehicleTypes
      validBetween {
        fromDate
        toDate
      }
      parkingLayout
      parkingPaymentProcess
      rechargingAvailable
      parkingProperties {
        spaces {
          parkingUserType
          numberOfSpaces
          numberOfSpacesWithRechargePoint
        }
      }
      accessibilityAssessment {
        ...AccessibilityAssessment
      }
    }
    ${Fragments.accessibilityAssessment.verbose}
  `,
};

export default Fragments;
