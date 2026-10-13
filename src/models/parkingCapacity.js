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

// The total the editor shows. Tiamat sets the stored total to the sum of
// the entries on save, so the sum of the rows is the total a save produces.
// A save sends no entries for a parking that has no rows and held no stored
// entries, so that parking keeps its stored total.
export const capacityEntriesTotal = (parking) => {
  const capacityEntries = parking?.capacityEntries;
  const storedTotal = parking?.totalCapacity;
  const storedSpaces = parking?.parkingProperties?.[0]?.spaces || [];
  const counts = (capacityEntries || [])
    .map((entry) => entry.numberOfSpaces)
    .filter((count) => count !== null && count !== undefined && count !== "")
    .map(Number)
    .filter((count) => !isNaN(count));

  if (!capacityEntries?.length && !storedSpaces.length) {
    return storedTotal ?? null;
  }

  const total = counts.reduce((sum, count) => sum + count, 0);

  return total > 0 ? total : null;
};
