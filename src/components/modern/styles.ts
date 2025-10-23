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

import { SxProps, Theme } from "@mui/material";

/**
 * Centralized MUI theme-dependent styles for modern UI components
 * These styles use MUI theme tokens and should be used with the `sx` prop
 */

// ============================================================================
// Map Controls Panel Styles
// ============================================================================

export const mapControlPanelContainer = (theme: Theme): SxProps<Theme> => ({
  position: "absolute",
  top: 2,
  right: 2,
  width: 320,
  maxHeight: "calc(100vh - 200px)",
  zIndex: 999,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  animation: "slideIn 0.3s ease-in-out",
  "@keyframes slideIn": {
    from: {
      opacity: 0,
      transform: "translateX(20px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
});

export const mapControlPanelHeader = (theme: Theme): SxProps<Theme> => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  p: 2,
  borderBottom: `1px solid ${theme.palette.divider}`,
});

export const mapControlPanelHeaderTitle: SxProps<Theme> = {
  fontWeight: 600,
  fontSize: "1rem",
};

export const mapControlPanelContent: SxProps<Theme> = {
  flex: 1,
  overflow: "auto",
  p: 0,
};

export const mapControlButton = (theme: Theme): SxProps<Theme> => ({
  boxShadow: theme.shadows[6],
  "&:hover": {
    boxShadow: theme.shadows[8],
  },
});

// ============================================================================
// Menu Item Styles (used in panels)
// ============================================================================

export const panelMenuItem = (theme: Theme): SxProps<Theme> => ({
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
});

export const panelMenuItemIcon: SxProps<Theme> = {
  minWidth: 32,
};

export const panelMenuItemText: SxProps<Theme> = {
  fontSize: "0.875rem",
};

// ============================================================================
// Fare Zones Panel Styles
// ============================================================================

export const fareZoneListItem = (theme: Theme): SxProps<Theme> => ({
  display: "flex",
  mb: 0,
  my: 0.25,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderRadius: 1,
  },
});

export const fareZoneExpandButton: SxProps<Theme> = {
  transition: "transform 0.3s",
};

export const fareZoneLoadingContainer: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  p: 3,
};

// ============================================================================
// Dialog Styles
// ============================================================================

export const dialogTitleContainer: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  pr: 1,
};

export const dialogTitleText: SxProps<Theme> = {
  flex: 1,
};

export const dialogCloseButton = (theme: Theme): SxProps<Theme> => ({
  color: theme.palette.text.secondary,
});

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get expanded state transform for expand/collapse buttons
 */
export const getExpandTransform = (expanded: boolean): SxProps<Theme> => ({
  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
});

/**
 * Common styles for MUI MenuList in panels
 */
export const panelMenuList: SxProps<Theme> = {
  p: 0,
};

// ============================================================================
// Header Styles
// ============================================================================

export const headerToolbar: SxProps<Theme> = {
  minHeight: { xs: 56, sm: 64 },
  px: { xs: 1, sm: 2 },
  width: "100%",
};

export const headerLogoContainer: SxProps<Theme> = {
  ml: { xs: 2, sm: 2 },
};

export const headerTitle: SxProps<Theme> = {
  fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
  fontWeight: 500,
  color: "inherit",
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const headerSearchContainer: SxProps<Theme> = {
  flexGrow: 1,
  display: "flex",
  justifyContent: "center",
  mx: 2,
};

export const headerSpacer: SxProps<Theme> = {
  flexGrow: 1,
};

// ============================================================================
// SearchBox Styles
// ============================================================================

export const searchBoxFab = (theme: Theme): SxProps<Theme> => ({
  position: "absolute",
  top: 80,
  left: 16,
  zIndex: 1000,
  boxShadow: theme.shadows[6],
});

export const searchBoxPaper = (theme: Theme): SxProps<Theme> => ({
  position: "absolute",
  top: { xs: 70, sm: 70 },
  left: { xs: 8, sm: 8 },
  right: { xs: 8, sm: "auto" },
  width: { xs: "auto", sm: 480 },
  maxWidth: { xs: "calc(100vw - 16px)", sm: 480 },
  zIndex: 999,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
});

export const searchBoxCloseButton: SxProps<Theme> = {
  position: "absolute",
  top: 8,
  right: 8,
  zIndex: 1,
};

// ============================================================================
// Header Search Styles
// ============================================================================

export const headerSearchContentContainer: SxProps<Theme> = {
  p: 2,
};

export const headerSearchDesktopContainer: SxProps<Theme> = {
  position: "relative",
  width: "100%",
  maxWidth: 480,
  mx: 2,
};

export const headerSearchDesktopDropdown = (
  theme: Theme,
  isElevated: boolean,
): SxProps<Theme> => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: isElevated ? theme.zIndex.modal + 5 : theme.zIndex.modal + 2,
  mt: 1,
  maxHeight: "70vh",
  overflow: "auto",
});

export const headerSearchMobilePanel = (
  theme: Theme,
  isElevated: boolean,
): SxProps<Theme> => ({
  position: "fixed",
  top: 64,
  left: 8,
  right: 8,
  zIndex: isElevated ? theme.zIndex.modal + 5 : theme.zIndex.modal + 2,
  maxHeight: "calc(100vh - 80px)",
  overflow: "auto",
});

export const headerSearchIconButton = (
  theme: Theme,
  hasActiveFilters: boolean,
): SxProps<Theme> => ({
  color: hasActiveFilters ? theme.palette.primary.light : "inherit",
});

export const appLogoButton: SxProps<Theme> = {
  p: { xs: 1, sm: 1.5 },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
};

export const appLogoImage = (logoHeight?: {
  xs?: number;
  sm?: number;
  md?: number;
}): SxProps<Theme> => ({
  height: logoHeight
    ? {
        xs: logoHeight.xs || 32,
        sm: logoHeight.sm || 40,
        md: logoHeight.md || 48,
      }
    : { xs: 32, sm: 40, md: 48 },
  width: "auto",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

export const environmentBadgeChip = (
  theme: Theme,
  badge: any,
  isMobile: boolean,
): SxProps<Theme> => ({
  backgroundColor: badge.backgroundColor,
  color: badge.color,
  fontSize: isMobile ? "0.625rem" : badge.fontSize,
  fontWeight: badge.fontWeight,
  textTransform: badge.textTransform,
  height: { xs: 20, sm: 24 },
  "& .MuiChip-label": {
    px: { xs: 0.5, sm: 1 },
    py: 0,
  },
  boxShadow: theme.shadows[1],
  border: `1px solid rgba(255, 255, 255, 0.2)`,
});

// ============================================================================
// Menu Styles
// ============================================================================

export const menuItemPrimary = (theme: Theme): SxProps<Theme> => ({
  py: 1,
  px: 2,
  borderRadius: 1,
  mx: 1,
  mb: 0.5,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
});

export const menuItemSecondary = (theme: Theme): SxProps<Theme> => ({
  py: 0.5,
  px: 2,
  borderRadius: 1,
  mx: 1,
  mb: 0.5,
  fontSize: "0.875rem",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
});

export const menuItemIconPrimary = (theme: Theme): SxProps<Theme> => ({
  minWidth: 36,
  color: theme.palette.primary.main,
});

export const menuItemIconSecondary: SxProps<Theme> = {
  minWidth: 32,
};

export const menuListIndented: SxProps<Theme> = {
  pl: 2,
};

export const emptyCheckbox: SxProps<Theme> = {
  width: 20,
  height: 20,
};

// ============================================================================
// Form Field Styles
// ============================================================================

export const formFieldContainer: SxProps<Theme> = {
  px: 2,
  py: 1,
};

export const formFieldDivider: SxProps<Theme> = {
  my: 1,
};

export const formFieldLabel = (theme: Theme): SxProps<Theme> => ({
  fontWeight: 600,
  mb: 1.5,
  color: theme.palette.text.secondary,
});

export const formFieldRow: SxProps<Theme> = {
  display: "flex",
  gap: 1,
  mb: 1.5,
};

export const formButtonContainer: SxProps<Theme> = {
  display: "flex",
  gap: 1,
  flexDirection: "column",
};

// ============================================================================
// Common Layout Utilities
// ============================================================================

export const flexCenter: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const flexSpaceBetween: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
};

export const flexColumn: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
};
