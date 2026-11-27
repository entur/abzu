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

import { Close as CloseIcon } from "@mui/icons-material";
import { Box, IconButton, Paper, useTheme } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import {
  mapControlPanelContainer,
  mapControlPanelContent,
  mapControlPanelHeader,
  mapControlPanelHeaderTitle,
} from "../../styles";
import { FareZonesPanel } from "../FareZonesPanel";
import type { MapPanel } from "./hooks/useMapControlPanels";
import { MapLayersPanel } from "./MapLayersPanel";
import { MapSettingsPanel } from "./MapSettingsPanel";
import { FAB_SIZE, FAB_TOP } from "./utils/addElementFabSx";
import { FAB_GAP } from "./utils/fabPosition";

/**
 * On a phone the panel opens left of the control column and below the
 * map's +, so neither covers the other (S-13).
 */
const NARROW_PANEL_RIGHT = 72;
const NARROW_PANEL_LEFT = 16;
const NARROW_PANEL_TOP = FAB_TOP + FAB_SIZE + FAB_GAP;

const TITLE_ID_BY_PANEL: Record<MapPanel, string> = {
  layers: "map_layers",
  settings: "map_settings",
  zones: "show_fare_zones_label",
};

/** Map gestures must not start on the panel. */
const stopMapGesture = (event: React.SyntheticEvent) => event.stopPropagation();
const gestureGuards = {
  onTouchStart: stopMapGesture,
  onTouchMove: stopMapGesture,
  onTouchEnd: stopMapGesture,
  onMouseDown: stopMapGesture,
  onWheel: stopMapGesture,
};

interface MapControlPanelProps {
  panel: MapPanel;
  isNarrow: boolean;
  onClose: () => void;
}

/** The sliding panel next to the map controls: layers, settings or zones. */
export const MapControlPanel = ({
  panel,
  isNarrow,
  onClose,
}: MapControlPanelProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const narrowSx = isNarrow
    ? {
        top: NARROW_PANEL_TOP,
        right: NARROW_PANEL_RIGHT,
        left: NARROW_PANEL_LEFT,
        width: "auto",
      }
    : {};

  return (
    <Paper
      elevation={8}
      sx={{ ...mapControlPanelContainer(theme), ...narrowSx }}
      {...gestureGuards}
    >
      <Box sx={mapControlPanelHeader(theme)}>
        <Box sx={mapControlPanelHeaderTitle}>
          {formatMessage({ id: TITLE_ID_BY_PANEL[panel] })}
        </Box>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label={formatMessage({ id: "close" })}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={mapControlPanelContent} {...gestureGuards}>
        {panel === "layers" && <MapLayersPanel />}
        {panel === "settings" && <MapSettingsPanel />}
        {panel === "zones" && <FareZonesPanel />}
      </Box>
    </Paper>
  );
};
