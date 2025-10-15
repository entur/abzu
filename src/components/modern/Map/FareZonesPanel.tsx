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

import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  CircularProgress,
  Collapse,
  FormControlLabel,
  IconButton,
  ListItemText,
  MenuItem,
  MenuList,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { FareZone } from "../../../models/FareZone";
import {
  getFareZonesForFilterAction,
  setSelectedFareZones,
} from "../../../reducers/zonesSlice";
import { useAppDispatch } from "../../../store/hooks";

export const FareZonesPanel: React.FC = () => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [expandedCodespace, setExpandedCodespace] = useState<string | null>(
    null,
  );

  // Redux selectors
  const fareZonesForFilter = useSelector(
    (state: any) => state.zones.fareZonesForFilter as FareZone[],
  );
  const selectedFareZones = useSelector(
    (state: any) => state.zones.selectedFareZones as string[],
  );

  // Load fare zones on mount
  useEffect(() => {
    dispatch(getFareZonesForFilterAction());
  }, [dispatch]);

  // Group zones by codespace
  const groupedZones = useMemo(() => {
    return fareZonesForFilter.reduce(
      (acc: Record<string, FareZone[]>, zone: FareZone) => {
        const codespace = zone.id?.split(":")[0] || "default";
        if (!acc[codespace]) {
          acc[codespace] = [];
        }
        acc[codespace].push(zone);
        return acc;
      },
      {},
    );
  }, [fareZonesForFilter]);

  const sortedCodespaces = useMemo(() => {
    return Object.keys(groupedZones).sort();
  }, [groupedZones]);

  // Check if all zones in a codespace are selected
  const isCodespaceChecked = useCallback(
    (codespace: string): boolean => {
      return groupedZones[codespace].every((zone) =>
        selectedFareZones.includes(zone.id),
      );
    },
    [groupedZones, selectedFareZones],
  );

  // Check if some (but not all) zones in a codespace are selected
  const isCodespaceIndeterminate = useCallback(
    (codespace: string): boolean => {
      const zones = groupedZones[codespace];
      const selectedCount = zones.filter((zone) =>
        selectedFareZones.includes(zone.id),
      ).length;
      return selectedCount > 0 && selectedCount < zones.length;
    },
    [groupedZones, selectedFareZones],
  );

  // Toggle all zones in a codespace
  const handleToggleCodespace = useCallback(
    (codespace: string, checked: boolean) => {
      const codespaceZoneIds = groupedZones[codespace].map((zone) => zone.id);

      if (checked) {
        // Add all zones from this codespace
        const newSelection = [
          ...selectedFareZones.filter((id) => !codespaceZoneIds.includes(id)),
          ...codespaceZoneIds,
        ];
        dispatch(setSelectedFareZones(newSelection));
      } else {
        // Remove all zones from this codespace
        const newSelection = selectedFareZones.filter(
          (id) => !codespaceZoneIds.includes(id),
        );
        dispatch(setSelectedFareZones(newSelection));
      }
    },
    [groupedZones, selectedFareZones, dispatch],
  );

  // Toggle a single zone
  const handleToggleZone = useCallback(
    (zoneId: string, checked: boolean) => {
      if (checked) {
        dispatch(setSelectedFareZones([...selectedFareZones, zoneId]));
      } else {
        dispatch(
          setSelectedFareZones(selectedFareZones.filter((id) => id !== zoneId)),
        );
      }
    },
    [selectedFareZones, dispatch],
  );

  // Toggle codespace expansion
  const handleToggleExpansion = useCallback((codespace: string) => {
    setExpandedCodespace((prev) => (prev === codespace ? null : codespace));
  }, []);

  const settingItemStyle = {
    py: 0.5,
    px: 1.5,
    borderRadius: 1,
    mb: 0,
    fontSize: "0.875rem",
    minHeight: 36,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  };

  if (fareZonesForFilter.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 3,
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="body2" sx={{ ml: 2 }}>
          {formatMessage({ id: "loading" }) || "Loading..."}
        </Typography>
      </Box>
    );
  }

  return (
    <MenuList sx={{ p: 0 }}>
      {sortedCodespaces.map((codespace) => (
        <Box key={codespace}>
          <MenuItem
            sx={{
              ...settingItemStyle,
              display: "flex",
              justifyContent: "space-between",
              pr: 0.5,
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={isCodespaceChecked(codespace)}
                  indeterminate={isCodespaceIndeterminate(codespace)}
                  onChange={(e) =>
                    handleToggleCodespace(codespace, e.target.checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {codespace}
                </Typography>
              }
              sx={{ flex: 1, m: 0 }}
            />
            <IconButton
              size="small"
              onClick={() => handleToggleExpansion(codespace)}
              sx={{
                transform:
                  expandedCodespace === codespace
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            >
              <ExpandMore fontSize="small" />
            </IconButton>
          </MenuItem>

          <Collapse in={expandedCodespace === codespace} timeout={300}>
            <Box sx={{ pl: 4, pr: 1.5 }}>
              {groupedZones[codespace].map((zone) => (
                <FormControlLabel
                  key={zone.id}
                  control={
                    <Checkbox
                      size="small"
                      checked={selectedFareZones.includes(zone.id)}
                      onChange={(e) =>
                        handleToggleZone(zone.id, e.target.checked)
                      }
                    />
                  }
                  label={
                    <ListItemText
                      primary={`${zone.name.value} - ${zone.privateCode.value}`}
                      secondary={zone.id}
                      slotProps={{
                        primary: {
                          sx: { fontSize: "0.8rem" },
                        },
                        secondary: {
                          sx: { fontSize: "0.7rem" },
                        },
                      }}
                    />
                  }
                  sx={{
                    display: "flex",
                    mb: 0,
                    my: 0.25,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      borderRadius: 1,
                    },
                  }}
                />
              ))}
            </Box>
          </Collapse>
        </Box>
      ))}
    </MenuList>
  );
};
