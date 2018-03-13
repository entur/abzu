import gql from "graphql-tag";

export const findStopPlaceUsage = gql`
  query findStopPlaceUsage($stopPlaceId:String!) {
  stopPlace(id: $stopPlaceId) {
    id
    name
    quays {
      lines {
        id
        serviceJourneys {
          id
          activeDates
          publicCode
        }
      }
    }
  }
}`;