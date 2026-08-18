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
    (state: any) => state.stopPlace.enablePublicCodePrivateCodeOnStopPlaces,
  );

  // Translations
  const settings = formatMessage({ id: "settings" });
  const publicCodePrivateCodeSetting = formatMessage({
    id: "publicCode_privateCode_setting_label",
  });

  // Handlers
  const handleTogglePublicCodePrivateCodeOnStopPlaces = (value: boolean) => {
    dispatch(UserActions.toggleEnablePublicCodePrivateCodeOnStopPlaces(value));
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
