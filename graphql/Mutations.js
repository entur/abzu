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
import Fragments from './Fragments';

export const mutateParentStopPlace = gql`
  mutation mutateParentStopPlace($id: String, $name: String, $description: String, $validBetween: ValidBetweenInput, $versionComment: String, $coordinates: Coordinates!) {
      mutateParentStopPlace(ParentStopPlace: {
          id: $id
          name: { value: $name, lang: "nor" }
          description: { value: $description, lang: "nor" }
          versionComment: $versionComment
          validBetween: $validBetween
          geometry: {
              type: Point
              coordinates: $coordinates
          }
      }) {
          ...VerboseParentStopPlace
      }
  },
  ${Fragments.parentStopPlace.verbose}
`

export const mutateCreateTag = gql`
  mutation mutateCreateTag($idReference: String!, $name: String!, $comment: String) {
      createTag(idReference: $idReference, name: $name, comment: $comment) {
          name
      }
  }
`

export const updateChildOfParentStop = gql`
    mutation updateChildOfParentStop($id: String, $name: String, $description: String, $validBetween: ValidBetweenInput, $versionComment: String, $coordinates: Coordinates!, $children: [StopPlaceInput]) {
        mutateParentStopPlace(ParentStopPlace: {
            id: $id
            name: { value: $name, lang: "no" }
            description: { value: $description, lang: "no" }
            versionComment: $versionComment
            validBetween: $validBetween
            geometry: {
                type: Point
                coordinates: $coordinates
            }
            children: $children
        }) {
            ...VerboseParentStopPlace
        }
    },
    ${Fragments.parentStopPlace.verbose}
`

export const mutateCreateMultiModalStopPlace = gql`
  mutation mutateCreateMultiModalStopPlace($name: String!, $stopPlaceIds: [String]!, $description: String, $coordinates: Coordinates!, $versionComment: String, $validBetween: ValidBetweenInput) {
      createMultiModalStopPlace(input: {
          name: {
              value: $name
              lang: "no"
          }
          stopPlaceIds: $stopPlaceIds
          description: {
              value: $description
              lang: "no"
          }
          geometry: {
              type: Point
              coordinates: $coordinates
          }
          versionComment: $versionComment
          validBetween: $validBetween
      }) {
          ...VerboseParentStopPlace
      }
  },
  ${Fragments.parentStopPlace.verbose}
`


export const mutateTerminateStopPlace = gql`
  mutation mutateTerminateStopPlace($stopPlaceId: String!, $versionComment: String!, $toDate: DateTime!) {
      terminateStopPlace(stopPlaceId: $stopPlaceId, versionComment: $versionComment, toDate: $toDate) {
          ...VerboseStopPlace
          ...VerboseParentStopPlace
      }
  },
  ${Fragments.stopPlace.verbose},
  ${Fragments.parentStopPlace.verbose}
`

export const mutateAddToMultiModalStopPlace = gql`
  mutation mutateAddToMultiModalStopPlace($parentSiteRef: String!, $stopPlaceIds: [String]!) {
      addToMultiModalStopPlace(input: {
          parentSiteRef: $parentSiteRef, stopPlaceIds: $stopPlaceIds
      }) {
          id
      }
  }
`;

export const mutateStopPlace = gql`
    mutation mutateStopPlace($id: String, $name: String, $description: String, $coordinates: Coordinates!, $stopPlaceType: StopPlaceType, $quays: [QuayInput], $validBetween: ValidBetweenInput, $accessibilityAssessment: AccessibilityAssessmentInput, $placeEquipments: PlaceEquipmentsInput, $alternativeNames: [AlternativeNameInput], $versionComment: String, $weighting: InterchangeWeightingType, $keyValues: [KeyValuesInput], $submode: SubmodeType, $transportMode: TransportModeType) {
        mutateStopPlace(StopPlace: {
            id: $id
            keyValues: $keyValues
            submode: $submode
            transportMode: $transportMode
            weighting: $weighting
            name: { value: $name, lang: "no" }
            description: { value: $description, lang: "no" }
            geometry: {
                type: Point
                coordinates: $coordinates
            }
            versionComment: $versionComment,
            alternativeNames: $alternativeNames
            quays: $quays
            validBetween: $validBetween
            accessibilityAssessment: $accessibilityAssessment
            placeEquipments: $placeEquipments
            stopPlaceType: $stopPlaceType}) {
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
    mutation removeStopPlaceFromParent($parentSiteRef: String!, $stopPlaceId: [String!]) {
        removeFromMultiModalStopPlace(parentSiteRef: $parentSiteRef, stopPlaceId: $stopPlaceId) {
            ...VerboseParentStopPlace
        }
    },
    ${Fragments.parentStopPlace.verbose}
`

export const mutateMergeStopPlaces = gql`
  mutation mergeStopPlaces($fromStopPlaceId: String!, $toStopPlaceId: String!, $fromVersionComment: String!, $toVersionComment: String!) {
      mergeStopPlaces(fromStopPlaceId: $fromStopPlaceId, toStopPlaceId: $toStopPlaceId, fromVersionComment: $fromVersionComment, toVersionComment: $toVersionComment) {
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
    mutation mergeQuays($stopPlaceId: String!, $fromQuayId: String!, $toQuayId: String!, $versionComment: String!) {
        mergeQuays(stopPlaceId: $stopPlaceId, fromQuayId: $fromQuayId, toQuayId: $toQuayId, versionComment: $versionComment) {
            ...VerboseStopPlace
        }
    }
    ${Fragments.stopPlace.verbose}
`;

export const mutateMoveQuaysToStop = gql`
  mutation mutateMoveQuay($toStopPlaceId: String!, $quayId: String!, $fromVersionComment: String!, $toVersionComment: String!) {
      moveQuaysToStop(toStopPlaceId: $toStopPlaceId, quayIds: [$quayId], fromVersionComment: $fromVersionComment, toVersionComment: $toVersionComment) {
          ...VerboseStopPlace
      }
  }
  ${Fragments.stopPlace.verbose}
`;

export const mutateMoveQuaysToNewStop = gql`
  mutation mutateMoveQuaysToNewStop($quayIds: [String!], $fromVersionComment: String!, $toVersionComment: String!) {
      moveQuaysToStop(quayIds: $quayIds, fromVersionComment: $fromVersionComment, toVersionComment: $toVersionComment) {
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
  mutation mutateGroupOfStopPlaces($id:String, $name: EmbeddableMultilingualStringInput!, $description: EmbeddableMultilingualStringInput, $members: [VersionLessEntityRefInput]) {
      mutateGroupOfStopPlaces(GroupOfStopPlaces: {
          id: $id,
          name: $name,
          description: $description,
          members: $members
      }) {
          ...GroupOfStopPlaces
      }
  },
  ${Fragments.groupOfStopPlaces.verbose}
`;

