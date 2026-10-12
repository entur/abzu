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

import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Marker } from "react-map-gl/maplibre";
import { UserActions } from "../../../../actions";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getStopPermissions } from "../../../../utils/permissionsUtils";
import { getQuayTitle } from "../../Shared/quayLabels";
import { useMarkerScale } from "../hooks/useMarkerScale";
import { MarkerPopup } from "./MarkerPopup";

const NEIGHBOUR_QUAY_SIZE = 28;

interface NeighbourQuay {
  id: string;
  location?: [number, number];
  publicCode?: string | null;
  privateCode?: string | null;
}

interface NeighbourQuayMarkerProps {
  quay: NeighbourQuay;
  stopPlaceId: string;
  canMoveToCurrent: boolean;
}

/**
 * A quay of a neighbour stop, shown on request ("Vis quayer"). Outlined in the
 * quay colour, like neighbour stops are outlined in theirs, so it reads as
 * "not part of the stop being edited". Its only action moves it to the
 * open stop through the existing move-quay dialog (F-46).
 */
const NeighbourQuayMarker = ({
  quay,
  stopPlaceId,
  canMoveToCurrent,
}: NeighbourQuayMarkerProps) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const scale = useMarkerScale();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  if (!quay.location) return null;
  const [lat, lng] = quay.location;

  const handleMoveToCurrent = () => {
    setPopupAnchor(null);
    dispatch(
      UserActions.moveQuay({
        id: quay.id,
        publicCode: quay.publicCode,
        privateCode: quay.privateCode,
        stopPlaceId,
      }),
    );
  };

  return (
    <>
      <Marker longitude={lng} latitude={lat} anchor="center">
        <Box
          onClick={(event) => setPopupAnchor(event.currentTarget)}
          sx={{
            width: Math.round(NEIGHBOUR_QUAY_SIZE * scale),
            height: Math.round(NEIGHBOUR_QUAY_SIZE * scale),
            borderRadius: "50%",
            bgcolor: "background.paper",
            border: "3px solid",
            borderColor: "warning.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.35)",
            "&:hover": { transform: "scale(1.2)" },
          }}
        >
          <Typography
            sx={{
              color: "warning.main",
              fontWeight: 800,
              fontSize: `${0.7 * scale}rem`,
              userSelect: "none",
            }}
          >
            {quay.publicCode ?? ""}
          </Typography>
        </Box>
      </Marker>
      <MarkerPopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        title={getQuayTitle(quay, 0, formatMessage)}
        id={quay.id}
        lat={lat}
        lng={lng}
        minWidth={200}
      >
        {canMoveToCurrent && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<DriveFileMoveIcon />}
            onClick={handleMoveToCurrent}
            fullWidth
            sx={{ mt: 1 }}
          >
            {formatMessage({ id: "move_quay_to_current" })}
          </Button>
        )}
      </MarkerPopup>
    </>
  );
};

/** All neighbour quays the user chose to show, while a stop is being edited. */
export const NeighbourQuayMarkers = () => {
  const current = useAppSelector((state) => (state.stopPlace as any).current);
  const quaysByStop = useAppSelector(
    (state) =>
      ((state.stopPlace as any).neighbourStopQuays ?? {}) as Record<
        string,
        NeighbourQuay[] | null
      >,
  );

  if (!current?.id) return null;

  // Legacy rule: only into a saved, editable, non-multimodal stop.
  const canMoveToCurrent =
    !current.isNewStop &&
    !current.isParent &&
    !!getStopPermissions(current).canEdit;

  return (
    <>
      {Object.entries(quaysByStop).flatMap(([stopPlaceId, quays]) =>
        (quays ?? [])
          .filter((quay) => quay.id)
          .map((quay) => (
            <NeighbourQuayMarker
              key={quay.id}
              quay={quay}
              stopPlaceId={stopPlaceId}
              canMoveToCurrent={canMoveToCurrent}
            />
          )),
      )}
    </>
  );
};
