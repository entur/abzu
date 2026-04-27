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

/**
 * Represents a single action button in the minimized bar.
 * group="info"   → informational/navigational icon (default)
 * group="action" → destructive or save/undo button; rendered after a divider
 */
export interface MinimizedBarAction {
  id: string;
  icon: React.ReactElement;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  color?: "primary" | "secondary" | "error" | "default";
  tooltip?: string;
  showOnDesktop?: boolean; // If false, only shows in mobile menu
  group?: "info" | "action";
}

/**
 * Props for the MinimizedBar component
 */
export interface MinimizedBarProps {
  // Header section
  icon: React.ReactElement;
  name?: string;
  id?: string;
  entityType?: string;

  // State flags
  hasId: boolean;
  isModified?: boolean;

  // Actions
  actions: MinimizedBarAction[];

  // Control buttons
  onExpand: () => void;
  onClose: () => void;

  // Optional map centering
  centerLocation?: [number, number];

  // Display mode
  isMobile: boolean;
}

/**
 * Props for MinimizedBarHeader
 */
export interface MinimizedBarHeaderProps {
  icon: React.ReactElement;
  name?: string;
  id?: string;
  entityType?: string;
  hasId: boolean;
  isMobile: boolean;
  onExpand: () => void;
}

/**
 * Props for MinimizedBarActions
 */
export interface MinimizedBarActionsProps {
  actions: MinimizedBarAction[];
  isSmallScreen: boolean;
}

/**
 * Props for MinimizedBarMenu
 */
export interface MinimizedBarMenuProps {
  actions: MinimizedBarAction[];
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}
