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

import { Box, Button, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { useIntl } from "react-intl";
import { Marker } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import { StopPlaceActions } from "../../../../actions";
import AppRoutes from "../../../../routes";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { getSvgIconByTypeOrSubmode } from "../../../../utils/iconUtils";
import { MarkerPopup } from "./MarkerPopup";
import type { NeighbourStop } from "./types";

const NEIGHBOUR_SIZE = 20;

interface NeighbourMarkerItemProps {
  stop: NeighbourStop;
}

const NeighbourMarkerItem = ({ stop }: NeighbourMarkerItemProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  if (!stop.location) return null;

  const [lat, lng] = stop.location;
  const icon = getSvgIconByTypeOrSubmode(stop.submode, stop.stopPlaceType);

  const handleOpen = () => {
    setPopupAnchor(null);
    dispatch(StopPlaceActions.setStopPlaceLoading(true));
    navigate(`/${AppRoutes.STOP_PLACE}/${stop.id}`);
  };

  return (
    <>
      <Marker latitude={lat} longitude={lng} anchor="center">
        <Box
          onClick={(e) => setPopupAnchor(e.currentTarget)}
          sx={(theme) => ({
            width: NEIGHBOUR_SIZE,
            height: NEIGHBOUR_SIZE,
            borderRadius: "50%",
            bgcolor: alpha(theme.palette.primary.main, 0.6),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1.5px solid",
            borderColor: "background.paper",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            transition: "transform 0.15s",
            "&:hover": { transform: "scale(1.15)" },
          })}
        >
          {stop.isParent ? (
            <Typography
              sx={{
                color: "primary.contrastText",
                fontWeight: 700,
                fontSize: "0.5rem",
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
              style={{ width: 12, height: 12, filter: "brightness(10)" }}
            />
          )}
        </Box>
      </Marker>

      <MarkerPopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        title={stop.name || stop.id}
        id={stop.name ? stop.id : undefined}
        lat={lat}
        lng={lng}
        minWidth={180}
      >
        <Box sx={{ mt: 1 }}>
          <Button
            size="small"
            variant="contained"
            fullWidth
            onClick={handleOpen}
          >
            {formatMessage({ id: "open" })}
          </Button>
        </Box>
      </MarkerPopup>
    </>
  );
};

export const NeighbourMarkers = () => {
  const neighbourStops = useAppSelector(
    (state) => (state.stopPlace as any).neighbourStops as NeighbourStop[],
  );

  if (!neighbourStops?.length) return null;

  return (
    <>
      {neighbourStops.map((stop) => (
        <NeighbourMarkerItem key={stop.id} stop={stop} />
      ))}
    </>
  );
};
