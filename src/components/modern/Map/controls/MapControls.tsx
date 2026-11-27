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

import {
  Layers as LayersIcon,
  GridOn as MapIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import {
  Divider,
  IconButton,
  Paper,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import "../../modern.css";
import { MapPanel, useMapControlPanels } from "./hooks/useMapControlPanels";
import { MapControlPanel } from "./MapControlPanel";
import { ZoomButtons } from "./ZoomButtons";

const PANEL_WIDTH = 320;
const PANEL_GAP = 24;
const EDGE_OFFSET = 16;

const PANEL_BUTTONS: {
  panel: MapPanel;
  icon: React.ReactNode;
  labelId: string;
}[] = [
  { panel: "layers", icon: <LayersIcon />, labelId: "map_layers" },
  { panel: "settings", icon: <SettingsIcon />, labelId: "map_settings" },
  { panel: "zones", icon: <MapIcon />, labelId: "show_fare_zones_label" },
];

/**
 * The map's control column (layers, settings, fare zones, zoom) and its
 * sliding panel. On wider screens the column moves left of an open panel;
 * on a phone it stays at the edge and the panel opens beside it, so it
 * never covers the map's + (S-13).
 */
export const MapControls: React.FC = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const isNarrow = useMediaQuery(theme.breakpoints.down("sm"));
  const { activePanel, togglePanel, closePanel } = useMapControlPanels();

  const rightOffset =
    activePanel && !isNarrow ? PANEL_WIDTH + PANEL_GAP : EDGE_OFFSET;

  // The buttons sit on a shared Paper, so they carry no surface colour of
  // their own — only a hover tint and a filled active state.
  const mapControlButtonSx = {
    color: theme.palette.text.primary,
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": { bgcolor: theme.palette.action.hover },
  };
  const mapControlButtonActiveSx = {
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": { bgcolor: theme.palette.primary.dark },
  };

  return (
    <>
      {/* One surface, so the buttons read as a single map widget. */}
      <Paper
        elevation={3}
        className="modern-map-controls-buttons"
        sx={{
          right: rightOffset,
          p: 0.5,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {PANEL_BUTTONS.map(({ panel, icon, labelId }) => {
          const label = formatMessage({ id: labelId });
          return (
            <Tooltip key={panel} title={label} placement="left">
              <IconButton
                onClick={() => togglePanel(panel)}
                aria-label={label}
                aria-pressed={activePanel === panel}
                className="modern-map-control-button"
                sx={
                  activePanel === panel
                    ? mapControlButtonActiveSx
                    : mapControlButtonSx
                }
              >
                {icon}
              </IconButton>
            </Tooltip>
          );
        })}
        <Divider />
        <ZoomButtons buttonSx={mapControlButtonSx} />
      </Paper>

      {activePanel && (
        <MapControlPanel
          panel={activePanel}
          isNarrow={isNarrow}
          onClose={closePanel}
        />
      )}
    </>
  );
};
