import gql from 'graphql-tag'
import Fragments from './Fragments'

export const stopQuery = gql`
    query stopPlace($id: String!) {
        stopPlace(id: $id) {
            ...VerboseStopPlace
        }
    },
    ${Fragments.stopPlace.verbose}
`

export const stopPlaceBBQuery = gql`
    query stopPlaceBBox($ignoreStopPlaceId: String, $lonMin: BigDecimal!, $lonMax: BigDecimal!, $latMin: BigDecimal!, $latMax: BigDecimal!) {
        stopPlaceBBox(ignoreStopPlaceId: $ignoreStopPlaceId, latMin: $latMin, latMax: $latMax, lonMin: $lonMin, lonMax: $lonMax, size: 500) {
            id
            name {
                value
            }
            geometry {
                coordinates
            }
            stopPlaceType
            topographicPlace {
                name {
                    value
                }
                topographicPlaceType
            }
        }
    },
`

export const findStop = gql`
    query findStop($query: String!, $municipalityReference: [String], $stopPlaceType: [StopPlaceType], $countyReference: [String]) {
        stopPlace(query: $query, municipalityReference: $municipalityReference, stopPlaceType: $stopPlaceType, countyReference: $countyReference, size: 7) {
            id
            name {
                value
            }
            geometry {
                coordinates
            }
            stopPlaceType
            topographicPlace {
                name {
                    value
                }
                topographicPlaceType
                parentTopographicPlace {
                    name {
                        value
                    }
                }
            }
        }
    },
`


export const mutateStopPlace = gql`
    mutation mutateStopPlace($id: String, $name: String, $description: String, $coordinates: Coordinates!, $stopPlaceType: StopPlaceType, $quays: [QuayInput]) {
        mutateStopPlace(StopPlace: {
        id: $id
        name: { value: $name, lang: "no" }
        description: { value: $description, lang: "no" }
        geometry: {
            type: "Point"
            coordinates: $coordinates
        }
        quays: $quays
        stopPlaceType: $stopPlaceType}) {
           ...VerboseStopPlace
        }
    }

    ${Fragments.stopPlace.verbose}

`

