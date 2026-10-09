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

import { useMemo } from "react";
import { useAppSelector } from "../../../../store/hooks";
import { getChangedKeys } from "./stopPlaceFieldStatus";

/**
 * The stop place fields with unsaved edits, derived by diffing against the
 * `originalCurrent` snapshot. Memoised because the diff walks the whole stop
 * place and every list row and tab reads the result.
 */
export const useStopPlaceDirtyKeys = (): Set<string> => {
  const current = useAppSelector(
    (state) => (state.stopPlace as any).current as Record<string, unknown>,
  );
  const original = useAppSelector(
    (state) =>
      (state.stopPlace as any).originalCurrent as Record<string, unknown>,
  );

  return useMemo(() => getChangedKeys(current, original), [current, original]);
};
