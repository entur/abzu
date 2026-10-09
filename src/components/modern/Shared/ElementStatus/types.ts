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
 * Whether unsaved child elements (quays, parking) are marked with a dirty dot.
 * Persisted via SettingsManager so the choice survives reloads.
 *
 * Kept as a named variant rather than a bare boolean so a future affordance can
 * be added without migrating the stored value — unknown values fall back to
 * `off` through isElementStatusVariant.
 */
export const ELEMENT_STATUS_VARIANTS = ["off", "dot"] as const;

export type ElementStatusVariant = (typeof ELEMENT_STATUS_VARIANTS)[number];

export const isElementStatusVariant = (
  value: unknown,
): value is ElementStatusVariant =>
  typeof value === "string" &&
  (ELEMENT_STATUS_VARIANTS as readonly string[]).includes(value);

/**
 * A child element's pending-change state, derived by diffing the live element
 * against the `originalCurrent` snapshot taken when the stop place loaded.
 *
 * - `new` — added locally, has no id yet
 * - `modified` — exists on the server but differs from the snapshot
 * - `deleted` — removed locally, still exists on the server (ghost row)
 */
export type ElementChangeStatus = "unchanged" | "new" | "modified" | "deleted";

/** `new` and `modified` both mean "there is something unsaved here". */
export const isPendingStatus = (status: ElementChangeStatus): boolean =>
  status === "new" || status === "modified";
