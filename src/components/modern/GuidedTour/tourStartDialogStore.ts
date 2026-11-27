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

type Listener = () => void;
const listeners = new Set<Listener>();
let isOpen = false;

const set = (next: boolean): void => {
  isOpen = next;
  listeners.forEach((listener) => listener());
};

/** Whether the "start a test tour" dialog is open (the menu closes first). */
export const isTourStartDialogOpen = (): boolean => isOpen;
export const openTourStartDialog = (): void => set(true);
export const closeTourStartDialog = (): void => set(false);
export const subscribeToTourStartDialog = (
  listener: Listener,
): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
