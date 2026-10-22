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

/** Longest code drawn in full inside a quay circle. */
const MAX_FULL_LENGTH = 5;
const TRUNCATED_LENGTH = MAX_FULL_LENGTH - 1;
const ELLIPSIS = "…";

/** Font size factor by code length: 3 characters fit at full size. */
const FONT_SCALE_BY_LENGTH: Record<number, number> = { 4: 0.8, 5: 0.65 };
const FULL_SIZE_MAX_LENGTH = 3;
const SMALLEST_FONT_SCALE = 0.65;

interface QuayLabelFit {
  text: string;
  /** Multiply the marker's font size by this. */
  fontScale: number;
  isTruncated: boolean;
}

/**
 * Fits a quay code into its fixed-size circle (F-100): longer codes get a
 * smaller font, and codes beyond five characters are cut with an ellipsis
 * (the marker shows the full code in its tooltip).
 */
export const fitQuayLabel = (label: string): QuayLabelFit => {
  const { length } = label;
  if (length <= FULL_SIZE_MAX_LENGTH) {
    return { text: label, fontScale: 1, isTruncated: false };
  }
  if (length <= MAX_FULL_LENGTH) {
    return {
      text: label,
      fontScale: FONT_SCALE_BY_LENGTH[length],
      isTruncated: false,
    };
  }
  return {
    text: `${label.slice(0, TRUNCATED_LENGTH)}${ELLIPSIS}`,
    fontScale: SMALLEST_FONT_SCALE,
    isTruncated: true,
  };
};
