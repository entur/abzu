/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 *  the European Commission - subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *  You may obtain a copy of the Licence at:
 *
 *    https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the Licence for the specific language governing permissions and
 *  limitations under the Licence. */

/**
 * Self-contained TypeScript query for loading a stop place with its path links
 * and parking, without historical versions (those are lazy-loaded).
 *
 * This is the modern-UI counterpart to the legacy `allEntitiesWithoutVersions`
 * in queries.js. Keeping it here lets us evolve the query shape without
 * touching the legacy fragment composition system.
 *
 * __typename is intentionally omitted from fragments — Apollo Client's
 * InMemoryCache injects it automatically on every selection set at request time.
 */

import gql from "graphql-tag";

const accessibilityAssessmentFragment = gql`
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
`;

const placeEquipmentsFragment = gql`
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
`;

const siteFacilitySetFragment = gql`
  fragment SiteFacilitySet on SiteFacilitySet {
    mobilityFacilityList
    passengerInformationFacilityList
    passengerInformationEquipmentList
  }
`;

const localServicesFragment = gql`
  fragment LocalServices on LocalServices {
    assistanceService {
      assistanceFacilityList
      assistanceAvailability
    }
  }
`;

const entityPermissionsFragment = gql`
  fragment EntityPermissions on EntityPermissions {
    allowedStopPlaceTypes
    allowedSubmodes
    bannedStopPlaceTypes
    bannedSubmodes
    canDelete
    canEdit
  }
`;

const verboseBoardingPositionFragment = gql`
  fragment VerboseBoardingPosition on BoardingPosition {
    id
    publicCode
    geometry {
      coordinates
    }
  }
`;

const verboseQuayFragment = gql`
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
    facilities {
      ...SiteFacilitySet
    }
    lighting
    boardingPositions {
      ...VerboseBoardingPosition
    }
  }
  ${accessibilityAssessmentFragment}
  ${placeEquipmentsFragment}
  ${siteFacilitySetFragment}
  ${verboseBoardingPositionFragment}
`;

const verboseStopPlaceFragment = gql`
  fragment VerboseStopPlace on StopPlace {
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
    facilities {
      ...SiteFacilitySet
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
  ${verboseQuayFragment}
  ${accessibilityAssessmentFragment}
  ${placeEquipmentsFragment}
  ${localServicesFragment}
  ${siteFacilitySetFragment}
  ${entityPermissionsFragment}
`;

const verboseParentStopPlaceFragment = gql`
  fragment VerboseParentStopPlace on ParentStopPlace {
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
    tags {
      name
      comment
      created
      createdBy
      idReference
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
  }
  ${verboseStopPlaceFragment}
  ${entityPermissionsFragment}
`;

const verbosePathLinkFragment = gql`
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
`;

const verboseParkingFragment = gql`
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
  ${accessibilityAssessmentFragment}
`;

/**
 * Loads a stop place with its path links and parking.
 * Historical versions are excluded — fetch those separately via
 * getStopPlaceVersions when the user opens the versions dialog.
 *
 * Operation name kept as "stopPlaceAndPathLink" so the existing Redux reducer
 * case handles the response without changes.
 */
export const stopPlaceWithAll = gql`
  query stopPlaceAndPathLink($id: String!) {
    __typename
    pathLink(stopPlaceId: $id) {
      ...VerbosePathLink
    }
    stopPlace(id: $id, versionValidity: MAX_VERSION) {
      ...VerboseStopPlace
      ...VerboseParentStopPlace
    }
    parking: parking(stopPlaceId: $id) {
      ...VerboseParking
    }
  }
  ${verbosePathLinkFragment}
  ${verboseStopPlaceFragment}
  ${verboseParentStopPlaceFragment}
  ${verboseParkingFragment}
`;
