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

import { Check, Settings } from "@mui/icons-material";
import {
  Box,
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { UserActions } from "../../../../actions";
import {
  toggleShowFareZonesInMap,
  toggleShowTariffZonesInMap,
} from "../../../../reducers/zonesSlice";
import { useAppDispatch } from "../../../../store/hooks";

interface SettingsMenuSectionProps {
  onClose: () => void;
  isMobile: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const SettingsMenuSection: React.FC<SettingsMenuSectionProps> = ({
  isMobile,
  isOpen = false,
  onToggle,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Redux selectors
  const isPublicCodePrivateCodeOnStopPlacesEnabled = useSelector(
    (state: any) => state.stopPlace.isPublicCodePrivateCodeOnStopPlacesEnabled,
  );
  const isMultiPolylinesEnabled = useSelector(
    (state: any) => state.stopPlace.enablePolylines,
  );
  const isCompassBearingEnabled = useSelector(
    (state: any) => state.stopPlace.isCompassBearingEnabled,
  );
  const showExpiredStops = useSelector(
    (state: any) => state.stopPlace.showExpiredStops,
  );
  const showMultimodalEdges = useSelector(
    (state: any) => state.stopPlace.showMultimodalEdges,
  );
  const showPublicCode = useSelector((state: any) => state.user.showPublicCode);
  const showFareZones = useSelector((state: any) => state.zones.showFareZones);
  const showTariffZones = useSelector(
    (state: any) => state.zones.showTariffZones,
  );
  const uiMode = useSelector((state: any) => state.user.uiMode);

  // Translations
  const settings = formatMessage({ id: "settings" });
  const publicCodePrivateCodeSetting = formatMessage({
    id: "publicCode_privateCode_setting_label",
  });
  const showPathLinks = formatMessage({ id: "show_path_links" });
  const showCompassBearing = formatMessage({ id: "show_compass_bearing" });
  const showExpiredStopsLabel = formatMessage({ id: "show_expired_stops" });
  const showMultimodalEdgesLabel = formatMessage({
    id: "show_multimodal_edges",
  });
  const showPublicCodeLabel = formatMessage({ id: "show_public_code" });
  const showPrivateCodeLabel = formatMessage({ id: "show_private_code" });
  const showFareZonesLabel = formatMessage({ id: "show_fare_zones_label" });
  const showTariffZonesLabel = formatMessage({
    id: "show_tariff_zones_label",
  });
  const uiModeLabel = "Modern UI";

  // Handlers
  const handleTogglePublicCodePrivateCodeOnStopPlaces = (value: boolean) => {
    dispatch(UserActions.toggleEnablePublicCodePrivateCodeOnStopPlaces(value));
  };

  const handleToggleMultiPolylines = (value: boolean) => {
    dispatch(UserActions.togglePathLinksEnabled(value));
  };

  const handleToggleCompassBearing = (value: boolean) => {
    dispatch(UserActions.toggleCompassBearingEnabled(value));
  };

  const handleToggleShowExpiredStops = (value: boolean) => {
    dispatch(UserActions.toggleExpiredShowExpiredStops(value));
  };

  const handleToggleMultimodalEdges = (value: boolean) => {
    dispatch(UserActions.toggleMultimodalEdges(value));
  };

  const handleToggleShowPublicCode = (value: boolean) => {
    dispatch(UserActions.toggleShowPublicCode(value));
  };

  const handleToggleShowFareZones = (value: boolean) => {
    dispatch(toggleShowTariffZonesInMap(false));
    dispatch(toggleShowFareZonesInMap(value));
  };

  const handleToggleShowTariffZones = (value: boolean) => {
    dispatch(toggleShowFareZonesInMap(false));
    dispatch(toggleShowTariffZonesInMap(value));
  };

  const handleToggleUIMode = (value: boolean) => {
    const newMode = value ? "modern" : "legacy";
    dispatch(UserActions.changeUIMode(newMode));
  };

  const handleClick = () => {
    onToggle?.();
  };

  const settingItemStyle = {
    py: 0.5,
    px: 2,
    borderRadius: 1,
    mx: 1,
    mb: 0.5,
    fontSize: "0.875rem",
    minHeight: 40,
    display: "flex",
    alignItems: "center",
    whiteSpace: "normal",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  };

  const settingItems = [
    {
      key: "publicCodePrivateCode",
      label: publicCodePrivateCodeSetting,
      checked: isPublicCodePrivateCodeOnStopPlacesEnabled,
      onChange: handleTogglePublicCodePrivateCodeOnStopPlaces,
    },
    {
      key: "pathLinks",
      label: showPathLinks,
      checked: isMultiPolylinesEnabled,
      onChange: handleToggleMultiPolylines,
    },
    {
      key: "compassBearing",
      label: showCompassBearing,
      checked: isCompassBearingEnabled,
      onChange: handleToggleCompassBearing,
    },
    {
      key: "expiredStops",
      label: showExpiredStopsLabel,
      checked: showExpiredStops,
      onChange: handleToggleShowExpiredStops,
    },
    {
      key: "multimodalEdges",
      label: showMultimodalEdgesLabel,
      checked: showMultimodalEdges,
      onChange: handleToggleMultimodalEdges,
    },
    {
      key: "publicCode",
      label: showPublicCode ? showPublicCodeLabel : showPrivateCodeLabel,
      checked: showPublicCode,
      onChange: handleToggleShowPublicCode,
    },
    {
      key: "fareZones",
      label: showFareZonesLabel,
      checked: showFareZones,
      onChange: handleToggleShowFareZones,
    },
    {
      key: "tariffZones",
      label: showTariffZonesLabel,
      checked: showTariffZones,
      onChange: handleToggleShowTariffZones,
    },
    {
      key: "uiMode",
      label: uiModeLabel,
      checked: uiMode === "modern",
      onChange: handleToggleUIMode,
    },
  ];

  if (isMobile) {
    return (
      <Box>
        <ListItem
          onClick={handleClick}
          sx={{
            py: 1,
            px: 2,
            borderRadius: 1,
            mx: 1,
            mb: 0.5,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 36,
              color: theme.palette.primary.main,
            }}
          >
            <Settings />
          </ListItemIcon>
          <ListItemText primary={settings} />
        </ListItem>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <MenuList sx={{ pl: 2 }}>
            {settingItems.map((item) => (
              <MenuItem
                key={item.key}
                onClick={() => item.onChange(!item.checked)}
                sx={settingItemStyle}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {item.checked ? (
                    <Check fontSize="small" color="primary" />
                  ) : (
                    <Box sx={{ width: 20, height: 20 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.8125rem",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflow: "hidden",
                      },
                    },
                  }}
                />
              </MenuItem>
            ))}
          </MenuList>
        </Collapse>
      </Box>
    );
  }

  return (
    <Box>
      <MenuItem
        onClick={handleClick}
        sx={{
          py: 1,
          px: 2,
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: theme.palette.primary.main,
          }}
        >
          <Settings />
        </ListItemIcon>
        <ListItemText primary={settings} />
      </MenuItem>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <MenuList sx={{ pl: 2 }}>
          {settingItems.map((item) => (
            <MenuItem
              key={item.key}
              onClick={() => item.onChange(!item.checked)}
              sx={settingItemStyle}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {item.checked ? (
                  <Check fontSize="small" color="primary" />
                ) : (
                  <Box sx={{ width: 20, height: 20 }} />
                )}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          ))}
        </MenuList>
      </Collapse>
    </Box>
  );
};
