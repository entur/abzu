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

import { Box, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import type { MarkerDragEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getSvgIconByTypeOrSubmode } from "../../../../utils/iconUtils";
import { getStopPermissions } from "../../../../utils/permissionsUtils";
import { StopPlacePopup } from "./StopPlacePopup";
import type { MapStopPlace } from "./types";

const MARKER_SIZE = 36;

export const StopPlaceMarker = () => {
  const dispatch = useAppDispatch();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  const current = useAppSelector(
    (state) =>
      ((state.stopPlace.current as MapStopPlace | null) ??
        (state.stopPlace as any).newStop) as MapStopPlace | null,
  );

  if (!current?.location) return null;

  const [lat, lng] = current.location;
  const isParent = !!current.isParent;
  const disabled =
    !!current.permanentlyTerminated || !getStopPermissions(current).canEdit;
  const icon = getSvgIconByTypeOrSubmode(
    current.submode,
    current.stopPlaceType,
  );

  const handleDragEnd = (event: MarkerDragEvent) => {
    dispatch(
      StopPlaceActions.changeCurrentStopPosition([
        event.lngLat.lat,
        event.lngLat.lng,
      ]),
    );
  };

  return (
    <>
      <Marker
        latitude={lat}
        longitude={lng}
        draggable={!disabled}
        onDragEnd={handleDragEnd}
        anchor="bottom"
      >
        <Tooltip title={current.name || ""} placement="top" arrow>
          <Box
            onClick={(e) => {
              dispatch(StopPlaceActions.setElementFocus(-1, "quay"));
              setPopupAnchor(e.currentTarget);
            }}
            sx={{
              width: MARKER_SIZE,
              height: MARKER_SIZE,
              borderRadius: "50%",
              bgcolor: "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              border: "3px solid",
              borderColor: "primary.main",
              "&:hover": { transform: "scale(1.1)" },
              transition: "transform 0.15s",
            }}
          >
            {isParent ? (
              <Typography
                sx={{
                  color: "text.primary",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  lineHeight: 1,
                  letterSpacing: "0.05em",
                  userSelect: "none",
                }}
              >
                MM
              </Typography>
            ) : (
              <img src={icon} alt="" style={{ width: 22, height: 22 }} />
            )}
          </Box>
        </Tooltip>
      </Marker>

      <StopPlacePopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        stopPlace={current}
        lat={lat}
        lng={lng}
      />
    </>
  );
};
