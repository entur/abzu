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
import { useRef, useState } from "react";
import { useIntl } from "react-intl";
import type { MarkerDragEvent } from "react-map-gl/maplibre";
import { Marker } from "react-map-gl/maplibre";
import { StopPlaceActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import type { CrosshairSetting } from "../crosshair";
import { DragCrosshair, getCrosshairPreference } from "../crosshair";
import { useMarkerScale } from "../hooks/useMarkerScale";
import { MarkerPopup } from "./MarkerPopup";
import type {
  BoardingPosition,
  FocusedBoardingPosition,
  MapStopPlace,
} from "./types";

const BP_SIZE = 26;

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
  const [isDragging, setIsDragging] = useState(false);
  const crosshairRef = useRef<CrosshairSetting>("none");
  const scale = useMarkerScale();

  if (!boardingPosition.location) return null;

  const [lat, lng] = boardingPosition.location;
  const label = boardingPosition.publicCode ?? "";

  const handleDragStart = () => {
    crosshairRef.current = getCrosshairPreference();
    setIsDragging(true);
  };

  const handleDragEnd = (event: MarkerDragEvent) => {
    setIsDragging(false);
    dispatch(
      StopPlaceActions.changeElementPosition(
        { markerIndex: bpIndex, type: "boarding-position", quayIndex },
        [event.lngLat.lat, event.lngLat.lng],
      ),
    );
  };

  const showCrosshair = isDragging && crosshairRef.current !== "none";

  return (
    <>
      <Marker
        latitude={lat}
        longitude={lng}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        anchor="center"
      >
        {showCrosshair ? (
          <DragCrosshair
            type={crosshairRef.current as Exclude<CrosshairSetting, "none">}
          />
        ) : (
          <Box
            onClick={(e) => setPopupAnchor(e.currentTarget)}
            sx={(theme) => ({
              width: Math.round(BP_SIZE * scale),
              height: Math.round(BP_SIZE * scale),
              borderRadius: "50%",
              bgcolor: focused ? "warning.main" : "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px solid",
              borderColor: focused ? "warning.main" : "secondary.main",
              boxShadow: focused
                ? `0 0 0 2px ${alpha(theme.palette.warning.main, 0.5)}, 0 2px 4px rgba(0,0,0,0.4)`
                : "0 1px 3px rgba(0,0,0,0.35)",
              transform: focused ? "scale(1.2)" : "none",
              transition: "all 0.15s",
              "&:hover": { transform: "scale(1.25)" },
            })}
          >
            <Typography
              sx={{
                color: focused ? "warning.contrastText" : "secondary.main",
                fontWeight: 800,
                fontSize: `${0.7 * scale}rem`,
                lineHeight: 1,
                letterSpacing: "0.01em",
                userSelect: "none",
              }}
            >
              {label}
            </Typography>
          </Box>
        )}
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
