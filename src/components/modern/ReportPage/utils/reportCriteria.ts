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

import type { FilterState } from "../types";

/**
 * Whether anything narrows a report search. "Show future and expired" only
 * widens it, so on its own it doesn't count. Without criteria the search
 * fetches the whole registry (~30 s), so the user is asked first (F-65).
 */
export const hasReportCriteria = (filters: FilterState): boolean =>
  filters.searchQuery.trim() !== "" ||
  filters.stopTypeFilter.length > 0 ||
  filters.topoiChips.length > 0 ||
  filters.tags.length > 0 ||
  filters.withoutLocationOnly ||
  filters.withDuplicateImportedIds ||
  filters.withNearbySimilarDuplicates ||
  filters.hasParking ||
  filters.withTags;
