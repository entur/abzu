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

import { ElementChangeStatus } from "./types";

interface ElementLike {
  id?: string | null;
}

export interface ElementListEntry<TElement extends ElementLike = ElementLike> {
  element: TElement;
  /**
   * Index into the live array, which every element action is keyed by. `null`
   * for ghost rows — a staged deletion is no longer addressable, so those rows
   * must not be navigable or deletable.
   */
  index: number | null;
  status: ElementChangeStatus;
}

/**
 * Order-insensitive deep comparison, used to tell a modified element from an
 * untouched one.
 *
 * Key order is compared explicitly rather than via JSON.stringify because the
 * reducers add fields as the user edits (e.g. a description that did not exist),
 * which reorders keys without changing meaning.
 */
export const isDeepEqual = (left: unknown, right: unknown): boolean => {
  if (left === right) return true;
  if (left === null || right === null) return left === right;
  if (typeof left !== "object" || typeof right !== "object") return false;

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    return left.every((item, index) => isDeepEqual(item, right[index]));
  }

  const leftRecord = left as Record<string, unknown>;
  const rightRecord = right as Record<string, unknown>;

  // Treat an explicit undefined and a missing key as the same thing, so an edit
  // that clears a field does not read as a change when it was already empty.
  const keys = new Set([
    ...Object.keys(leftRecord),
    ...Object.keys(rightRecord),
  ]);

  for (const key of keys) {
    if (leftRecord[key] === undefined && rightRecord[key] === undefined) {
      continue;
    }
    if (!isDeepEqual(leftRecord[key], rightRecord[key])) return false;
  }

  return true;
};

/**
 * Builds the rows to render for a child-element list (quays, parking), tagging
 * each with its pending-change state and including ghost rows for elements the
 * user has removed but not yet saved.
 *
 * Iterating `originalElements` first keeps a ghost in the position its row
 * occupied before deletion, so the row greys out in place rather than jumping to
 * the end. Locally-added elements have no id and cannot appear in the original,
 * so they are appended afterwards in their current order.
 */
export const buildElementListEntries = <TElement extends ElementLike>(
  currentElements: TElement[] | undefined | null,
  originalElements: TElement[] | undefined | null,
): ElementListEntry<TElement>[] => {
  const current = currentElements ?? [];
  const indexById = new Map<string, number>();

  current.forEach((element, index) => {
    if (element.id) indexById.set(element.id, index);
  });

  const entries: ElementListEntry<TElement>[] = [];

  (originalElements ?? []).forEach((originalElement) => {
    if (!originalElement.id) return;

    const currentIndex = indexById.get(originalElement.id);

    if (currentIndex === undefined) {
      entries.push({
        element: originalElement,
        index: null,
        status: "deleted",
      });
      return;
    }

    const currentElement = current[currentIndex];

    entries.push({
      element: currentElement,
      index: currentIndex,
      status: isDeepEqual(currentElement, originalElement)
        ? "unchanged"
        : "modified",
    });
  });

  current.forEach((element, index) => {
    if (element.id) return;
    entries.push({ element, index, status: "new" });
  });

  return entries;
};

/**
 * Per-index status for the live array, aligned with what the map renders.
 *
 * Never returns `deleted`: a staged deletion has no live index and therefore no
 * marker, so map markers only ever need new / modified / unchanged.
 */
export const buildElementStatusByIndex = <TElement extends ElementLike>(
  currentElements: TElement[] | undefined | null,
  originalElements: TElement[] | undefined | null,
): ElementChangeStatus[] => {
  const originalById = new Map<string, TElement>();

  (originalElements ?? []).forEach((element) => {
    if (element.id) originalById.set(element.id, element);
  });

  return (currentElements ?? []).map((element) => {
    if (!element.id) return "new";

    const original = originalById.get(element.id);
    if (!original) return "new";

    return isDeepEqual(element, original) ? "unchanged" : "modified";
  });
};
