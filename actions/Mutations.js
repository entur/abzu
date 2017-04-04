import gql from 'graphql-tag'
import Fragments from './Fragments'

export const mutateStopPlace = gql`
    mutation mutateStopPlace($id: String, $name: String, $description: String, $coordinates: Coordinates!, $stopPlaceType: StopPlaceType, $quays: [QuayInput]) {
        mutateStopPlace(StopPlace: {
            id: $id
            name: { value: $name, lang: "no" }
            description: { value: $description, lang: "no" }
            geometry: {
                type: Point
                coordinates: $coordinates
            }
            quays: $quays
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