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
 * Modern copy of the legacy `getGroupOfStopPlaceQuery` (queries.js): one group
 * with its members. It adds each member's `validBetween`, so the stop models
 * can mark expired members (a merge leaves a zero-length "tombstone" version
 * in the group, F-87). The shared fragment is reused as it is; GraphQL merges
 * the two `members` selections. Legacy keeps its own query, unchanged.
 *
 * The operation name stays `getGroupOfStopPlaces`: the group reducer picks the
 * result up by that name.
 */

import gql from "graphql-tag";
import Fragments from "./fragments";

export const groupOfStopPlacesQuery = gql`
  query getGroupOfStopPlaces($id: String!) {
    groupOfStopPlaces(id: $id) {
      ...GroupOfStopPlaces
      members {
        ... on StopPlace {
          validBetween {
            fromDate
            toDate
          }
        }
        ... on ParentStopPlace {
          validBetween {
            fromDate
            toDate
          }
        }
      }
    }
  }
  ${Fragments.groupOfStopPlaces.verbose}
`;
