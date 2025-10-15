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

import { Check, MyLocationOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { UserActions } from "../../actions";
import { useAppDispatch } from "../../store/hooks";
import { DefaultMapSettingsDialog } from "../modern/Dialogs/DefaultMapSettingsDialog";

export const MapSettingsPanel: React.FC = () => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);

  // Redux selectors
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

  // Translations
  const showPathLinks = formatMessage({ id: "show_path_links" });
  const showCompassBearing = formatMessage({ id: "show_compass_bearing" });
  const showExpiredStopsLabel = formatMessage({ id: "show_expired_stops" });
  const showMultimodalEdgesLabel = formatMessage({
    id: "show_multimodal_edges",
  });
  const showPublicCodeLabel = formatMessage({ id: "show_public_code" });
  const showPrivateCodeLabel = formatMessage({ id: "show_private_code" });

  // Handlers
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

  const settingItemStyle = {
    py: 1,
    px: 1.5,
    borderRadius: 1,
    mb: 0.5,
    fontSize: "0.875rem",
    minHeight: 40,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  };

  const settingItems = [
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
  ];

  return (
    <>
      <MenuList sx={{ p: 0 }}>
        {/* Default Map Settings - at the top */}
        <MenuItem
          onClick={() => setShowSettingsDialog(true)}
          sx={settingItemStyle}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <MyLocationOutlined
              fontSize="small"
              sx={{ color: theme.palette.text.secondary }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              formatMessage({ id: "default_map_location" }) ||
              "Default map location"
            }
            slotProps={{
              primary: {
                sx: {
                  fontSize: "0.875rem",
                },
              },
            }}
          />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {/* Other settings items */}
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
                    fontSize: "0.875rem",
                  },
                },
              }}
            />
          </MenuItem>
        ))}
      </MenuList>

      <DefaultMapSettingsDialog
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
      />
    </>
  );
};
