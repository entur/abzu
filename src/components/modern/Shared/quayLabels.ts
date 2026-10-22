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

type FormatMessage = (descriptor: { id: string }) => string;

interface LabelledQuay {
  id?: string | null;
  publicCode?: string | null;
}

/**
 * Title for a quay in popups, panels and lists. A running number is only a
 * stand-in until the quay is saved, so it's shown as "New quay N"; a saved
 * quay without a public code is just "Quay", with its NSR id shown beside it
 * (F-20). Before, saved quays kept a made-up number that looked like a code.
 */
export const getQuayTitle = (
  quay: LabelledQuay,
  index: number,
  formatMessage: FormatMessage,
): string => {
  if (quay.publicCode) {
    return `${formatMessage({ id: "quay" })} ${quay.publicCode}`;
  }
  if (quay.id) return formatMessage({ id: "quay" });
  return `${formatMessage({ id: "new_quay" })} ${index + 1}`;
};

/**
 * Text on the quay map marker: the chosen code, a running number while the
 * quay is unsaved, otherwise nothing (an empty marker) (F-20).
 */
export const getQuayMarkerLabel = (
  quay: LabelledQuay,
  code: string | null | undefined,
  index: number,
): string => code || (quay.id ? "" : String(index + 1));
