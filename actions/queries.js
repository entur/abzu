import gql from 'graphql-tag'

export const stopQuery = gql`
    query stopPlace($id: String!) {
        stopPlace(id: $id) {
            id
            name {
                value
            }
            description {
                value
            }
            location {
                latitude
                longitude
            }
            allAreasWheelchairAccessible
            stopPlaceType
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
            quays {
                id
                location {
                    latitude
                    longitude
                }
                allAreasWheelchairAccessible
                compassBearing
            }
        }
    },
`

export const stopPlaceBBQuery = gql`
    query stopPlaceBBox($ignoreStopPlaceId: String, $lonMin: BigDecimal!, $lonMax: BigDecimal!, $latMin: BigDecimal!, $latMax: BigDecimal!) {
        stopPlaceBBox(ignoreStopPlaceId: $ignoreStopPlaceId, latMin: $latMin, latMax: $latMax, lonMin: $lonMin, lonMax: $lonMax, size: 500) {
            id
            name {
                value
            }
            location {
                latitude
                longitude
            }
            allAreasWheelchairAccessible
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
            location {
                latitude
                longitude
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
    mutation mutateStopPlace($id: String, $name: String, $description: String, $latitude: Float!, $longitude: Float!, $stopPlaceType: StopPlaceType) {
        mutateStopPlace(StopPlace: {
        id: $id
        name: { value: $name, lang: "no" }
        description: { value: $description, lang: "no" }
        location: {
        latitude: $latitude
        longitude:$longitude
        }
        stopPlaceType: $stopPlaceType
        }) {
            id 
        }
    }
`

