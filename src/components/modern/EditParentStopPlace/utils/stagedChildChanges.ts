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

import { findStagedDeletions } from "../../EditStopPage/utils/stagedDeletions";

interface ChildStopPlace {
  id?: string | null;
}

export interface StagedChildChanges {
  childrenToAdd: string[];
  childrenToRemove: string[];
}

/**
 * Derives the pending attach and detach operations of a multimodal stop by
 * diffing `current.children` against `originalCurrent.children`. Attached
 * children are existing stops, so both directions are plain id diffs. Being
 * derived, Discard and reload clear them for free.
 */
export const findStagedChildChanges = (
  originalChildren: ChildStopPlace[] | undefined | null,
  currentChildren: ChildStopPlace[] | undefined | null,
): StagedChildChanges => ({
  childrenToAdd: findStagedDeletions(currentChildren, originalChildren),
  childrenToRemove: findStagedDeletions(originalChildren, currentChildren),
});

/** Saved children that stay after the pending detaches are applied. */
export const countRemainingSavedChildren = (
  originalChildren: ChildStopPlace[] | undefined | null,
  currentChildren: ChildStopPlace[] | undefined | null,
): number => {
  const currentIds = new Set((currentChildren ?? []).map((child) => child.id));
  return (originalChildren ?? []).filter((child) => currentIds.has(child.id))
    .length;
};
