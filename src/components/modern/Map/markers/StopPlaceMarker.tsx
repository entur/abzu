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

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Box, Divider, Link, Typography } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import type { MarkerDragEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getSvgIconByTypeOrSubmode } from "../../../../utils/iconUtils";
import { getStopPermissions } from "../../../../utils/permissionsUtils";
import { MarkerPopup } from "./MarkerPopup";
import type { MapStopPlace } from "./types";

const MARKER_SIZE = 28;

export const StopPlaceMarker = () => {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  const current = useAppSelector(
    (state) => state.stopPlace.current as MapStopPlace | null,
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
        <Box
          onClick={(e) => setPopupAnchor(e.currentTarget)}
          sx={{
            width: MARKER_SIZE,
            height: MARKER_SIZE,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
            border: "2px solid",
            borderColor: "background.paper",
            "&:hover": { transform: "scale(1.1)" },
            transition: "transform 0.15s",
          }}
        >
          {isParent ? (
            <Typography
              sx={{
                color: "primary.contrastText",
                fontWeight: 700,
                fontSize: "0.65rem",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              MM
            </Typography>
          ) : (
            <img
              src={icon}
              alt=""
              style={{ width: 18, height: 18, filter: "brightness(10)" }}
            />
          )}
        </Box>
      </Marker>

      <MarkerPopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        title={current.name || formatMessage({ id: "untitled" })}
        id={current.id}
        lat={lat}
        lng={lng}
        minWidth={220}
      >
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Link
            href={`https://www.openstreetmap.org/edit#map=18/${lat}/${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <OpenInNewIcon sx={{ fontSize: "0.85rem" }} />
            {formatMessage({ id: "edit_stop_in_osm" })}
          </Link>
          <Link
            href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <OpenInNewIcon sx={{ fontSize: "0.85rem" }} />
            {formatMessage({ id: "google_street_view" })}
          </Link>
        </Box>
      </MarkerPopup>
    </>
  );
};
