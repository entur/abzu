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

import { RefObject, useEffect, useRef } from "react";

/**
 * Scrolls the list row the editor came from into view, once, after the stop
 * panel mounts again. `block: "nearest"` leaves a row that is already visible
 * where it is. Attach the returned ref to the row at `scrollToIndex`.
 */
export const useScrollToReturnedRow = (
  scrollToIndex: number | null | undefined,
  onScrolled: (() => void) | undefined,
): RefObject<HTMLDivElement | null> => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollToIndex === null || scrollToIndex === undefined) return;
    rowRef.current?.scrollIntoView({ block: "nearest" });
    onScrolled?.();
  }, [scrollToIndex, onScrolled]);

  return rowRef;
};
