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

/** Share of the designed marker sizes each choice draws at working zoom. */
export const MARKER_SIZES = {
  small: 0.75,
  medium: 0.9,
  large: 1,
} as const;

export type MarkerSize = keyof typeof MARKER_SIZES;

export const MARKER_SIZE_CHOICES = Object.keys(MARKER_SIZES) as MarkerSize[];

/** A first-time user gets the middle choice. */
export const DEFAULT_MARKER_SIZE: MarkerSize = "medium";

const STORAGE_KEY = "modern.markerSize";

type Listener = () => void;
const listeners = new Set<Listener>();

const isMarkerSize = (value: string | null): value is MarkerSize =>
  value !== null && MARKER_SIZE_CHOICES.includes(value as MarkerSize);

/** The user's marker size, remembered per browser like the crosshair. */
export const getMarkerSizePreference = (): MarkerSize => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isMarkerSize(stored) ? stored : DEFAULT_MARKER_SIZE;
  } catch {
    return DEFAULT_MARKER_SIZE;
  }
};

/** Stores the choice and redraws every marker that listens. */
export const setMarkerSizePreference = (size: MarkerSize): void => {
  try {
    localStorage.setItem(STORAGE_KEY, size);
  } catch {
    // localStorage unavailable: the choice lasts until the page reloads
  }
  listeners.forEach((listener) => listener());
};

/**
 * For useSyncExternalStore. A `storage` event keeps other open tabs in step.
 * Returns the unsubscribe function.
 */
export const subscribeToMarkerSize = (listener: Listener): (() => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
};
