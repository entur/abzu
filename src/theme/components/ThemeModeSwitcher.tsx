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

import { Brightness4, Brightness7 } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";
import { useTheme } from "../ThemeProvider";

interface ThemeModeSwitcherProps {
  showTooltip?: boolean;
  size?: "small" | "medium" | "large";
}

/**
 * Theme Mode Switcher Component
 *
 * Toggles between light and dark mode.
 *
 * @example
 * ```tsx
 * import { ThemeModeSwitcher } from '../theme/components/ThemeModeSwitcher';
 *
 * function Header() {
 *   return (
 *     <ThemeModeSwitcher showTooltip size="medium" />
 *   );
 * }
 * ```
 */
export const ThemeModeSwitcher: React.FC<ThemeModeSwitcherProps> = ({
  showTooltip = true,
  size = "medium",
}) => {
  const { themeVariant, setThemeVariant } = useTheme();

  const handleToggle = () => {
    setThemeVariant(themeVariant === "light" ? "dark" : "light");
  };

  const button = (
    <IconButton onClick={handleToggle} color="inherit" size={size}>
      {themeVariant === "light" ? <Brightness4 /> : <Brightness7 />}
    </IconButton>
  );

  if (showTooltip) {
    return (
      <Tooltip
        title={`Switch to ${themeVariant === "light" ? "dark" : "light"} mode`}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
};
