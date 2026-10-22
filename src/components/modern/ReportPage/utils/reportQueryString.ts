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

type ReportParamValue = string | number | boolean | string[] | null | undefined;

/**
 * The report's search as a query string, in the format the Reports page reads
 * back on load (extractQueryParamsFromUrl): `?key=value&…`, lists
 * comma-separated, empty values left out. Written through the router (not raw
 * pushState), so the Reports tab can return to it (F-65).
 */
export const toReportQueryString = (
  params: Record<string, ReportParamValue>,
): string => {
  const pairs = Object.entries(params)
    .filter(([, value]) => {
      if (value == null || value === "") return false;
      return !(Array.isArray(value) && value.length === 0);
    })
    .map(([key, value]) => `${key}=${value}`);
  return pairs.length ? encodeURI(`?${pairs.join("&")}`) : "";
};
