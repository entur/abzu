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

import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { useIntl } from "react-intl";
import type { MarkerDragEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { MarkerPopup } from "./MarkerPopup";
import type {
  BoardingPosition,
  FocusedBoardingPosition,
  MapStopPlace,
} from "./types";

const BP_SIZE = 18;

interface BoardingPositionItemProps {
  boardingPosition: BoardingPosition;
  bpIndex: number;
  quayIndex: number;
  focused: boolean;
}

const BoardingPositionItem = ({
  boardingPosition,
  bpIndex,
  quayIndex,
  focused,
}: BoardingPositionItemProps) => {
  const dispatch = useAppDispatch();
  const { formatMessage } = useIntl();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  if (!boardingPosition.location) return null;

  const [lat, lng] = boardingPosition.location;
  const label = boardingPosition.publicCode ?? "";

  const handleDragEnd = (event: MarkerDragEvent) => {
    dispatch(
      StopPlaceActions.changeElementPosition(
        { markerIndex: bpIndex, type: "boarding-position", quayIndex },
        [event.lngLat.lat, event.lngLat.lng],
      ),
    );
  };

  return (
    <>
      <Marker
        latitude={lat}
        longitude={lng}
        draggable
        onDragEnd={handleDragEnd}
        anchor="center"
      >
        <Box
          onClick={(e) => setPopupAnchor(e.currentTarget)}
          sx={(theme) => ({
            width: BP_SIZE,
            height: BP_SIZE,
            borderRadius: "50%",
            bgcolor: focused ? "warning.main" : "secondary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px solid",
            borderColor: "background.paper",
            boxShadow: focused
              ? `0 0 0 2px ${alpha(theme.palette.warning.main, 0.5)}, 0 2px 4px rgba(0,0,0,0.4)`
              : "0 1px 3px rgba(0,0,0,0.35)",
            transition: "all 0.15s",
            "&:hover": { transform: "scale(1.15)" },
          })}
        >
          <Typography
            sx={{
              color: focused
                ? "warning.contrastText"
                : "secondary.contrastText",
              fontWeight: 700,
              fontSize: "0.5rem",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            {label}
          </Typography>
        </Box>
      </Marker>

      <MarkerPopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        title={`${formatMessage({ id: "boarding_positions_item_header" })} ${label}`}
        id={boardingPosition.id}
        lat={lat}
        lng={lng}
        minWidth={180}
      />
    </>
  );
};

export const BoardingPositionMarkers = () => {
  const current = useAppSelector(
    (state) => state.stopPlace.current as MapStopPlace | null,
  );
  const focusedBP = useAppSelector(
    (state) =>
      (state as any).mapUtils?.focusedBoardingPositionElement as
        | FocusedBoardingPosition
        | undefined,
  );

  if (!current?.quays?.length) return null;

  return (
    <>
      {current.quays.map((quay, quayIndex) =>
        (quay.boardingPositions ?? []).map((boardingPosition, bpIndex) => (
          <BoardingPositionItem
            key={boardingPosition.id || `${quayIndex}-${bpIndex}`}
            boardingPosition={boardingPosition}
            bpIndex={bpIndex}
            quayIndex={quayIndex}
            focused={
              focusedBP?.quayIndex === quayIndex && focusedBP?.index === bpIndex
            }
          />
        )),
      )}
    </>
  );
};
