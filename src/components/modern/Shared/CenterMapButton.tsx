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

import MyLocationIcon from "@mui/icons-material/MyLocation";
import { IconButton, Tooltip } from "@mui/material";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useIntl } from "react-intl";
import { useAppSelector } from "../../../store/hooks";

const FLY_TO_ZOOM = 17;
const FLY_TO_DURATION = 800;

interface Props {
  location: [number, number] | undefined;
  /** Replaces flying to `location`, e.g. fitting a whole group (S-5). */
  onLocate?: () => void;
  labelId?: string;
}

export const CenterMapButton = ({
  location,
  onLocate,
  labelId = "center_map_on_stop",
}: Props) => {
  const { formatMessage } = useIntl();
  const activeMap = useAppSelector(
    (state) => (state as any).mapUtils?.activeMap as MapLibreMap | undefined,
  );

  if (!location && !onLocate) return null;
  const label = formatMessage({ id: labelId });

  const handleClick = () => {
    if (onLocate) {
      onLocate();
      return;
    }
    if (!activeMap || !location) return;
    const [lat, lng] = location;
    activeMap.flyTo({
      center: [lng, lat],
      zoom: FLY_TO_ZOOM,
      duration: FLY_TO_DURATION,
    });
  };

  return (
    <Tooltip title={label} placement="bottom">
      <IconButton
        size="small"
        onClick={handleClick}
        aria-label={label}
        sx={{ color: "text.primary" }}
      >
        <MyLocationIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
