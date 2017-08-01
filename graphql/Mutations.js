import gql from 'graphql-tag';
import Fragments from './Fragments';

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