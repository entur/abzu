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
  Close as CloseIcon,
  Layers as LayersIcon,
  GridOn as MapIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Box, IconButton, Paper, Tooltip, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { toggleShowFareZonesInMap } from "../../../../reducers/zonesSlice";
import "../../modern.css";
import {
  mapControlPanelContainer,
  mapControlPanelContent,
  mapControlPanelHeader,
  mapControlPanelHeaderTitle,
} from "../../styles";
import { FareZonesPanel } from "../FareZonesPanel";
import { MapLayersPanel } from "./MapLayersPanel";
import { MapSettingsPanel } from "./MapSettingsPanel";

type PanelType = "layers" | "settings" | "zones" | null;

export const MapControls: React.FC = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch() as any;
  const [activePanel, setActivePanel] = useState<PanelType>(null);

  const handleTogglePanel = (panel: PanelType) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  };

  const handleClosePanel = () => {
    if (activePanel === "zones") {
      dispatch(toggleShowFareZonesInMap(false));
    }
    setActivePanel(null);
  };

  const panelWidth = 320;
  const rightOffset = activePanel ? panelWidth + 24 : 16;

  // The buttons now sit on a shared Paper, so they no longer carry their own
  // surface colour — only a hover tint and a filled active state.
  const mapControlButtonSx = {
    color: theme.palette.text.primary,
    transition: "background-color 0.2s, color 0.2s",
    "&:hover": {
      bgcolor: theme.palette.action.hover,
    },
  };

  const mapControlButtonActiveSx = {
    bgcolor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      bgcolor: theme.palette.primary.dark,
    },
  };

  const buttons = [
    {
      key: "layers",
      icon: <LayersIcon />,
      label: formatMessage({ id: "map_layers" }) || "Map Layers",
      onClick: () => handleTogglePanel("layers"),
    },
    {
      key: "settings",
      icon: <SettingsIcon />,
      label: formatMessage({ id: "map_settings" }) || "Map Settings",
      onClick: () => handleTogglePanel("settings"),
    },
    {
      key: "zones",
      icon: <MapIcon />,
      label: formatMessage({ id: "show_fare_zones_label" }) || "Fare Zones",
      onClick: () => {
        const opening = activePanel !== "zones";
        setActivePanel(opening ? "zones" : null);
        dispatch(toggleShowFareZonesInMap(opening));
      },
    },
  ];

  return (
    <>
      {/* Control buttons, grouped on one surface so they read as a single map
          widget instead of continuing the header's icon column. */}
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
        {buttons.map((button) => (
          <Tooltip key={button.key} title={button.label} placement="left">
            <IconButton
              onClick={button.onClick}
              aria-label={button.label}
              className="modern-map-control-button"
              sx={
                activePanel === button.key
                  ? mapControlButtonActiveSx
                  : mapControlButtonSx
              }
            >
              {button.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Paper>

      {/* Sliding Panels */}
      {activePanel && (
        <Paper
          elevation={8}
          sx={mapControlPanelContainer(theme)}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Panel Header */}
          <Box sx={mapControlPanelHeader(theme)}>
            <Box sx={mapControlPanelHeaderTitle}>
              {activePanel === "layers" &&
                (formatMessage({ id: "map_layers" }) || "Map Layers")}
              {activePanel === "settings" &&
                (formatMessage({ id: "map_settings" }) || "Map Settings")}
              {activePanel === "zones" &&
                (formatMessage({ id: "show_fare_zones_label" }) ||
                  "Fare Zones")}
            </Box>
            <IconButton size="small" onClick={handleClosePanel}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Panel Content */}
          <Box
            sx={mapControlPanelContent}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {activePanel === "layers" && <MapLayersPanel />}
            {activePanel === "settings" && <MapSettingsPanel />}
            {activePanel === "zones" && <FareZonesPanel />}
          </Box>
        </Paper>
      )}
    </>
  );
};
