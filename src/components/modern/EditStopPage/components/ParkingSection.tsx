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

import AddIcon from "@mui/icons-material/Add";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import {
  Box,
  Chip,
  Collapse,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Parking, ParkingSectionProps } from "../types";
import { ParkingItem } from "./ParkingItem";

/**
 * Section header + collapsible list of navigable parking rows.
 * Collapsed by default. The + button opens a type-selection menu.
 */
export const ParkingSection: React.FC<ParkingSectionProps> = ({
  parking,
  canEdit,
  onDeleteParking,
  onNavigateToParking,
  onAddParking,
}) => {
  const { formatMessage } = useIntl();
  const [expanded, setExpanded] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const handleAddClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuSelect = (type: string) => {
    setMenuAnchor(null);
    onAddParking(type);
  };

  return (
    <Box>
      <Divider />
      {/* Section header — click to toggle */}
      <Box
        onClick={() => setExpanded((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1.5,
          bgcolor: "background.default",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <LocalParkingIcon fontSize="small" color="action" />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
          {formatMessage({ id: "parking" })}
        </Typography>
        <Chip label={parking.length} size="small" />
        {expanded ? (
          <ExpandLessIcon fontSize="small" color="action" />
        ) : (
          <ExpandMoreIcon fontSize="small" color="action" />
        )}
        <Tooltip title={formatMessage({ id: "new_parking" })}>
          <span>
            <IconButton
              size="small"
              onClick={handleAddClick}
              disabled={!canEdit}
              color="primary"
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Parking type selection menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => handleMenuSelect("parkAndRide")}>
          <ListItemIcon>
            <LocalParkingIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {formatMessage({ id: "parking_item_title_parkAndRide" })}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleMenuSelect("bikeParking")}>
          <ListItemIcon>
            <DirectionsBikeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {formatMessage({ id: "parking_item_title_bikeParking" })}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Collapsible parking list */}
      <Collapse in={expanded}>
        <Divider />
        {parking.map((p: Parking, index: number) => (
          <ParkingItem
            key={p.id || `parking-${index}`}
            parking={p}
            index={index}
            canEdit={canEdit}
            onDelete={() => onDeleteParking(index)}
            onNavigate={() => onNavigateToParking(index)}
          />
        ))}
      </Collapse>
    </Box>
  );
};
