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

const ABSOLUTE_URL_PATTERN = /^(https?:)?\/\//;
const LEADING_SLASH_PATTERN = /^\//;

/**
 * Resolves a theme-declared asset path against the app's base URL so themes work
 * under a sub-path deployment. Absolute URLs are returned untouched.
 */
export const resolveThemeAssetUrl = (url: string): string =>
  ABSOLUTE_URL_PATTERN.test(url)
    ? url
    : `${import.meta.env.BASE_URL}${url.replace(LEADING_SLASH_PATTERN, "")}`;
