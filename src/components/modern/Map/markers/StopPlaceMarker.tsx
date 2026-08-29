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
import { useNavigate } from "react-router-dom";
import { StopPlaceActions } from "../../../../actions";
import AppRoutes from "../../../../routes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getSvgIconByTypeOrSubmode } from "../../../../utils/iconUtils";
import { getStopPermissions } from "../../../../utils/permissionsUtils";
import {
  ElementStatusMapBadge,
  useElementStatusEnabled,
  useStopPlaceDirtyKeys,
} from "../../Shared/ElementStatus";
import type { CrosshairSetting } from "../crosshair";
import { DragCrosshair, getCrosshairPreference } from "../crosshair";
import { useMarkerScale } from "../hooks/useMarkerScale";
import { StopPlacePopup } from "./StopPlacePopup";
import type { MapStopPlace } from "./types";

const MARKER_SIZE = 40;
const CHILD_MARKER_SIZE = 34;

/* The multimodal parent marker is drawn smaller than a regular stop place and stacked
 * above its children, so the "MM" label stays readable where the circles overlap. */
const PARENT_MARKER_SIZE = 32;
const PARENT_MARKER_Z_INDEX = 2;
const CHILD_MARKER_Z_INDEX = 1;

interface ParentChildMarkerProps {
  child: MapStopPlace;
}

const ParentChildMarker = ({ child }: ParentChildMarkerProps) => {
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
  const scale = useMarkerScale();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (!child.location) return null;

  const [lat, lng] = child.location as [number, number];
  const icon = getSvgIconByTypeOrSubmode(child.submode, child.stopPlaceType);

  const handleOpen = () => {
    setPopupAnchor(null);
    dispatch(StopPlaceActions.setStopPlaceLoading(true));
    navigate(`/${AppRoutes.STOP_PLACE}/${child.id}`);
  };

  return (
    <>
      <Marker
        latitude={lat}
        longitude={lng}
        anchor="bottom"
        style={{ zIndex: CHILD_MARKER_Z_INDEX }}
      >
        <Tooltip title={child.name || ""} placement="top" arrow>
          <Box
            onClick={(e) => setPopupAnchor(e.currentTarget)}
            sx={{
              width: Math.round(CHILD_MARKER_SIZE * scale),
              height: Math.round(CHILD_MARKER_SIZE * scale),
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
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
            <img
              src={icon}
              alt=""
              style={{
                width: Math.round(20 * scale),
                height: Math.round(20 * scale),
                filter: "brightness(0) invert(1)",
              }}
            />
          </Box>
        </Tooltip>
      </Marker>
      <StopPlacePopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        stopPlace={child}
        lat={lat}
        lng={lng}
        onOpen={handleOpen}
      />
    </>
  );
};

export const StopPlaceMarker = () => {
  const dispatch = useAppDispatch();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const crosshairRef = useRef<CrosshairSetting>("none");
  const scale = useMarkerScale();

  const current = useAppSelector(
    (state) =>
      ((state.stopPlace.current as MapStopPlace | null) ??
        (state.stopPlace as any).newStop) as MapStopPlace | null,
  );

  if (!current?.location) return null;

  const [lat, lng] = current.location;
  const isParent = !!current.isParent;
  const theme = useTheme();
  /* Quays and parking carry their own badges, so this one means the stop place's
   * own fields have unsaved edits — the same mark the panel and header use. */
  const isStatusEnabled = useElementStatusEnabled();
  const dirtyKeys = useStopPlaceDirtyKeys();
  const hasUnsavedFields = isStatusEnabled && dirtyKeys.size > 0;
  const markerSize = isParent ? PARENT_MARKER_SIZE : MARKER_SIZE;
  const multimodalColor =
    theme.palette.multimodal?.main ?? theme.palette.primary.main;
  const multimodalContrastText =
    theme.palette.multimodal?.contrastText ??
    theme.palette.primary.contrastText;
  const disabled =
    !!current.permanentlyTerminated || !getStopPermissions(current).canEdit;
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
    dispatch(
      StopPlaceActions.changeCurrentStopPosition([
        event.lngLat.lat,
        event.lngLat.lng,
      ]),
    );
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
        anchor={showCrosshair ? "center" : "bottom"}
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
                  width: Math.round(24 * scale),
                  height: Math.round(24 * scale),
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
      />

      {isParent &&
        ((current as any).children ?? []).map((child: MapStopPlace) => (
          <ParentChildMarker key={child.id} child={child} />
        ))}
    </>
  );
};
