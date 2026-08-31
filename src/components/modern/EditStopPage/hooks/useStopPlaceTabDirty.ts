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
  hasChangedKey,
  hasGeneralTabChange,
  useElementStatusEnabled,
  useStopPlaceDirtyKeys,
} from "../../Shared/ElementStatus";

export type IsTabDirty = (keys?: readonly string[]) => boolean;

/**
 * Whether a given tab has unsaved edits, honouring the element-status setting.
 *
 * Shared by the expanded tab strip and the collapsed shortcuts so the dot
 * appears on the same tab in both states.
 */
export const useStopPlaceTabDirty = (): IsTabDirty => {
  const isStatusEnabled = useElementStatusEnabled();
  const dirtyKeys = useStopPlaceDirtyKeys();

  /** No keys means the General tab, which catches every key no other tab claims. */
  return (keys?: readonly string[]) =>
    isStatusEnabled &&
    (keys ? hasChangedKey(dirtyKeys, keys) : hasGeneralTabChange(dirtyKeys));
};
