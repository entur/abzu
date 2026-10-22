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

import { useAppSelector } from "../../../../../store/hooks";
import { isOlderVersion } from "../olderVersion";

/**
 * Whether the editor shows an older version of the stop (F-42). An older
 * version is history: it is read-only and is not "expired".
 */
export const useIsViewingOlderVersion = (): boolean =>
  useAppSelector((state) =>
    isOlderVersion(
      (state.stopPlace as any).current,
      (state.stopPlace as any).versions,
    ),
  );
