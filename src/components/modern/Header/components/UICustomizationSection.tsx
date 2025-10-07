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

import { Check, Palette } from "@mui/icons-material";
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
import { ThemeSwitcher } from "../../../../theme/components/ThemeSwitcher";

interface UICustomizationSectionProps {
  onClose: () => void;
  isMobile: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const UICustomizationSection: React.FC<UICustomizationSectionProps> = ({
  isMobile,
  isOpen = false,
  onToggle,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Redux selectors
  const uiMode = useSelector((state: any) => state.user.uiMode);

  // Translations
  const appearance = formatMessage({ id: "appearance" }) || "Appearance";
  const modernUILabel = "Modern UI";

  // Handlers
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

  const IconComponent = Palette;

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
            <IconComponent />
          </ListItemIcon>
          <ListItemText primary={appearance} />
        </ListItem>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <MenuList sx={{ pl: 2 }}>
            <MenuItem
              onClick={() => handleToggleUIMode(!uiMode || uiMode !== "modern")}
              sx={settingItemStyle}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {uiMode === "modern" ? (
                  <Check fontSize="small" color="primary" />
                ) : (
                  <Box sx={{ width: 20, height: 20 }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={modernUILabel}
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

            <MenuItem
              sx={{
                ...settingItemStyle,
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  mb: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Palette fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Theme"
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.8125rem",
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ width: "100%", pl: 4 }}>
                <ThemeSwitcher
                  variant="standard"
                  size="small"
                  fullWidth
                  label=""
                />
              </Box>
            </MenuItem>
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
          <IconComponent />
        </ListItemIcon>
        <ListItemText primary={appearance} />
      </MenuItem>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <MenuList sx={{ pl: 2 }}>
          <MenuItem
            onClick={() => handleToggleUIMode(!uiMode || uiMode !== "modern")}
            sx={settingItemStyle}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {uiMode === "modern" ? (
                <Check fontSize="small" color="primary" />
              ) : (
                <Box sx={{ width: 20, height: 20 }} />
              )}
            </ListItemIcon>
            <ListItemText primary={modernUILabel} />
          </MenuItem>

          <MenuItem
            sx={{
              ...settingItemStyle,
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                <Palette fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText primary="Theme" />
            </Box>
            <Box sx={{ width: "100%", pl: 4 }}>
              <ThemeSwitcher
                variant="standard"
                size="small"
                fullWidth
                label=""
              />
            </Box>
          </MenuItem>
        </MenuList>
      </Collapse>
    </Box>
  );
};
