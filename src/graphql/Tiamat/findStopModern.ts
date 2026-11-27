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
import { findStop } from "./queries";

/** Where the group members' selection starts in the classic findStop query. */
export const GROUP_MEMBERS_ANCHOR = /members\s*\{\s*__typename/;

const MEMBER_VALIDITY = `members {
        __typename
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
        }`;

const classicSource = findStop.loc!.source.body;

/**
 * The search query with each group member's validity (S-8), so the stop
 * models mark expired members and a group chosen in search draws only the
 * members the map shows, like an open group (F-87). Built from the classic
 * query, which stays unchanged; same operation name for the reducer.
 */
export const findStopWithMemberValidity = gql(
  classicSource.replace(GROUP_MEMBERS_ANCHOR, MEMBER_VALIDITY),
);
