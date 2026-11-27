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

import { Add as ZoomInIcon, Remove as ZoomOutIcon } from "@mui/icons-material";
import { IconButton, SxProps, Theme, Tooltip } from "@mui/material";
import { useIntl } from "react-intl";
import { useMapZoom } from "./hooks/useMapZoom";

interface ZoomButtonsProps {
  /** The control group's button style, so zoom looks like the other controls. */
  buttonSx: SxProps<Theme>;
}

/** Zoom in / out for the map's control group (F-01). */
export const ZoomButtons: React.FC<ZoomButtonsProps> = ({ buttonSx }) => {
  const { formatMessage } = useIntl();
  const { zoomIn, zoomOut, canZoomIn, canZoomOut } = useMapZoom();

  const buttons = [
    {
      key: "zoom_in",
      icon: <ZoomInIcon />,
      onClick: zoomIn,
      disabled: !canZoomIn,
    },
    {
      key: "zoom_out",
      icon: <ZoomOutIcon />,
      onClick: zoomOut,
      disabled: !canZoomOut,
    },
  ];

  return (
    <>
      {buttons.map(({ key, icon, onClick, disabled }) => {
        const label = formatMessage({ id: key });
        return (
          <Tooltip key={key} title={label} placement="left">
            {/* The span keeps the tooltip working on a disabled button. */}
            <span>
              <IconButton
                onClick={onClick}
                disabled={disabled}
                aria-label={label}
                className="modern-map-control-button"
                sx={buttonSx}
              >
                {icon}
              </IconButton>
            </span>
          </Tooltip>
        );
      })}
    </>
  );
};
