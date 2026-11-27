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

/** `[lat, lng]`, the order Redux stores positions in. */
export type CoordinatePin = [number, number] | null;

type Listener = () => void;
const listeners = new Set<Listener>();
let pin: CoordinatePin = null;

const notify = () => listeners.forEach((listener) => listener());

/** Where "Go to coordinates" last flew, until the next map click or search (F-94). */
export const getCoordinatePin = (): CoordinatePin => pin;

export const setCoordinatePin = (position: [number, number]): void => {
  pin = position;
  notify();
};

export const clearCoordinatePin = (): void => {
  if (pin === null) return;
  pin = null;
  notify();
};

/** For useSyncExternalStore; returns the unsubscribe function. */
export const subscribeToCoordinatePin = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
