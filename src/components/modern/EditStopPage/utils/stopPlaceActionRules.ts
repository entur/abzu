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

interface TerminatableStop {
  id?: string;
  isNewStop?: boolean;
  isChildOfParent?: boolean;
  hasExpired?: boolean;
  permanentlyTerminated?: boolean;
}

/**
 * Whether Deactivate is offered (legacy parity). Edit rights are enough:
 * Tiamat accepts `terminateStopPlace` from a user without delete rights
 * (checked on dev with an Agder-restricted user), and delete rights only
 * matter for "Delete permanently" inside the dialog. A child of a multimodal
 * stop is deactivated through its parent (F-43). An expired stop can only be
 * deleted, so it needs delete rights.
 */
export const canOfferTerminate = (
  stopPlace: TerminatableStop,
  canEdit: boolean,
  canDelete: boolean,
): boolean => {
  if (!stopPlace.id || stopPlace.isNewStop || !canEdit) return false;
  if (stopPlace.permanentlyTerminated || stopPlace.isChildOfParent) {
    return false;
  }
  return !stopPlace.hasExpired || canDelete;
};

/**
 * Whether there is something to save: an edit, or an expired stop, which
 * saving reactivates (legacy parity; the multimodal editor already did this).
 */
export const hasSomethingToSave = (
  isModified: boolean,
  hasExpired: boolean | undefined,
): boolean => isModified || !!hasExpired;
