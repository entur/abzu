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

import NavigationIcon from "@mui/icons-material/Navigation";
import { Box, Tooltip } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";
import type { MarkerDragEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { moveElementIfAllowed } from "../../../../actions/StopPlaceActions.modern";
import { useAppDispatch } from "../../../../store/hooks";
import {
  ElementStatusMapBadge,
  useElementStatusEnabled,
} from "../../Shared/ElementStatus";
import { getQuayMarkerLabel } from "../../Shared/quayLabels";
import type { CrosshairSetting } from "../crosshair";
import { DragCrosshair, getCrosshairPreference } from "../crosshair";
import { useCheckedMove } from "../hooks/useCheckedMove";
import { useMarkerScale } from "../hooks/useMarkerScale";
import { MarkerCoordinatesDialog } from "./MarkerCoordinatesDialog";
import { QuayBearingIndicator } from "./QuayBearingIndicator";
import { QuayMarkerLabel } from "./QuayMarkerLabel";
import { QuayPopup } from "./QuayPopup";
import type { LatLng, MapQuay } from "./types";
import { fitQuayLabel } from "./utils/quayLabelFit";

const QUAY_SIZE = 32;
const LABEL_FONT_REM = 0.75;
/** Distance from quay dot edge to the center of the orbiting icon, in unscaled px. */
const QUAY_ORBIT_OFFSET = 4;
/** Shared with QuayItem's row transition and MarkerPopup's popup timeout, so focus-change feels like one motion. */
const FOCUS_TRANSITION_MS = 200;

interface QuayMarkerItemProps {
  quay: MapQuay;
  index: number;
  disabled: boolean;
  focused: boolean;
  showCompassBearing: boolean;
  showPublicCode: boolean;
  /** True when the quay is locally added or edited and not yet saved. */
  isPending: boolean;
  /** The stop's position, which typed coordinates are checked against. */
  stopLocation?: LatLng;
}

export const QuayMarkerItem = ({
  quay,
  index,
  disabled,
  focused,
  showCompassBearing,
  showPublicCode,
  isPending,
  stopLocation,
}: QuayMarkerItemProps) => {
  const dispatch = useAppDispatch();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
  const [isEditingBearing, setIsEditingBearing] = useState(false);
  const [isEditingCoordinates, setIsEditingCoordinates] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const crosshairRef = useRef<CrosshairSetting>("none");
  const scale = useMarkerScale();
  const isStatusEnabled = useElementStatusEnabled();
  const { pendingPosition, moveTo } = useCheckedMove((position) =>
    dispatch(
      moveElementIfAllowed({ markerIndex: index, type: "quay" }, position),
    ),
  );

  /* The bearing editor belongs to the quay you are looking at. `isEditingBearing`
   * is per-marker state and nothing else ever cleared it, so every quay whose
   * bearing had been touched kept its handle and line on the map. Ending it when
   * focus moves away means at most one editor is ever open. */
  useEffect(() => {
    if (!focused) setIsEditingBearing(false);
  }, [focused]);

  if (!quay.location) return null;

  const [lat, lng] = pendingPosition ?? quay.location;
  const hasBearing = quay.compassBearing != null;
  const label = getQuayMarkerLabel(
    quay,
    showPublicCode ? quay.publicCode : quay.privateCode,
    index,
  );

  const handleStartEditBearing = () => {
    setIsEditingBearing(true);
    setPopupAnchor(null);
  };

  const handleEndEditBearing = () => setIsEditingBearing(false);

  const handleDragStart = () => {
    crosshairRef.current = getCrosshairPreference();
    setIsDragging(true);
  };

  const handleDragEnd = (event: MarkerDragEvent) => {
    setIsDragging(false);
    moveTo([event.lngLat.lat, event.lngLat.lng]);
  };

  const showCrosshair = isDragging && crosshairRef.current !== "none";

  return (
    <>
      <QuayBearingIndicator
        quay={quay}
        index={index}
        focused={focused}
        disabled={disabled}
        isEditing={isEditingBearing}
        onEndEditing={handleEndEditBearing}
      />
      <Marker
        latitude={lat}
        longitude={lng}
        draggable={!disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        anchor="center"
      >
        {showCrosshair ? (
          <DragCrosshair
            type={crosshairRef.current as Exclude<CrosshairSetting, "none">}
          />
        ) : (
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            {showCompassBearing && hasBearing && !isEditingBearing && (
              <NavigationIcon
                sx={{
                  position: "absolute",
                  fontSize: `${scale}rem`,
                  color: "warning.main",
                  left: "50%",
                  top: "50%",
                  pointerEvents: "none",
                  transform: `translate(-50%, -50%) rotate(${quay.compassBearing}deg) translateY(-${Math.round((QUAY_SIZE / 2 + QUAY_ORBIT_OFFSET) * scale)}px)`,
                }}
              />
            )}
            <Tooltip
              title={fitQuayLabel(label).isTruncated ? label : ""}
              placement="top"
              arrow
            >
              <Box
                onClick={(e) => {
                  dispatch(StopPlaceActions.setElementFocus(index, "quay"));
                  setPopupAnchor(e.currentTarget);
                }}
                sx={(theme) => ({
                  // Containing block for ElementStatusMapBadge. Without it the badge
                  // would anchor to the outer box while `transform` is "none", and
                  // to this box once focus/hover applies a transform.
                  position: "relative",
                  width: Math.round(QUAY_SIZE * scale),
                  height: Math.round(QUAY_SIZE * scale),
                  borderRadius: "50%",
                  bgcolor: "warning.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "3px solid",
                  borderColor: "warning.contrastText",
                  boxShadow: focused
                    ? `0 0 0 2px ${alpha(theme.palette.warning.main, 0.5)}, 0 2px 6px rgba(0,0,0,0.4)`
                    : "0 2px 4px rgba(0,0,0,0.35)",
                  transform: focused ? "scale(1.2)" : "none",
                  transition: `all ${FOCUS_TRANSITION_MS}ms`,
                  "&:hover": { transform: "scale(1.25)" },
                })}
              >
                <QuayMarkerLabel
                  label={label}
                  baseFontRem={LABEL_FONT_REM}
                  scale={scale}
                  color="warning.contrastText"
                />
                <ElementStatusMapBadge
                  visible={isStatusEnabled && isPending}
                  scale={scale}
                />
              </Box>
            </Tooltip>
          </Box>
        )}
      </Marker>

      {/* Dismissing the popup (e.g. clicking elsewhere on the map) only hides the
          popup bubble — it must not clear quay focus, since a click "elsewhere"
          is often the user placing a new element for this quay (e.g. a boarding
          position) via AddElementFab, which needs focus to stay put. */}
      <QuayPopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        quay={quay}
        index={index}
        disabled={disabled}
        lat={lat}
        lng={lng}
        isEditingBearing={isEditingBearing}
        onStartEditBearing={handleStartEditBearing}
        onEndEditBearing={handleEndEditBearing}
        onEditCoordinates={
          disabled
            ? undefined
            : () => {
                setPopupAnchor(null);
                setIsEditingCoordinates(true);
              }
        }
      />
      <MarkerCoordinatesDialog
        open={isEditingCoordinates}
        lat={lat}
        lng={lng}
        onClose={() => setIsEditingCoordinates(false)}
        onSubmit={moveTo}
        reference={
          stopLocation ? { position: stopLocation, kind: "stop" } : undefined
        }
      />
    </>
  );
};
