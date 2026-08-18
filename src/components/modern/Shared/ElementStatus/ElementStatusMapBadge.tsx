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

import { Box } from "@mui/material";

const BADGE_SIZE = 10;
const BADGE_RING_WIDTH = 2;
/** Pushes the badge onto the marker's edge rather than fully outside it. */
const BADGE_INSET = -2;

interface ElementStatusMapBadgeProps {
  /** Hidden when the element is saved and unchanged, or the affordance is off. */
  visible: boolean;
  /** Marker scale from useMarkerScale, so the badge tracks marker size. */
  scale: number;
}

/**
 * The dirty dot on a **map marker** — the list dot moved onto the marker's
 * top-right corner and ringed so it reads against the marker fill.
 *
 * A badge rather than a restyled marker: marker fill and border already carry
 * meaning (`warning.main` fill signals focus, the ring is the outline) and
 * fading a marker reads as disabled. Adding a mark in unused space avoids
 * overloading any of those signals.
 *
 * Must render inside the marker's circle, which needs `position: relative` —
 * otherwise the badge re-anchors when focus applies a transform.
 */
export const ElementStatusMapBadge = ({
  visible,
  scale,
}: ElementStatusMapBadgeProps) => {
  if (!visible) return null;

  const size = Math.round(BADGE_SIZE * scale);

  return (
    <Box
      sx={{
        position: "absolute",
        top: BADGE_INSET,
        right: BADGE_INSET,
        width: size,
        height: size,
        borderRadius: "50%",
        bgcolor: "warning.main",
        border: `${BADGE_RING_WIDTH}px solid`,
        borderColor: "warning.contrastText",
        pointerEvents: "none",
      }}
    />
  );
};
