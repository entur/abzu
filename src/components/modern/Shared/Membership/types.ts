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

export interface MembershipParent {
  id: string;
  name: string;
}

export interface MembershipGroup {
  id: string;
  name: string;
}

/**
 * The layouts available for showing a stop place's parent and group
 * memberships. Selected in the header under Utseende and persisted via
 * SettingsManager, so the choice survives reloads while it is being evaluated.
 */
export const MEMBERSHIP_VARIANTS = [
  "chips",
  "card",
  "path",
  "section",
  "list",
  "identity",
] as const;

export type MembershipVariant = (typeof MEMBERSHIP_VARIANTS)[number];

export const isMembershipVariant = (v: unknown): v is MembershipVariant =>
  typeof v === "string" &&
  (MEMBERSHIP_VARIANTS as readonly string[]).includes(v);

export interface MembershipProps {
  /** Present only when the stop place is a child of a parent stop place. */
  parentStop?: MembershipParent | null;
  groups?: MembershipGroup[];
  /** Name of the stop place being viewed — used by the path variant. */
  currentName?: string;
}

/**
 * Some translations already end in a colon (`belongs_to_groups` is
 * "Stoppestedsgrupper:") while others do not. Appending unconditionally is why
 * the original layout renders "Stoppestedsgrupper::".
 */
export const withColon = (label: string) =>
  label.endsWith(":") ? label : `${label}:`;
