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

import React from "react";

/**
 * Recognizable, brand-evocative glyphs for the external-link buttons in the
 * quay popup (OpenStreetMap, Google Maps / Street View, Statens vegvesen).
 *
 * These are self-contained inline SVGs — no external requests — with their own
 * fills so each button reads distinctly in colour rather than a single tint.
 * They are original glyphs inspired by each service, not the official logos.
 */

const DEFAULT_SIZE = 18;

interface BrandIconProps {
  size?: number;
}

/** Folded map with a magnifying glass — OpenStreetMap. */
export const OpenStreetMapIcon: React.FC<BrandIconProps> = ({
  size = DEFAULT_SIZE,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M3 6.2 9 4l6 2.2L21 4v11.6L15 18l-6-2.2L3 18Z"
      fill="#8bc34a"
      stroke="#558b2f"
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path d="M9 4v11.8M15 6.2V18" stroke="#558b2f" strokeWidth="1.1" />
    <circle
      cx="15.5"
      cy="14.5"
      r="4"
      fill="#ffffff"
      stroke="#37474f"
      strokeWidth="1.6"
    />
    <line
      x1="18.4"
      y1="17.4"
      x2="21.4"
      y2="20.4"
      stroke="#37474f"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/** Location pin with a white centre — Google Maps / Street View. */
export const GoogleMapsIcon: React.FC<BrandIconProps> = ({
  size = DEFAULT_SIZE,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M12 2c-3.9 0-7 3.1-7 7 0 4.9 7 13 7 13s7-8.1 7-13c0-3.9-3.1-7-7-7Z"
      fill="#ea4335"
    />
    <circle cx="12" cy="9" r="2.6" fill="#ffffff" />
  </svg>
);

/** Camera glyph in Statens vegvesen blue — vegbilder (road imagery). */
export const VegvesenIcon: React.FC<BrandIconProps> = ({
  size = DEFAULT_SIZE,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M8.5 5.5 9.7 3.5h4.6l1.2 2H20a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V7A1.5 1.5 0 0 1 4 5.5Z"
      fill="#0067c5"
    />
    <circle cx="12" cy="12.5" r="3.6" fill="#ffffff" />
    <circle cx="12" cy="12.5" r="1.9" fill="#0067c5" />
  </svg>
);
