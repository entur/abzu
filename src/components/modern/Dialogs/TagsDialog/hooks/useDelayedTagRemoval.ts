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

import { useCallback, useEffect, useRef, useState } from "react";

/** How long a removed tag can be brought back before it is really removed. */
export const UNDO_WINDOW_MS = 5000;

export interface DelayedTagRemoval {
  /** The tag waiting to be removed, or null. */
  pendingName: string | null;
  /** Hides the tag now and removes it when the undo window ends. */
  scheduleRemoval: (name: string) => void;
  undoRemoval: () => void;
  /** Removes a waiting tag right away, e.g. when the dialog closes. */
  flushRemoval: () => void;
}

/**
 * Removing a tag is one click and can't be undone on the server, so the
 * removal waits a few seconds and can be undone in that time (F-59). One tag
 * waits at a time: removing a second one completes the first. A waiting
 * removal is completed when the dialog closes or unmounts, never dropped.
 */
export const useDelayedTagRemoval = (
  removeNow: (name: string) => void,
): DelayedTagRemoval => {
  const [pendingName, setPendingName] = useState<string | null>(null);
  const pendingRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeNowRef = useRef(removeNow);
  removeNowRef.current = removeNow;

  const clearPending = useCallback((): string | null => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    const name = pendingRef.current;
    pendingRef.current = null;
    setPendingName(null);
    return name;
  }, []);

  const flushRemoval = useCallback(() => {
    const name = clearPending();
    if (name) removeNowRef.current(name);
  }, [clearPending]);

  const scheduleRemoval = useCallback(
    (name: string) => {
      flushRemoval();
      pendingRef.current = name;
      setPendingName(name);
      timerRef.current = setTimeout(flushRemoval, UNDO_WINDOW_MS);
    },
    [flushRemoval],
  );

  const undoRemoval = useCallback(() => {
    clearPending();
  }, [clearPending]);

  useEffect(() => flushRemoval, [flushRemoval]);

  return { pendingName, scheduleRemoval, undoRemoval, flushRemoval };
};
