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

/** Panel state on a user's first visit, before any preference has been stored. */
const DEFAULT_DRAWER_OPEN = true;

type Listener = () => void;
const listeners = new Set<Listener>();
/** The last value set, used while localStorage is unavailable. */
let inMemoryPreference: boolean | null = null;

/**
 * Reads the user's sticky drawer preference from localStorage.
 * Defaults to expanded on a first visit; an explicitly stored preference always wins,
 * so a user who collapsed the panel keeps it collapsed.
 */
export const getDrawerPreference = (): boolean => {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === null) {
      return inMemoryPreference ?? DEFAULT_DRAWER_OPEN;
    }
    return stored === "true";
  } catch {
    return inMemoryPreference ?? DEFAULT_DRAWER_OPEN;
  }
};

/**
 * Saves the user's drawer preference to localStorage so it survives navigation,
 * and tells everything that follows the drawer (e.g. the map's + button, F-10d).
 */
export const setDrawerPreference = (open: boolean): void => {
  inMemoryPreference = open;
  try {
    localStorage.setItem(KEY, String(open));
  } catch {
    // localStorage unavailable — the in-memory value lasts until reload
  }
  listeners.forEach((listener) => listener());
};

/** For useSyncExternalStore; returns the unsubscribe function. */
export const subscribeToDrawerOpen = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
