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
 * Modern copy of the legacy `stopPlaceBBQuery` (queries.js): the stops in the
 * map's bounding box. It differs in one field: multimodal children carry their
 * own `name`. Without it every child fell back to its parent's name in popups
 * and hover tooltips (F-48). Legacy keeps its own query, unchanged.
 *
 * The operation name stays `stopPlaceBBox`: the stop place reducer picks the
 * result up by that name.
 */

import gql from "graphql-tag";

const entityPermissionsFragment = gql`
  fragment EntityPermissions on EntityPermissions {
    allowedStopPlaceTypes
    allowedSubmodes
    bannedStopPlaceTypes
    bannedSubmodes
    canDelete
    canEdit
  }
`;

export const neighbourStopsQuery = gql`
  query stopPlaceBBox(
    $ignoreStopPlaceId: String
    $lonMin: BigDecimal!
    $lonMax: BigDecimal!
    $latMin: BigDecimal!
    $latMax: BigDecimal!
    $includeExpired: Boolean
  ) {
    stopPlaceBBox(
      ignoreStopPlaceId: $ignoreStopPlaceId
      latMin: $latMin
      latMax: $latMax
      lonMin: $lonMin
      lonMax: $lonMax
      size: 500
      includeExpired: $includeExpired
    ) {
      id
      version
      geometry {
        coordinates
      }
      name {
        value
        lang
      }
      topographicPlace {
        id
        name {
          value
        }
        topographicPlaceType
      }
      validBetween {
        fromDate
        toDate
      }
      modificationEnumeration
      ... on StopPlace {
        __typename
        stopPlaceType
        submode
        transportMode
        permissions {
          ...EntityPermissions
        }
      }
      ... on ParentStopPlace {
        permissions {
          ...EntityPermissions
        }
        children {
          id
          version
          name {
            value
            lang
          }
          stopPlaceType
          submode
          geometry {
            coordinates
          }
          topographicPlace {
            id
            name {
              value
            }
          }
          permissions {
            ...EntityPermissions
          }
        }
      }
    }
  }
  ${entityPermissionsFragment}
`;
