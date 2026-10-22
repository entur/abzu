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

import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useRef, useState } from "react";
import type { MarkerDragEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { moveStopIfAllowed } from "../../../../actions/StopPlaceActions.modern";
import { useAppDispatch } from "../../../../store/hooks";
import { getSvgIconByTypeOrSubmode } from "../../../../utils/iconUtils";
import {
  ElementStatusMapBadge,
  useElementStatusEnabled,
  useStopPlaceDirtyKeys,
} from "../../Shared/ElementStatus";
import type { CrosshairSetting } from "../crosshair";
import { DragCrosshair, getCrosshairPreference } from "../crosshair";
import { useCanEditOnMap } from "../hooks/useCanEditOnMap";
import { useCheckedMove } from "../hooks/useCheckedMove";
import { useMapCurrentStop } from "../hooks/useMapCurrentStop";
import { useMarkerScale } from "../hooks/useMarkerScale";
import { MarkerCoordinatesDialog } from "./MarkerCoordinatesDialog";
import { ParentChildMarker } from "./ParentChildMarker";
import { StopPlacePopup } from "./StopPlacePopup";
import type { MapStopPlace } from "./types";

const MARKER_SIZE = 40;
const ICON_SIZE = 24;

/* The multimodal parent marker is drawn smaller than a regular stop place and stacked
 * above its children, so the "MM" label stays readable where the circles overlap. */
const PARENT_MARKER_SIZE = 32;
const PARENT_MARKER_Z_INDEX = 2;

export const StopPlaceMarker = () => {
  const dispatch = useAppDispatch();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
  const [isEditingCoordinates, setIsEditingCoordinates] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const crosshairRef = useRef<CrosshairSetting>("none");
  const scale = useMarkerScale();
  const theme = useTheme();
  /* Quays and parking carry their own badges, so this one means the stop place's
   * own fields have unsaved edits — the same mark the panel and header use.
   * Every hook stays above the `!current?.location` guard below: this component
   * renders with no stop selected, so a hook after the guard would change the
   * hook count between renders. */
  const isStatusEnabled = useElementStatusEnabled();
  const dirtyKeys = useStopPlaceDirtyKeys();

  const current = useMapCurrentStop(true);
  const canEditOnMap = useCanEditOnMap(current);
  const { pendingPosition, moveTo } = useCheckedMove((position) =>
    dispatch(moveStopIfAllowed(position)),
  );

  if (!current?.location) return null;

  const [lat, lng] = pendingPosition ?? current.location;
  const isParent = !!current.isParent;
  const hasUnsavedFields = isStatusEnabled && dirtyKeys.size > 0;
  const markerSize = isParent ? PARENT_MARKER_SIZE : MARKER_SIZE;
  const multimodalColor =
    theme.palette.multimodal?.main ?? theme.palette.primary.main;
  const multimodalContrastText =
    theme.palette.multimodal?.contrastText ??
    theme.palette.primary.contrastText;
  const disabled = !canEditOnMap;
  const icon = getSvgIconByTypeOrSubmode(
    current.submode,
    current.stopPlaceType,
  );

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
      <Marker
        latitude={lat}
        longitude={lng}
        draggable={!disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        anchor="center"
        style={{ zIndex: PARENT_MARKER_Z_INDEX }}
      >
        <Tooltip title={current.name || ""} placement="top" arrow>
          <Box
            onClick={(e) => {
              dispatch(StopPlaceActions.setElementFocus(-1, "quay"));
              setPopupAnchor(e.currentTarget);
            }}
            sx={{
              width: Math.round(markerSize * scale),
              height: Math.round(markerSize * scale),
              position: "relative",
              borderRadius: "50%",
              bgcolor: isParent ? multimodalColor : "primary.main",
              display: showCrosshair ? "none" : "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              border: "3px solid",
              borderColor: "background.paper",
              "&:hover": { transform: "scale(1.1)" },
              transition: "transform 0.15s",
            }}
          >
            {isParent ? (
              <Typography
                sx={{
                  color: multimodalContrastText,
                  fontWeight: 800,
                  fontSize: `${0.85 * scale}rem`,
                  lineHeight: 1,
                  letterSpacing: "0.05em",
                  userSelect: "none",
                }}
              >
                MM
              </Typography>
            ) : (
              <img
                src={icon}
                alt=""
                style={{
                  width: Math.round(ICON_SIZE * scale),
                  height: Math.round(ICON_SIZE * scale),
                  filter: "brightness(0) invert(1)",
                }}
              />
            )}
            <ElementStatusMapBadge visible={hasUnsavedFields} scale={scale} />
          </Box>
        </Tooltip>
        {showCrosshair && (
          <DragCrosshair
            type={crosshairRef.current as Exclude<CrosshairSetting, "none">}
          />
        )}
      </Marker>

      <StopPlacePopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        stopPlace={current}
        lat={lat}
        lng={lng}
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
        reference={{ position: current.location, kind: "previous" }}
      />

      {isParent &&
        ((current as any).children ?? []).map((child: MapStopPlace) => (
          <ParentChildMarker key={child.id} child={child} />
        ))}
    </>
  );
};
