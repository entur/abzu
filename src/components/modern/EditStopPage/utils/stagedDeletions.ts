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

interface ElementWithOptionalId {
  id?: string | null;
}

/**
 * Derives which already-saved child elements (quays, parking) the user has
 * removed but not yet committed.
 *
 * Removing an element only mutates local Redux state, so the pending deletions
 * are whatever exists in `originalCurrent` (the deep copy taken when the stop
 * was loaded) but no longer exists in `current`. Deriving instead of storing
 * means Undo and reload clear the set for free — both replace `current` from
 * `originalCurrent`, which makes the diff empty again.
 *
 * Elements without an id were never saved, so they need no server call.
 */
export const findStagedDeletions = (
  originalElements: ElementWithOptionalId[] | undefined | null,
  currentElements: ElementWithOptionalId[] | undefined | null,
): string[] => {
  if (!originalElements?.length) return [];

  const remainingIds = new Set(
    (currentElements ?? []).map((element) => element.id).filter(Boolean),
  );

  return originalElements
    .map((element) => element.id)
    .filter((id): id is string => Boolean(id) && !remainingIds.has(id));
};
