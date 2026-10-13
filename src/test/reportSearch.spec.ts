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

import { describe, expect, test } from "vitest";
import { hasReportCriteria } from "../components/modern/ReportPage/utils/reportCriteria";
import { toReportQueryString } from "../components/modern/ReportPage/utils/reportQueryString";
import type { FilterState } from "../components/modern/ReportPage/types";

const NO_FILTERS = {
  searchQuery: "",
  topoiChips: [],
  stopTypeFilter: [],
  tags: [],
  withoutLocationOnly: false,
  withDuplicateImportedIds: false,
  withNearbySimilarDuplicates: false,
  hasParking: false,
  withTags: false,
  showFutureAndExpired: false,
} as unknown as FilterState;

describe("report search criteria (F-65)", () => {
  test("no query and no filters means no criteria", () => {
    expect(hasReportCriteria(NO_FILTERS)).toBe(false);
  });

  test("'show future and expired' alone doesn't narrow the search", () => {
    expect(
      hasReportCriteria({ ...NO_FILTERS, showFutureAndExpired: true }),
    ).toBe(false);
  });

  test("a query or a filter counts", () => {
    expect(hasReportCriteria({ ...NO_FILTERS, searchQuery: " rom " })).toBe(
      true,
    );
    expect(hasReportCriteria({ ...NO_FILTERS, tags: ["adm_varsling"] })).toBe(
      true,
    );
  });
});

describe("toReportQueryString (F-65)", () => {
  test("keeps set values, joins lists and skips empty ones", () => {
    expect(
      toReportQueryString({
        query: "rom",
        tags: ["adm_varsling", "x"],
        withTags: true,
        stopPlaceType: [],
        countyReference: null,
        hasParking: false,
      }),
    ).toBe("?query=rom&tags=adm_varsling,x&withTags=true&hasParking=false");
  });

  test("nothing set gives an empty string", () => {
    expect(toReportQueryString({ query: "", tags: [] })).toBe("");
  });
});
