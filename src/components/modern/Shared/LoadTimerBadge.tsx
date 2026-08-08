/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 *  the European Commission - subsequent versions of the EUPL (the "Licence");
 *  You may not use this work except in compliance with the Licence.
 *  You may obtain a copy of the Licence at:
 *
 *    https://joinup.ec.europa.eu/software/page/eupl
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the Licence is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the Licence for the specific language governing permissions and
 *  limitations under the Licence. */

import { Chip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { version } from "../../../../package.json";
import { useConfig } from "../../../config/ConfigContext";
import { useAppSelector } from "../../../store/hooks";

const BADGE_SX = {
  position: "fixed",
  bottom: 56,
  right: 16,
  zIndex: 9999,
  fontFamily: "monospace",
  fontSize: "0.7rem",
  pointerEvents: "none",
  bgcolor: "background.paper",
} as const;

/**
 * Development benchmark badge.
 *
 * Shows the current app version and the time taken to load the last stop
 * place (measured from SET_STOP_PLACE_LOADING dispatched in
 * getStopPlaceWithAll to the reducer clearing loading:false).
 */
export const LoadTimerBadge = () => {
  const { featureFlags } = useConfig();
  const stopPlaceLoading = useAppSelector(
    (state: any) => state.stopPlace.loading as boolean,
  );
  const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (stopPlaceLoading) {
      startTimeRef.current = performance.now();
      setLoadTimeMs(null);
    } else if (startTimeRef.current !== null) {
      setLoadTimeMs(Math.round(performance.now() - startTimeRef.current));
      startTimeRef.current = null;
    }
  }, [stopPlaceLoading]);

  const timerPart = stopPlaceLoading
    ? "⏱ …"
    : loadTimeMs !== null
      ? `⏱ ${loadTimeMs} ms`
      : null;

  const label = timerPart ? `v${version} | ${timerPart}` : `v${version}`;

  if (!featureFlags?.LoadTimerBadge) return null;

  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      color={stopPlaceLoading ? "warning" : "default"}
      sx={BADGE_SX}
    />
  );
};
