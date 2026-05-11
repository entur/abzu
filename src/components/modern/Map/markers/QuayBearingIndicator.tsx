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

import CheckIcon from "@mui/icons-material/Check";
import NavigationIcon from "@mui/icons-material/Navigation";
import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";
import { useMarkerScale } from "../hooks/useMarkerScale";
import type { MapQuay } from "./types";

const LINE_LENGTH_PX = 100;
const LINE_WIDTH_PX = 2;
const HANDLE_SIZE = 36;

interface QuayBearingIndicatorProps {
  quay: MapQuay;
  index: number;
  focused: boolean;
  disabled: boolean;
  isEditing: boolean;
  onEndEditing: () => void;
}

/**
 * Fixed-pixel bearing line drawn in CSS inside a zero-size Marker.
 * The line is always LINE_LENGTH_PX on screen regardless of zoom.
 * Drag uses capture-phase window listeners to beat MapLibre's canvas handlers.
 */
export const QuayBearingIndicator = ({
  quay,
  index,
  focused,
  disabled,
  isEditing,
  onEndEditing,
}: QuayBearingIndicatorProps): React.JSX.Element | null => {
  const dispatch = useAppDispatch();
  const scale = useMarkerScale();
  const quayCenterRef = useRef<HTMLDivElement>(null);
  const [liveBearing, setLiveBearing] = useState(quay.compassBearing ?? 0);

  useEffect(() => {
    if (quay.compassBearing != null) setLiveBearing(quay.compassBearing);
  }, [quay.compassBearing]);

  if (!isEditing || !quay.location || quay.compassBearing == null) return null;

  const scaledLineLength = Math.round(LINE_LENGTH_PX * scale);

  const [lat, lng] = quay.location;
  const lineColor = focused ? "warning.main" : "success.main";

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const el = quayCenterRef.current;
    if (!el) return;

    // Capture center position once — map won't pan during drag so it stays fixed.
    const { left, top } = el.getBoundingClientRect();

    const computeBearing = (clientX: number, clientY: number): number => {
      const dx = clientX - left;
      const dy = clientY - top;
      return Math.round(((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360);
    };

    const onMove = (ev: PointerEvent) => {
      // Stop propagation so MapLibre doesn't pan while we're rotating.
      ev.stopPropagation();
      setLiveBearing(computeBearing(ev.clientX, ev.clientY));
    };

    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerup", onUp, { capture: true });
      dispatch(
        StopPlaceActions.changeQuayCompassBearing(
          index,
          computeBearing(ev.clientX, ev.clientY),
        ),
      );
    };

    // Capture phase fires before MapLibre's canvas listeners.
    window.addEventListener("pointermove", onMove, { capture: true });
    window.addEventListener("pointerup", onUp, { capture: true });
  };

  return (
    <Marker latitude={lat} longitude={lng} anchor="center">
      {/* Zero-size container anchored to quay center; overflow visible so line/handle float outside */}
      <Box
        ref={quayCenterRef}
        sx={{
          position: "relative",
          width: 0,
          height: 0,
          overflow: "visible",
          userSelect: "none",
        }}
      >
        {/* Done button — fixed below quay center, does not rotate */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            onEndEditing();
          }}
          sx={(t) => ({
            position: "absolute",
            top: 24,
            left: 0,
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: lineColor,
            color: focused ? "warning.contrastText" : "success.contrastText",
            borderRadius: "12px",
            px: 1,
            py: 0.25,
            fontSize: "0.7rem",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            pointerEvents: "auto",
            "&:hover": {
              bgcolor: focused
                ? t.palette.warning.dark
                : t.palette.success.dark,
            },
          })}
        >
          <CheckIcon sx={{ fontSize: "0.85rem" }} />
          {liveBearing}°
        </Box>

        {/* Line + handle: rotates as one unit around quay center */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: -LINE_WIDTH_PX / 2,
            width: LINE_WIDTH_PX,
            height: scaledLineLength,
            bgcolor: lineColor,
            opacity: 0.8,
            borderRadius: "1px 1px 0 0",
            transformOrigin: "50% 100%",
            transform: `rotate(${liveBearing}deg)`,
            pointerEvents: "none",
          }}
        >
          {/* Handle at the tip, counter-rotated to stay upright */}
          <Box
            onPointerDown={disabled ? undefined : handlePointerDown}
            sx={(t) => ({
              position: "absolute",
              top: -HANDLE_SIZE / 2,
              left: -(HANDLE_SIZE - LINE_WIDTH_PX) / 2,
              width: HANDLE_SIZE,
              height: HANDLE_SIZE,
              borderRadius: "50%",
              bgcolor: "background.paper",
              border: "2.5px solid",
              borderColor: lineColor,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: disabled ? "default" : "grab",
              pointerEvents: "auto",
              boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
              transform: `rotate(-${liveBearing}deg)`,
              transition: "border-color 0.15s",
              "&:active": { cursor: "grabbing" },
              "&:hover": disabled
                ? {}
                : {
                    borderColor: focused
                      ? t.palette.warning.dark
                      : t.palette.success.dark,
                  },
            })}
          >
            <NavigationIcon
              sx={{
                fontSize: "1rem",
                color: lineColor,
                transform: `rotate(${liveBearing}deg)`,
                transition: "transform 0.05s",
                mb: "-1px",
              }}
            />
            <Typography
              sx={{
                fontSize: "0.5rem",
                fontWeight: 700,
                lineHeight: 1,
                color: lineColor,
              }}
            >
              {liveBearing}°
            </Typography>
          </Box>
        </Box>
      </Box>
    </Marker>
  );
};
