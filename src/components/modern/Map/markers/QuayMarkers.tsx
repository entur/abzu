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
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import type { MarkerDragEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getStopPermissions } from "../../../../utils/permissionsUtils";
import { QuayPopup } from "./QuayPopup";
import type { FocusedElement, MapQuay, MapStopPlace } from "./types";

const QUAY_SIZE = 28;

interface QuayMarkerItemProps {
  quay: MapQuay;
  index: number;
  disabled: boolean;
  focused: boolean;
}

const QuayMarkerItem = ({
  quay,
  index,
  disabled,
  focused,
}: QuayMarkerItemProps) => {
  const dispatch = useAppDispatch();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  if (!quay.location) return null;

  const [lat, lng] = quay.location;
  const hasBearing = quay.compassBearing != null;
  const label = quay.publicCode || String(index + 1);

  const handleDragEnd = (event: MarkerDragEvent) => {
    dispatch(
      StopPlaceActions.changeElementPosition(
        { markerIndex: index, type: "quay" },
        [event.lngLat.lat, event.lngLat.lng],
      ),
    );
  };

  return (
    <>
      <Marker
        latitude={lat}
        longitude={lng}
        draggable={!disabled}
        onDragEnd={handleDragEnd}
        anchor="center"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {hasBearing && (
            <NavigationIcon
              sx={{
                fontSize: "0.9rem",
                color: focused ? "warning.main" : "text.disabled",
                transform: `rotate(${quay.compassBearing}deg)`,
                mb: "-4px",
              }}
            />
          )}
          <Box
            onClick={(e) => {
              dispatch(StopPlaceActions.setElementFocus(index, "quay"));
              setPopupAnchor(e.currentTarget);
            }}
            sx={(theme) => ({
              width: QUAY_SIZE,
              height: QUAY_SIZE,
              borderRadius: "50%",
              bgcolor: focused ? "warning.main" : "success.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px solid",
              borderColor: "background.paper",
              boxShadow: focused
                ? `0 0 0 2px ${alpha(theme.palette.warning.main, 0.5)}, 0 2px 6px rgba(0,0,0,0.4)`
                : "0 2px 4px rgba(0,0,0,0.35)",
              transform: focused ? "scale(1.2)" : "none",
              transition: "all 0.15s",
              "&:hover": { transform: "scale(1.25)" },
            })}
          >
            <Typography
              sx={{
                color: focused
                  ? "warning.contrastText"
                  : "success.contrastText",
                fontWeight: 800,
                fontSize: "0.7rem",
                lineHeight: 1,
                letterSpacing: "0.01em",
                userSelect: "none",
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </Marker>

      <QuayPopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        quay={quay}
        index={index}
        disabled={disabled}
        lat={lat}
        lng={lng}
      />
    </>
  );
};

export const QuayMarkers = () => {
  const current = useAppSelector(
    (state) => state.stopPlace.current as MapStopPlace | null,
  );
  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as FocusedElement | undefined,
  );

  if (!current?.quays?.length) return null;

  const disabled =
    !!current.permanentlyTerminated || !getStopPermissions(current).canEdit;

  return (
    <>
      {current.quays.map((quay, index) => (
        <QuayMarkerItem
          key={quay.id || index}
          quay={quay}
          index={index}
          disabled={disabled}
          focused={
            focusedElement?.type === "quay" && focusedElement?.index === index
          }
        />
      ))}
    </>
  );
};
