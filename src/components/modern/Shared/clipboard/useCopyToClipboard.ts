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
import { copyToClipboard } from "./copyToClipboard";

const COPIED_FEEDBACK_MS = 1500;
const FAILED_FEEDBACK_MS = 4000;

export type CopyStatus = "idle" | "copied" | "failed";

export interface CopyToClipboard {
  status: CopyStatus;
  copy: (text: string) => void;
}

/** Copies text and keeps "copied" or "failed" for a moment, for feedback. */
export const useCopyToClipboard = (): CopyToClipboard => {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showStatus = useCallback((next: CopyStatus, durationMs: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus(next);
    timerRef.current = setTimeout(() => setStatus("idle"), durationMs);
  }, []);

  const copy = useCallback(
    (text: string) => {
      copyToClipboard(text).then((copied) =>
        copied
          ? showStatus("copied", COPIED_FEEDBACK_MS)
          : showStatus("failed", FAILED_FEEDBACK_MS),
      );
    },
    [showStatus],
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return { status, copy };
};
