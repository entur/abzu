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

import { Box, Tooltip } from "@mui/material";
import { useState } from "react";
import { Marker } from "react-map-gl/maplibre";
import { useNavigate } from "react-router-dom";
import { StopPlaceActions } from "../../../../actions";
import AppRoutes from "../../../../routes";
import { useAppDispatch } from "../../../../store/hooks";
import { getSvgIconByTypeOrSubmode } from "../../../../utils/iconUtils";
import { useConfirmLeave } from "../../Shared/UnsavedChangesGuard";
import { useMarkerScale } from "../hooks/useMarkerScale";
import { StopPlacePopup } from "./StopPlacePopup";
import type { MapStopPlace } from "./types";
import { resolveChildLocation } from "./utils/resolveChildLocation";

const CHILD_MARKER_SIZE = 34;
const CHILD_ICON_SIZE = 20;
const CHILD_MARKER_Z_INDEX = 1;

interface ParentChildMarkerProps {
  child: MapStopPlace;
}

export const ParentChildMarker = ({ child }: ParentChildMarkerProps) => {
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);
  const scale = useMarkerScale();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const confirmLeave = useConfirmLeave();

  const location = resolveChildLocation(child);
  if (!location) return null;

  const [lat, lng] = location;
  const icon = getSvgIconByTypeOrSubmode(child.submode, child.stopPlaceType);

  const handleOpen = () => {
    setPopupAnchor(null);
    // Ask before the loading state is set, so staying leaves nothing behind.
    confirmLeave(() => {
      dispatch(StopPlaceActions.setStopPlaceLoading(true));
      navigate(`/${AppRoutes.STOP_PLACE}/${child.id}`);
    });
  };

  return (
    <>
      {/* Centre-anchored: the marker is a circle, not a pin, so its middle is
          what sits on the coordinate. Every other marker type does the same,
          and the multimodal edges are drawn to the raw coordinate — anchoring
          anywhere else makes the line meet the marker off-centre. */}
      <Marker
        latitude={lat}
        longitude={lng}
        anchor="center"
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
                width: Math.round(CHILD_ICON_SIZE * scale),
                height: Math.round(CHILD_ICON_SIZE * scale),
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
