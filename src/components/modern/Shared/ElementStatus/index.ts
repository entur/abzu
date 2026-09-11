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

export {
  buildElementListEntries,
  buildElementStatusByIndex,
  isDeepEqual,
  type ElementListEntry,
} from "./elementChangeStatus";
export { DirtyBadge } from "./DirtyBadge";
export { DirtyLabel } from "./DirtyLabel";
export { ElementStatusDot } from "./ElementStatusDot";
export { ElementStatusMapBadge } from "./ElementStatusMapBadge";
export { getElementRowStatusSx } from "./elementStatusStyles";
export {
  ELEMENT_STATUS_VARIANTS,
  isElementStatusVariant,
  isPendingStatus,
  type ElementChangeStatus,
  type ElementStatusVariant,
} from "./types";
export {
  ACCESSIBILITY_TAB_KEYS,
  ASSISTANCE_TAB_KEYS,
  CHILD_COLLECTION_KEYS,
  FACILITIES_TAB_KEYS,
  getChangedKeys,
  hasChangedKey,
  hasChildCollectionChange,
  hasGeneralTabChange,
  KEY_VALUES_TAB_KEYS,
} from "./stopPlaceFieldStatus";
export { UnsavedDot } from "./UnsavedDot";
export { useElementStatusEnabled } from "./useElementStatusDisplay";
export { useStopPlaceDirtyKeys } from "./useStopPlaceDirtyKeys";
