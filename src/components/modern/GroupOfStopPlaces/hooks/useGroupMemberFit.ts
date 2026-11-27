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

import { useCallback } from "react";
import { useAppSelector } from "../../../../store/hooks";
import type { GroupMemberOnMap } from "../../Map/layers/utils/visibleGroupMembers";
import { useDrawerOpen } from "../../Shared/hooks/useDrawerOpen";
import { useDrawerWidth } from "../../Shared/hooks/useDrawerWidth";
import {
  FitBoundsMap,
  fitMapToGroupMembers,
} from "../utils/fitMapToGroupMembers";

/**
 * The group view's "locate" action (S-5): the same fit as opening the
 * group (F-89), so expired members are left out unless they are shown,
 * and the members stay clear of the drawer.
 */
export const useGroupMemberFit = (): (() => void) => {
  const members = useAppSelector(
    (state) =>
      (state.stopPlacesGroup as any).current?.members as
        GroupMemberOnMap[] | undefined,
  );
  const showExpiredStops = useAppSelector(
    (state) => (state.stopPlace as any).showExpiredStops as boolean,
  );
  const activeMap = useAppSelector(
    (state) => (state.mapUtils as any).activeMap as FitBoundsMap | undefined,
  );
  const { isDrawerOpen } = useDrawerOpen();
  const drawerWidth = useDrawerWidth();
  const drawerInset =
    isDrawerOpen && typeof drawerWidth === "number" ? drawerWidth : 0;

  return useCallback(() => {
    if (!activeMap) return;
    fitMapToGroupMembers(
      activeMap,
      members ?? [],
      showExpiredStops,
      drawerInset,
    );
  }, [activeMap, members, showExpiredStops, drawerInset]);
};
