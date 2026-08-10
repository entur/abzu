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
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  useTheme,
} from "@mui/material";
import React from "react";
import { menuItemPrimary } from "../../../../styles";
import { LanguageMenu } from "../../LanguageMenu";
import { SettingsMenuSection } from "../../SettingsMenuSection";
import { UICustomizationSection } from "../../UICustomizationSection";

interface MenuItemData {
  key: string;
  type?: string;
  icon?: React.ReactNode;
  text?: string;
  componentName?: string;
  onClick?: () => void;
}

interface MenuItemRendererProps {
  item: MenuItemData;
  isMobile: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

/**
 * Renders different types of menu items
 * Handles dividers, custom components, submenus, and regular menu items
 */
export const MenuItemRenderer: React.FC<MenuItemRendererProps> = ({
  item,
  isMobile,
  isOpen,
  onToggle,
  onClose,
}) => {
  const theme = useTheme();

  if (item.type === "divider") {
    return <Divider key={item.key} />;
  }

  if (item.type === "custom") {
    if (item.componentName === "LanguageMenu") {
      return (
        <LanguageMenu
          key={item.key}
          onClose={onClose}
          isMobile={isMobile}
          isOpen={isOpen}
          onToggle={onToggle}
        />
      );
    }
    return null;
  }

  if (item.type === "submenu") {
    if (item.componentName === "UICustomizationSection") {
      return (
        <UICustomizationSection
          key={item.key}
          onClose={onClose}
          isMobile={isMobile}
          isOpen={isOpen}
          onToggle={onToggle}
        />
      );
    }
    if (item.componentName === "SettingsMenuSection") {
      return (
        <SettingsMenuSection
          key={item.key}
          onClose={onClose}
          isMobile={isMobile}
          isOpen={isOpen}
          onToggle={onToggle}
        />
      );
    }
    return null;
  }

  const content = (
    <>
      <ListItemIcon
        sx={{
          minWidth: 36,
          color: theme.palette.primary.main,
        }}
      >
        {item.icon}
      </ListItemIcon>
      <ListItemText primary={item.text} />
    </>
  );

  // Mobile renders inside a plain <List>, which provides no MenuListContext.
  // MUI v9's MenuItem throws without one, so use ListItem there — same as
  // LanguageMenu, SettingsMenuSection and UICustomizationSection do.
  if (isMobile) {
    return (
      <ListItem
        key={item.key}
        onClick={item.onClick}
        sx={menuItemPrimary(theme)}
      >
        {content}
      </ListItem>
    );
  }

  return (
    <MenuItem key={item.key} onClick={item.onClick} sx={menuItemPrimary(theme)}>
      {content}
    </MenuItem>
  );
};
