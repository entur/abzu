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

import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { useIntl } from "react-intl";
import type { MarkerDragEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getStopPermissions } from "../../../../utils/permissionsUtils";
import { MarkerPopup } from "./MarkerPopup";
import type { FocusedElement, MapParking, MapStopPlace } from "./types";

const PARKING_SIZE = 26;
const BIKE_PARKING_TYPE = "bikeParking";

interface ParkingMarkerItemProps {
  parking: MapParking;
  index: number;
  disabled: boolean;
  focused: boolean;
}

const ParkingMarkerItem = ({
  parking,
  index,
  disabled,
  focused,
}: ParkingMarkerItemProps) => {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  if (!parking.location) return null;

  const [lat, lng] = parking.location;
  const isBike = parking.parkingType === BIKE_PARKING_TYPE;
  const titleFallbackKey = isBike
    ? "parking_item_title_bikeParking"
    : "parking_item_title_parkAndRide";
  const title = parking.name || formatMessage({ id: titleFallbackKey });

  const handleDragEnd = (event: MarkerDragEvent) => {
    dispatch(
      StopPlaceActions.changeElementPosition(
        { markerIndex: index, type: "parking" },
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
          onClick={(e) => setPopupAnchor(e.currentTarget)}
          sx={(theme) => ({
            width: PARKING_SIZE,
            height: PARKING_SIZE,
            borderRadius: "50%",
            bgcolor: focused
              ? "warning.main"
              : isBike
                ? "info.main"
                : "tertiary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px solid",
            borderColor: "background.paper",
            boxShadow: focused
              ? `0 0 0 2px ${alpha(theme.palette.warning.main, 0.5)}, 0 2px 6px rgba(0,0,0,0.4)`
              : "0 2px 4px rgba(0,0,0,0.35)",
            transition: "all 0.15s",
            "&:hover": { transform: "scale(1.1)" },
          })}
        >
          {isBike ? (
            <DirectionsBikeIcon
              sx={{ fontSize: "0.9rem", color: "info.contrastText" }}
            />
          ) : (
            <LocalParkingIcon
              sx={{ fontSize: "0.9rem", color: "tertiary.contrastText" }}
            />
          )}
        </Box>
      </Marker>

      <MarkerPopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        title={title}
        id={parking.id}
        lat={lat}
        lng={lng}
      >
        {parking.totalCapacity != null && (
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mt: 0.5 }}
          >
            {formatMessage({ id: "total_capacity" })}: {parking.totalCapacity}
          </Typography>
        )}
      </MarkerPopup>
    </>
  );
};

export const ParkingMarkers = () => {
  const current = useAppSelector(
    (state) => state.stopPlace.current as MapStopPlace | null,
  );
  const focusedElement = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedElement as FocusedElement | undefined,
  );

  if (!current?.parking?.length) return null;

  const disabled =
    !!current.permanentlyTerminated || !getStopPermissions(current).canEdit;

  return (
    <>
      {current.parking.map((parking, index) => (
        <ParkingMarkerItem
          key={parking.id || index}
          parking={parking}
          index={index}
          disabled={disabled}
          focused={
            focusedElement?.type === "parking" &&
            focusedElement?.index === index
          }
        />
      ))}
    </>
  );
};
