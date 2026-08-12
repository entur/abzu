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

import { isDeepEqual } from "./elementChangeStatus";

/**
 * Child collections carry their own per-row dots, so a changed quay must not
 * also light up a stop-place-level field indicator.
 */
export const CHILD_COLLECTION_KEYS = ["quays", "parking"] as const;

/** Bookkeeping the reducers maintain; never a user-visible edit. */
const NON_FIELD_KEYS = [
  "__typename",
  "isNewStop",
  "notSaved",
  "permissions",
  "version",
  "versionComment",
] as const;

const IGNORED_KEYS = new Set<string>([
  ...CHILD_COLLECTION_KEYS,
  ...NON_FIELD_KEYS,
]);

/**
 * Top-level keys of the stop place that differ from the snapshot taken when it
 * loaded — i.e. the fields with unsaved edits.
 *
 * Returning the key set rather than a boolean lets each surface decide whether
 * it owns any of them, so a tab or field group can mark itself dirty without a
 * central map of "which field lives where" that would drift out of date.
 */
export const getChangedKeys = (
  current: Record<string, unknown> | null | undefined,
  original: Record<string, unknown> | null | undefined,
): Set<string> => {
  if (!current || !original) return new Set();

  const keys = new Set([...Object.keys(current), ...Object.keys(original)]);
  const changed = new Set<string>();

  keys.forEach((key) => {
    if (IGNORED_KEYS.has(key)) return;
    if (current[key] === undefined && original[key] === undefined) return;
    if (!isDeepEqual(current[key], original[key])) changed.add(key);
  });

  return changed;
};

/** True when any of `keys` has an unsaved edit. */
export const hasChangedKey = (
  changedKeys: Set<string>,
  keys: readonly string[],
): boolean => keys.some((key) => changedKeys.has(key));

/**
 * Keys owned by each editor tab. Tab 0 (General) is deliberately absent: it acts
 * as the catch-all so a changed key nobody claims still surfaces somewhere,
 * rather than silently going unmarked.
 */
export const ACCESSIBILITY_TAB_KEYS = ["accessibilityAssessment"] as const;
export const FACILITIES_TAB_KEYS = ["placeEquipments", "facilities"] as const;
export const ASSISTANCE_TAB_KEYS = ["localServices"] as const;
export const KEY_VALUES_TAB_KEYS = ["keyValues"] as const;

const CLAIMED_TAB_KEYS: readonly string[] = [
  ...ACCESSIBILITY_TAB_KEYS,
  ...FACILITIES_TAB_KEYS,
  ...ASSISTANCE_TAB_KEYS,
  ...KEY_VALUES_TAB_KEYS,
];

/** Everything not claimed by a specific tab belongs to the General tab. */
export const hasGeneralTabChange = (changedKeys: Set<string>): boolean =>
  [...changedKeys].some((key) => !CLAIMED_TAB_KEYS.includes(key));
