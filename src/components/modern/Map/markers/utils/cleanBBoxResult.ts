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

/** The fields of a `stopPlaceBBox` entry the cleaning reads. */
export interface BBoxStop {
  id: string;
  version?: string | number | null;
  validBetween?: { toDate?: string | null } | null;
  children?: ReadonlyArray<{ id: string }> | null;
}

const isExpiredAt = (stop: BBoxStop, now: number): boolean => {
  const toDate = stop.validBetween?.toDate;
  return !!toDate && new Date(toDate).getTime() <= now;
};

const keepNewestVersions = <Stop extends BBoxStop>(stops: Stop[]): Stop[] => {
  const newestById = new Map<string, Stop>();
  for (const stop of stops) {
    const kept = newestById.get(stop.id);
    if (!kept || Number(stop.version) > Number(kept.version)) {
      newestById.set(stop.id, stop);
    }
  }
  return [...newestById.values()];
};

/**
 * Tiamat's map query also returns old, expired versions, even with
 * `includeExpired: false` (F-85, F-92): an old parent version with children
 * that left long ago, and a child's last standalone version from before it
 * joined its parent. Drawn on the map they give ghost multimodal lines and
 * active stops that look expired.
 *
 * Keeps the newest version of each stop, drops expired ones unless the user
 * asked for them, and drops standalone copies of stops that a returned
 * parent lists as its children (their current version lives in the parent).
 */
export const cleanBBoxResult = <Stop extends BBoxStop>(
  stops: ReadonlyArray<Stop>,
  includeExpired: boolean,
  now: number = Date.now(),
): Stop[] => {
  const newest = keepNewestVersions([...stops]);
  const childIds = new Set(
    newest.flatMap((stop) => (stop.children ?? []).map((child) => child.id)),
  );
  return newest.filter(
    (stop) =>
      !childIds.has(stop.id) && (includeExpired || !isExpiredAt(stop, now)),
  );
};
