import gql from 'graphql-tag'
import Fragments from './Fragments'

export const mutateStopPlace = gql`
    mutation mutateStopPlace($id: String, $name: String, $description: String, $coordinates: Coordinates!, $stopPlaceType: StopPlaceType, $quays: [QuayInput], $validBetweens: [ValidBetweenInput], $accessibilityAssessment: AccessibilityAssessmentInput, $placeEquipments: PlaceEquipmentsInput, $alternativeNames: [AlternativeNameInput], $versionComment: String, $weighting: InterchangeWeightingType) {
        mutateStopPlace(StopPlace: {
            id: $id
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
            validBetweens: $validBetweens
            accessibilityAssessment: $accessibilityAssessment
            placeEquipments: $placeEquipments
            stopPlaceType: $stopPlaceType}) {
            ...VerboseStopPlace
        }
    }
    ${Fragments.stopPlace.verbose}
`

export const mutatePathLink = gql`
    mutation mutatePathLink($PathLink: [PathLinkInput]!) {
      mutatePathlink(PathLink: $PathLink) {
          ...VerbosePathLink
      }
  }
  ${Fragments.pathLink.verbose}
`

export const mutateParking = gql`
  mutation mutateParking($Parking: [ParkingInput]!) {
      mutateParking(Parking: $Parking) {
          ...VerboseParking
      }
  }
  ${Fragments.parking.verbose}
`