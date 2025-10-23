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

import React from "react";

interface ThemeModeSwitcherProps {
  showTooltip?: boolean;
  size?: "small" | "medium" | "large";
}

/**
 * Theme Mode Switcher Component
 *
 * NOTE: Dark/light mode toggle has been removed in the refactored theme system.
 * This component is kept for backward compatibility but does nothing.
 * Themes are now fully defined in JSON config files.
 */
export const ThemeModeSwitcher: React.FC<ThemeModeSwitcherProps> = () => {
  // No-op component - variant system has been removed
  return null;
};
