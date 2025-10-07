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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { useTheme } from "../ThemeProvider";

interface ThemeSwitcherProps {
  variant?: "standard" | "outlined" | "filled";
  size?: "small" | "medium";
  fullWidth?: boolean;
  label?: string;
}

/**
 * Theme Switcher Component
 *
 * Allows users to switch between different theme configurations at runtime.
 *
 * @example
 * ```tsx
 * import { ThemeSwitcher } from '../theme/components/ThemeSwitcher';
 *
 * function SettingsMenu() {
 *   return (
 *     <ThemeSwitcher
 *       variant="outlined"
 *       size="small"
 *       label="Select Theme"
 *     />
 *   );
 * }
 * ```
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  variant = "outlined",
  size = "small",
  fullWidth = false,
  label = "Theme",
}) => {
  const { availableThemes, switchThemeConfig, themeConfig } = useTheme();

  // Extract theme names from paths for display
  const getThemeDisplayName = (themePath: string): string => {
    const fileName = themePath.split("/").pop()?.replace(".json", "") || "";

    // Convert kebab-case to Title Case
    return fileName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Find current theme path from config name
  const getCurrentThemePath = (): string => {
    if (!themeConfig) return "";

    // Try to match by theme name
    const matchingTheme = availableThemes.find((path) => {
      const displayName = getThemeDisplayName(path);
      return (
        displayName.toLowerCase() === themeConfig.name.toLowerCase() ||
        path.includes(themeConfig.name.toLowerCase().replace(/\s+/g, "-"))
      );
    });

    return matchingTheme || availableThemes[0] || "";
  };

  const handleChange = async (event: SelectChangeEvent<string>) => {
    const newThemePath = event.target.value;
    await switchThemeConfig(newThemePath);
  };

  if (availableThemes.length === 0) {
    return null;
  }

  return (
    <FormControl variant={variant} size={size} fullWidth={fullWidth}>
      <InputLabel id="theme-switcher-label">{label}</InputLabel>
      <Select
        labelId="theme-switcher-label"
        id="theme-switcher"
        value={getCurrentThemePath()}
        label={label}
        onChange={handleChange}
      >
        {availableThemes.map((themePath) => (
          <MenuItem key={themePath} value={themePath}>
            {getThemeDisplayName(themePath)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

/**
 * Compact Theme Switcher for use in menus or toolbars
 */
export const CompactThemeSwitcher: React.FC = () => {
  return (
    <ThemeSwitcher variant="standard" size="small" fullWidth label="Theme" />
  );
};
