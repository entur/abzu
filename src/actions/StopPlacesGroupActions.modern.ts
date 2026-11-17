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

/**
 * Modern counterparts to StopPlacesGroupActions.js. The reducer is shared
 * with the classic UI, so the fixes live here, before the dispatch (D1).
 */

import {
  keepNewMembers,
  MemberLookupData,
} from "../components/modern/GroupOfStopPlaces/utils/keepNewMembers";
import type { AppDispatch, RootState } from "../store/store";
import { createThunk } from "./index";
import { getAddStopPlaceInfo } from "./TiamatActions";
import * as types from "./Types";

interface GroupMember {
  id: string;
}

/**
 * Adds stops to the open group, never one that is already a member (F-90).
 *
 * The shared reducer has no "lookup finished, nothing changed" action: its
 * only way to clear the loader also marks the group modified. When the
 * lookup adds nothing (or fails) to a group without other changes, the
 * unchanged group is restored with DISCARDED_GOS_CHANGES, which copies the
 * saved group back over an identical one.
 */
export const addMembersToGroup =
  (stopPlaceIds: string[]) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const group = (getState() as any).stopPlacesGroup;
    const memberIds = ((group.current?.members ?? []) as GroupMember[]).map(
      (member) => member.id,
    );
    const idsToLookUp = stopPlaceIds.filter((id) => !memberIds.includes(id));
    if (!idsToLookUp.length) return;

    const wasModified = !!group.isModified;
    dispatch(createThunk(types.REQUESTED_MEMBER_INFO, null));
    let newMembers: MemberLookupData | null = null;
    try {
      const result = (await dispatch(getAddStopPlaceInfo(idsToLookUp))) as {
        data?: MemberLookupData;
      };
      newMembers = keepNewMembers(result?.data, memberIds);
    } finally {
      dispatch(createThunk(types.RECEIVED_MEMBERS_INFO, { data: newMembers }));
      if (!newMembers && !wasModified) {
        dispatch(createThunk(types.DISCARDED_GOS_CHANGES, null));
      }
    }
  };
