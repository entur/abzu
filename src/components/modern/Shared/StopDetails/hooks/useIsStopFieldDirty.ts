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

import {
  useElementStatusEnabled,
  useStopPlaceDirtyKeys,
} from "../../ElementStatus";

/** Whether any of the open stop's given fields has an unsaved change. */
export const useIsStopFieldDirty = (): ((...keys: string[]) => boolean) => {
  const isStatusEnabled = useElementStatusEnabled();
  const dirtyKeys = useStopPlaceDirtyKeys();
  return (...keys: string[]) =>
    isStatusEnabled && keys.some((key) => dirtyKeys.has(key));
};
