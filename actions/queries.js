import gql from 'graphql-tag'

export const stopQuery = gql`
    query stopPlace($id: String!) {
        stopPlace(id: [$id]) {
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
