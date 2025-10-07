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

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CheckIcon from "@mui/icons-material/Check";
import PaletteIcon from "@mui/icons-material/Palette";
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useThemeSwitcher } from "../hooks";

interface ThemeSwitcherProps {
  showLabel?: boolean;
  variant?: "icon" | "button";
}

/**
 * Theme switcher component that allows users to switch between different theme configs
 * and light/dark mode at runtime.
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  showLabel = false,
  variant = "icon",
}) => {
  const {
    currentThemeId,
    availableThemes,
    switchTheme,
    themeVariant,
    setThemeVariant,
  } = useThemeSwitcher();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = async (themeId: string) => {
    if (themeId === currentThemeId) {
      handleClose();
      return;
    }

    setLoading(true);
    try {
      await switchTheme(themeId);
    } catch (error) {
      console.error("Failed to switch theme:", error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleVariantToggle = () => {
    setThemeVariant(themeVariant === "light" ? "dark" : "light");
  };

  const currentTheme = availableThemes.find((t) => t.id === currentThemeId);

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        aria-label="switch theme"
        aria-controls={open ? "theme-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          <PaletteIcon />
        )}
      </IconButton>

      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "theme-button",
        }}
        PaperProps={{
          sx: {
            minWidth: 240,
            maxWidth: 320,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            THEME
          </Typography>
          {currentTheme && (
            <Typography variant="body2" fontWeight={500}>
              {currentTheme.name}
            </Typography>
          )}
        </Box>

        <Divider />

        {availableThemes.map((theme) => (
          <MenuItem
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            selected={theme.id === currentThemeId}
          >
            <ListItemIcon>
              {theme.id === currentThemeId && <CheckIcon fontSize="small" />}
            </ListItemIcon>
            <ListItemText
              primary={theme.name}
              secondary={theme.description}
              primaryTypographyProps={{
                variant: "body2",
                fontWeight: theme.id === currentThemeId ? 600 : 400,
              }}
              secondaryTypographyProps={{
                variant: "caption",
              }}
            />
          </MenuItem>
        ))}

        <Divider />

        <MenuItem onClick={handleVariantToggle}>
          <ListItemIcon>
            {themeVariant === "light" ? (
              <Brightness4Icon fontSize="small" />
            ) : (
              <Brightness7Icon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary={`Switch to ${themeVariant === "light" ? "Dark" : "Light"} Mode`}
            primaryTypographyProps={{
              variant: "body2",
            }}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ThemeSwitcher;
