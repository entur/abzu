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

import { useCallback, useState } from "react";
import { getMutationErrorMessageId } from "../utils/mutationErrorMessage";

interface DialogMutation {
  isRunning: boolean;
  /** Set when the last run failed; the dialog shows it and stays open. */
  errorMessageId: string | null;
  /** Runs the mutation; resolves to true when it succeeded. Never rejects. */
  run: (mutation: () => Promise<unknown>) => Promise<boolean>;
  resetError: () => void;
}

/**
 * Error handling for dialogs whose Confirm acts on the server at once (merge,
 * move quay). They used to have no `.catch`: a failure left the dialog
 * "just holding", with the rejection unhandled (F-105, F-108). Same contract
 * as SaveDialog: the error is shown in the dialog and Confirm can retry.
 */
export const useDialogMutation = (
  fallbackMessageId: string,
): DialogMutation => {
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessageId, setErrorMessageId] = useState<string | null>(null);

  const run = useCallback(
    async (mutation: () => Promise<unknown>): Promise<boolean> => {
      setIsRunning(true);
      setErrorMessageId(null);
      try {
        await mutation();
        return true;
      } catch (error) {
        setErrorMessageId(getMutationErrorMessageId(error, fallbackMessageId));
        return false;
      } finally {
        setIsRunning(false);
      }
    },
    [fallbackMessageId],
  );

  const resetError = useCallback(() => setErrorMessageId(null), []);

  return { isRunning, errorMessageId, run, resetError };
};
