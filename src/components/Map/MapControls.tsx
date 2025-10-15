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
import { Box, Fab, IconButton, Paper, Tooltip, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import { toggleShowFareZonesInMap } from "../../reducers/zonesSlice";
import { FareZonesPanel } from "../modern/Map/FareZonesPanel";
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
    setActivePanel(null);
    // Keep fare zones visible when closing panel (zones remain on map)
  };

  const panelWidth = 320;
  const buttonSize = 40;
  const buttonSpacing = 8;
  const rightOffset = activePanel ? panelWidth + 24 : 16;

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
        const newPanel = activePanel === "zones" ? null : "zones";
        setActivePanel(newPanel);
        // Enable fare zones when opening panel (keep zones visible when closing)
        if (newPanel === "zones") {
          dispatch(toggleShowFareZonesInMap(true));
        }
      },
    },
  ];

  return (
    <>
      {/* Control Buttons - stacked vertically */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: rightOffset,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: `${buttonSpacing}px`,
          transition: "right 0.3s ease-in-out",
        }}
      >
        {buttons.map((button) => (
          <Tooltip key={button.key} title={button.label} placement="left">
            <Fab
              size="medium"
              onClick={button.onClick}
              aria-label={button.label}
              color={activePanel === button.key ? "primary" : "default"}
              sx={{
                width: buttonSize,
                height: buttonSize,
                boxShadow: theme.shadows[6],
                "&:hover": {
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              {button.icon}
            </Fab>
          </Tooltip>
        ))}
      </Box>

      {/* Sliding Panels */}
      {activePanel && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            width: panelWidth,
            maxHeight: "calc(100vh - 200px)",
            zIndex: 999,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            animation: "slideIn 0.3s ease-in-out",
            "@keyframes slideIn": {
              from: {
                opacity: 0,
                transform: "translateX(20px)",
              },
              to: {
                opacity: 1,
                transform: "translateX(0)",
              },
            },
          }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Panel Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box sx={{ fontWeight: 600, fontSize: "1rem" }}>
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
            sx={{
              flex: 1,
              overflow: "auto",
              p: 0,
            }}
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
