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

import gql from "graphql-tag";
import Fragments from "./fragments";

const VALIDITY = `
                validBetween {
                    fromDate
                    toDate
                }`;

const lookupFor = (id: string, alias: string): string => `
        ${alias}: stopPlace(id: "${id}") {
            ...on StopPlace {
                __typename
                id
                version
                name {
                    value
                }
                permissions {
                  ...EntityPermissions
                }
                submode
                geometry {
                  coordinates
                }
                transportMode
                stopPlaceType
                adjacentSites {
                    ref
                }
                quays {
                    id
                    publicCode
                    privateCode {
                        value
                    }
                }${VALIDITY}
            }
            ...on ParentStopPlace {
                __typename
                id
                version
                name {
                    value
                }
                permissions {
                  ...EntityPermissions
                }
                geometry {
                  coordinates
                }
                children {
                    id
                    transportMode
                    stopPlaceType
                    submode
                    geometry {
                      coordinates
                    }
                }${VALIDITY}
            }
        }
    `;

/**
 * The stops being added to a group (S-7). The classic getAddStopPlaceInfo
 * query plus each stop's validBetween, so the stop models mark an expired
 * stop at once instead of only after the group is saved and reloaded.
 * Same operation name, so it reaches the reducer the same way.
 */
export const addMemberLookupQuery = (stopPlaceIds: string[]) => {
  const netexPrefix = (window as any).config?.netexPrefix ?? "NSR";
  const lookups = stopPlaceIds
    .map((id) =>
      lookupFor(id, id.replace(`${netexPrefix}:StopPlace:`, "StopPlace")),
    )
    .join("");
  return gql`
      query getAddStopPlaceInfo {
          ${lookups}
      }
      ${Fragments.entityPermissions}
  `;
};
