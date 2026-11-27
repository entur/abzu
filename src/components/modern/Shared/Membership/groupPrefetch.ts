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

/** How long a group fetched just before navigating counts as fresh. */
export const PREFETCH_FRESH_MS = 5000;

let lastPrefetch: { groupId: string; at: number } | null = null;

/**
 * The group chip fetches the group before navigating, so the stop page can
 * show it loading; the group route then doesn't need to fetch it again
 * (S-3). Direct links, Back and later visits still fetch.
 */
export const markGroupPrefetched = (
  groupId: string,
  now = Date.now(),
): void => {
  lastPrefetch = { groupId, at: now };
};

export const wasGroupJustPrefetched = (
  groupId: string,
  now = Date.now(),
): boolean =>
  !!lastPrefetch &&
  lastPrefetch.groupId === groupId &&
  now - lastPrefetch.at < PREFETCH_FRESH_MS;
