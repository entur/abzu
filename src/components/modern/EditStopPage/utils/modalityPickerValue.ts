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

const MODALITY_SEPARATOR = "|";

export interface Modality {
  stopPlaceType: string;
  submode: string | null;
}

/** Encodes a stop type and optional submode as one picker option value. */
export const toModalityPickerValue = (
  stopPlaceType: string | null | undefined,
  submode: string | null | undefined,
): string => `${stopPlaceType ?? ""}${MODALITY_SEPARATOR}${submode ?? ""}`;

/**
 * Decodes a picker value. A bare type ("onstreetBus|") has no submode, which
 * must be null: Tiamat's SubmodeType enum rejects "" with HTTP 400 (F-19).
 */
export const parseModalityPickerValue = (value: string): Modality => {
  const separatorIndex = value.indexOf(MODALITY_SEPARATOR);
  return {
    stopPlaceType: value.slice(0, separatorIndex),
    submode: value.slice(separatorIndex + 1) || null,
  };
};
