/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

const KEY = "stopPlace.drawerOpen";

/**
 * Reads the user's sticky drawer preference from localStorage.
 * Defaults to false (collapsed) when no preference has been saved yet.
 */
export const getDrawerPreference = (): boolean => {
  try {
    const stored = localStorage.getItem(KEY);
    return stored === "true";
  } catch {
    return false;
  }
};

/**
 * Saves the user's drawer preference to localStorage so it survives navigation.
 */
export const setDrawerPreference = (open: boolean): void => {
  try {
    localStorage.setItem(KEY, String(open));
  } catch {
    // localStorage unavailable — preference is lost on navigation but that's acceptable
  }
};
