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
import { useIntl } from "react-intl";
import { useAppSelector } from "../../../store/hooks";

const FLY_TO_ZOOM = 15;
const FLY_TO_DURATION = 800;

interface Props {
  location: [number, number] | undefined;
}

export const CenterMapButton = ({ location }: Props) => {
  const { formatMessage } = useIntl();
  const activeMap = useAppSelector(
    (state) => (state as any).mapUtils?.activeMap as maplibregl.Map | undefined,
  );

  if (!location) return null;

  const handleClick = () => {
    if (!activeMap) return;
    const [lat, lng] = location;
    activeMap.flyTo({
      center: [lng, lat],
      zoom: FLY_TO_ZOOM,
      duration: FLY_TO_DURATION,
    });
  };

  return (
    <Tooltip
      title={formatMessage({ id: "center_map_on_stop" })}
      placement="bottom"
    >
      <IconButton size="small" onClick={handleClick}>
        <MyLocationIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};
