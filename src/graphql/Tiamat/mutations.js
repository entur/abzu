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
import Fragments from "./fragments";

export const mutateParentStopPlace = gql`
  mutation mutateParentStopPlace(
    $id: String
    $name: EmbeddableMultilingualStringInput
    $description: EmbeddableMultilingualStringInput
    $validBetween: ValidBetweenInput
    $versionComment: String
    $legacyCoordinates: legacyCoordinates
    $alternativeNames: [AlternativeNameInput]
    $children: [StopPlaceInput]
    $url: String
  ) {
    mutateParentStopPlace(
      ParentStopPlace: {
        id: $id
        name: $name
        description: $description
        versionComment: $versionComment
        validBetween: $validBetween
        geometry: { type: Point, legacyCoordinates: $legacyCoordinates }
        alternativeNames: $alternativeNames
        children: $children
        url: $url
      }
    ) {
      ...VerboseParentStopPlace
    }
  }
  ${Fragments.parentStopPlace.verbose}
`;

export const mutateCreateTag = gql`
  mutation mutateCreateTag(
    $idReference: String!
    $name: String!
    $comment: String
  ) {
    createTag(idReference: $idReference, name: $name, comment: $comment) {
      name
    }
  }
`;

export const updateChildOfParentStop = gql`
  mutation updateChildOfParentStop(
    $id: String
    $name: EmbeddableMultilingualStringInput
    $description: EmbeddableMultilingualStringInput
    $validBetween: ValidBetweenInput
    $versionComment: String
    $legacyCoordinates: legacyCoordinates
    $children: [StopPlaceInput]
  ) {
    mutateParentStopPlace(
      ParentStopPlace: {
        id: $id
        name: $name
        description: $description
        versionComment: $versionComment
        validBetween: $validBetween
        geometry: { type: Point, legacyCoordinates: $legacyCoordinates }
        children: $children
      }
    ) {
      ...VerboseParentStopPlace
    }
  }
  ${Fragments.parentStopPlace.verbose}
`;

export const mutateCreateMultiModalStopPlace = gql`
  mutation mutateCreateMultiModalStopPlace(
    $name: EmbeddableMultilingualStringInput!
    $stopPlaceIds: [String]!
    $description: EmbeddableMultilingualStringInput
    $legacyCoordinates: legacyCoordinates
    $versionComment: String
    $validBetween: ValidBetweenInput
  ) {
    createMultiModalStopPlace(
      input: {
        name: $name
        stopPlaceIds: $stopPlaceIds
        description: $description
        geometry: { type: Point, legacyCoordinates: $legacyCoordinates }
        versionComment: $versionComment
        validBetween: $validBetween
      }
    ) {
      ...VerboseParentStopPlace
    }
  }
  ${Fragments.parentStopPlace.verbose}
`;

export const mutateTerminateStopPlace = gql`
  mutation mutateTerminateStopPlace($stopPlaceId: String!, $versionComment: String!, $toDate: DateTime!, $modificationEnumeration: ModificationEnumerationType) {
      terminateStopPlace(stopPlaceId: $stopPlaceId, versionComment: $versionComment, toDate: $toDate, modificationEnumeration: $modificationEnumeration) {
          ...VerboseStopPlace
          ...VerboseParentStopPlace
      }
  },
  ${Fragments.stopPlace.verbose},
  ${Fragments.parentStopPlace.verbose}
`;

export const mutateAddToMultiModalStopPlace = gql`
  mutation mutateAddToMultiModalStopPlace(
    $parentSiteRef: String!
    $stopPlaceIds: [String]!
  ) {
    addToMultiModalStopPlace(
      input: { parentSiteRef: $parentSiteRef, stopPlaceIds: $stopPlaceIds }
    ) {
      id
    }
  }
`;

export const mutateStopPlace = gql`
  mutation mutateStopPlace(
    $id: String
    $name: EmbeddableMultilingualStringInput
    $publicCode: String
    $privateCode: PrivateCodeInput
    $description: EmbeddableMultilingualStringInput
    $legacyCoordinates: legacyCoordinates
    $stopPlaceType: StopPlaceType
    $quays: [QuayInput]
    $validBetween: ValidBetweenInput
    $accessibilityAssessment: AccessibilityAssessmentInput
    $placeEquipments: PlaceEquipmentsInput
    $alternativeNames: [AlternativeNameInput]
    $versionComment: String
    $weighting: InterchangeWeightingType
    $keyValues: [KeyValuesInput]
    $submode: SubmodeType
    $transportMode: TransportModeType
    $tariffZones: [VersionLessEntityRefInput]
    $url: String
  ) {
    mutateStopPlace(
      StopPlace: {
        id: $id
        keyValues: $keyValues
        submode: $submode
        transportMode: $transportMode
        weighting: $weighting
        name: $name
        publicCode: $publicCode
        privateCode: $privateCode
        description: $description
        geometry: { type: Point, legacyCoordinates: $legacyCoordinates }
        versionComment: $versionComment
        alternativeNames: $alternativeNames
        quays: $quays
        validBetween: $validBetween
        accessibilityAssessment: $accessibilityAssessment
        placeEquipments: $placeEquipments
        tariffZones: $tariffZones
        stopPlaceType: $stopPlaceType
        url: $url
      }
    ) {
      ...VerboseStopPlace
    }
  }
  ${Fragments.stopPlace.verbose}
`;

export const mutatePathLink = gql`
  mutation mutatePathLink($PathLink: [PathLinkInput]!) {
    mutatePathlink(PathLink: $PathLink) {
      ...VerbosePathLink
    }
  }
  ${Fragments.pathLink.verbose}
`;

export const mutateParking = gql`
  mutation mutateParking($Parking: [ParkingInput]!) {
    mutateParking(Parking: $Parking) {
      ...VerboseParking
    }
  }
  ${Fragments.parking.verbose}
`;

export const removeStopPlaceFromParent = gql`
  mutation removeStopPlaceFromParent(
    $parentSiteRef: String!
    $stopPlaceId: [String!]
  ) {
    removeFromMultiModalStopPlace(
      parentSiteRef: $parentSiteRef
      stopPlaceId: $stopPlaceId
    ) {
      ...VerboseParentStopPlace
    }
  }
  ${Fragments.parentStopPlace.verbose}
`;

export const mutateMergeStopPlaces = gql`
  mutation mergeStopPlaces(
    $fromStopPlaceId: String!
    $toStopPlaceId: String!
    $fromVersionComment: String!
    $toVersionComment: String!
  ) {
    mergeStopPlaces(
      fromStopPlaceId: $fromStopPlaceId
      toStopPlaceId: $toStopPlaceId
      fromVersionComment: $fromVersionComment
      toVersionComment: $toVersionComment
    ) {
      ...VerboseStopPlace
    }
  }
  ${Fragments.stopPlace.verbose}
`;

export const mutateDeleteQuay = gql`
  mutation mutateDeleteQuay($stopPlaceId: String!, $quayId: String!) {
    deleteQuay(stopPlaceId: $stopPlaceId, quayId: $quayId) {
      ...VerboseStopPlace
    }
  }
  ${Fragments.stopPlace.verbose}
`;

export const mutateDeleteStopPlace = gql`
  mutation mutateDeleteStopPlace($stopPlaceId: String!) {
    deleteStopPlace(stopPlaceId: $stopPlaceId)
  }
`;

export const mutateMergeQuays = gql`
  mutation mergeQuays(
    $stopPlaceId: String!
    $fromQuayId: String!
    $toQuayId: String!
    $versionComment: String!
  ) {
    mergeQuays(
      stopPlaceId: $stopPlaceId
      fromQuayId: $fromQuayId
      toQuayId: $toQuayId
      versionComment: $versionComment
    ) {
      ...VerboseStopPlace
    }
  }
  ${Fragments.stopPlace.verbose}
`;

export const mutateMoveQuaysToStop = gql`
  mutation mutateMoveQuay(
    $toStopPlaceId: String!
    $quayId: String!
    $fromVersionComment: String!
    $toVersionComment: String!
  ) {
    moveQuaysToStop(
      toStopPlaceId: $toStopPlaceId
      quayIds: [$quayId]
      fromVersionComment: $fromVersionComment
      toVersionComment: $toVersionComment
    ) {
      ...VerboseStopPlace
    }
  }
  ${Fragments.stopPlace.verbose}
`;

export const mutateMoveQuaysToNewStop = gql`
  mutation mutateMoveQuaysToNewStop(
    $quayIds: [String!]
    $fromVersionComment: String!
    $toVersionComment: String!
  ) {
    moveQuaysToStop(
      quayIds: $quayIds
      fromVersionComment: $fromVersionComment
      toVersionComment: $toVersionComment
    ) {
      ...VerboseStopPlace
    }
  }
  ${Fragments.stopPlace.verbose}
`;

export const mutateRemoveTag = gql`
  mutation mutateRemoveTag($name: String!, $idReference: String!) {
    removeTag: removeTag(name: $name, idReference: $idReference) {
      removed
    }
  }
`;

export const mutateGroupOfStopPlaces = gql`
  mutation mutateGroupOfStopPlaces(
    $id: String
    $name: EmbeddableMultilingualStringInput!
    $description: EmbeddableMultilingualStringInput
    $members: [VersionLessEntityRefInput]
    $purposeOfGrouping: VersionLessEntityRefInput
  ) {
    mutateGroupOfStopPlaces(
      GroupOfStopPlaces: {
        id: $id
        name: $name
        description: $description
        members: $members
        purposeOfGrouping: $purposeOfGrouping
      }
    ) {
      ...GroupOfStopPlaces
    }
  }
  ${Fragments.groupOfStopPlaces.verbose}
`;

export const deleteGroupMutation = gql`
  mutation deleteGroupOfStopPlaces($id: String!) {
    deleteGroupOfStopPlaces(id: $id)
  }
`;

export const deleteParkingMutation = gql`
  mutation deleteParking($id: String!) {
    deleteParking(parkingId: $id)
  }
`;
