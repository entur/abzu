/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { ReportPage as ReportPageComponent } from "../../components/modern/ReportPage/ReportPage";
import { extractQueryParamsFromUrl } from "../../utils/URLhelpers";

/**
 * Modern container for the Report page
 * Reads initial filter state from URL and passes to component
 */
const ReportPage: React.FC = () => {
  const fromURL = extractQueryParamsFromUrl();

  const initialState = {
    searchQuery: fromURL.query || "",
    withoutLocationOnly: fromURL.withoutLocationOnly === "true",
    withNearbySimilarDuplicates: fromURL.withNearbySimilarDuplicates === "true",
    hasParking: fromURL.hasParking === "true",
    withDuplicateImportedIds: fromURL.withDuplicateImportedIds === "true",
    showFutureAndExpired: fromURL.showFutureAndExpired === "true",
    withTags: fromURL.withTags === "true",
    tags: fromURL.tags ? fromURL.tags.split(",") : [],
    stopTypeFilter: fromURL.stopPlaceType
      ? fromURL.stopPlaceType.split(",")
      : [],
  };

  return <ReportPageComponent initialState={initialState} />;
};

export default ReportPage;
