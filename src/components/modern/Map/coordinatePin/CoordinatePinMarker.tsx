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

import PlaceIcon from "@mui/icons-material/Place";
import { Box } from "@mui/material";
import { useEffect, useSyncExternalStore } from "react";
import { useIntl } from "react-intl";
import { Marker, useMap } from "react-map-gl/maplibre";
import {
  clearCoordinatePin,
  getCoordinatePin,
  subscribeToCoordinatePin,
} from "./coordinatePinStore";

const PIN_SIZE = 40;
/** Above stop markers (multimodal parents use 2); it lets clicks through. */
const PIN_Z_INDEX = 3;

/**
 * Marks the point "Go to coordinates" flew to (F-94), so the exact spot is
 * clear. Removed by the next click on the map or a new search.
 */
export const CoordinatePinMarker = () => {
  const { formatMessage } = useIntl();
  const { current: mapRef } = useMap();
  const pin = useSyncExternalStore(subscribeToCoordinatePin, getCoordinatePin);

  useEffect(() => {
    const map = mapRef?.getMap();
    if (!pin || !map) return;
    map.on("click", clearCoordinatePin);
    return () => {
      map.off("click", clearCoordinatePin);
    };
  }, [pin, mapRef]);

  if (!pin) return null;
  const [lat, lng] = pin;

  return (
    <Marker
      latitude={lat}
      longitude={lng}
      anchor="bottom"
      style={{ zIndex: PIN_Z_INDEX, pointerEvents: "none" }}
    >
      <Box
        role="img"
        aria-label={`${formatMessage({ id: "go_to_coordinates" })}: ${lat}, ${lng}`}
        sx={{ color: "info.main", lineHeight: 0, pointerEvents: "none" }}
      >
        <PlaceIcon sx={{ fontSize: PIN_SIZE }} />
      </Box>
    </Marker>
  );
};
