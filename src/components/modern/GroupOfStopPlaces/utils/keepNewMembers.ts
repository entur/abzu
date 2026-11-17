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

/** A member lookup result: one entry per looked-up id, the stop first. */
export type MemberLookupData = Record<
  string,
  ReadonlyArray<{ id: string }> | null | undefined
>;

/**
 * Drops looked-up stops that are already members, or appear twice in the
 * lookup. Looking up a multimodal child returns its parent, so "add the
 * child" added the parent again on every click (F-90). Returns null when
 * nothing new is left.
 */
export const keepNewMembers = (
  data: MemberLookupData | null | undefined,
  memberIds: ReadonlyArray<string>,
): MemberLookupData | null => {
  const seenIds = new Set(memberIds);
  const newEntries = Object.entries(data ?? {}).filter(([, stops]) => {
    const id = stops?.[0]?.id;
    if (!id || seenIds.has(id)) return false;
    seenIds.add(id);
    return true;
  });
  return newEntries.length ? Object.fromEntries(newEntries) : null;
};
