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

import { useMemo } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { findStagedChildChanges } from "../../EditParentStopPlace/utils/stagedChildChanges";
import type { MapStopPlace } from "../markers/types";
import { useMapCurrentStop } from "./useMapCurrentStop";

export interface StagedChildMarkers {
  /** Children attached since the last save. */
  addedChildIds: ReadonlySet<string>;
  /** Saved children detached since the last save, still to be drawn. */
  detachedChildren: MapStopPlace[];
}

const NO_STAGED_CHANGES: StagedChildMarkers = {
  addedChildIds: new Set(),
  detachedChildren: [],
};

/**
 * The open multimodal stop's unsaved child changes, for the map (F-91,
 * F-92). A detached child is no longer in `current.children`, and the map
 * query only has a stale, expired copy of it, so without this it vanished
 * or looked expired until the save.
 */
export const useStagedChildMarkers = (): StagedChildMarkers => {
  const current = useMapCurrentStop();
  const original = useAppSelector(
    (state) => (state.stopPlace as any).originalCurrent as MapStopPlace | null,
  );

  return useMemo(() => {
    if (!current?.isParent || original?.id !== current.id) {
      return NO_STAGED_CHANGES;
    }
    const { childrenToAdd, childrenToRemove } = findStagedChildChanges(
      original.children,
      current.children,
    );
    const detachedIds = new Set(childrenToRemove);
    return {
      addedChildIds: new Set(childrenToAdd),
      detachedChildren: ((original.children ?? []) as MapStopPlace[]).filter(
        (child) => detachedIds.has(child.id),
      ),
    };
  }, [current, original]);
};
