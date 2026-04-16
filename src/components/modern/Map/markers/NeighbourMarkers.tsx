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
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import { useAppSelector } from "../../../../store/hooks";
import { getSvgIconByTypeOrSubmode } from "../../../../utils/iconUtils";
import { NeighbourStopPopup } from "./NeighbourStopPopup";
import type { NeighbourStop } from "./types";

const NEIGHBOUR_SIZE = 28;

interface NeighbourMarkerItemProps {
  stop: NeighbourStop;
}

const NeighbourMarkerItem = ({ stop }: NeighbourMarkerItemProps) => {
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  if (!stop.location) return null;

  const [lat, lng] = stop.location;
  const icon = getSvgIconByTypeOrSubmode(stop.submode, stop.stopPlaceType);

  return (
    <>
      <Marker latitude={lat} longitude={lng} anchor="center">
        <Tooltip title={stop.name || stop.id} placement="top" arrow>
          <Box
            onClick={(e) => setPopupAnchor(e.currentTarget)}
            sx={(theme) => ({
              width: NEIGHBOUR_SIZE,
              height: NEIGHBOUR_SIZE,
              borderRadius: "50%",
              bgcolor: "background.paper",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px solid",
              borderColor: alpha(theme.palette.primary.main, 0.6),
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              transition: "transform 0.15s",
              "&:hover": { transform: "scale(1.15)" },
            })}
          >
            {stop.isParent ? (
              <Typography
                sx={{
                  color: "text.disabled",
                  fontWeight: 800,
                  fontSize: "0.6rem",
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
                style={{ width: 16, height: 16, opacity: 0.6 }}
              />
            )}
          </Box>
        </Tooltip>
      </Marker>

      <NeighbourStopPopup
        anchorEl={popupAnchor}
        onClose={() => setPopupAnchor(null)}
        stop={stop}
        lat={lat}
        lng={lng}
      />
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
