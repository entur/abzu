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

import { ComponentToggle } from "@entur/react-component-toggle";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, IconButton, Menu, useTheme } from "@mui/material";
import React from "react";
import { MenuItemRenderer } from "./MenuItemRenderer";

interface DesktopNavigationProps {
  config: {
    extPath?: string;
  };
  menuItems: any[];
  anchorEl: HTMLElement | null;
  openSubmenu: string | null;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  handleSubmenuToggle: (key: string) => void;
}

/**
 * Desktop navigation with popover menu
 * Displays menu items in a dropdown menu
 */
export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  config,
  menuItems,
  anchorEl,
  openSubmenu,
  handleClick,
  handleClose,
  handleSubmenuToggle,
}) => {
  const theme = useTheme();

  return (
    <>
      <IconButton
        color="inherit"
        aria-owns={anchorEl ? "navigation-menu" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          p: 1.5,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Menu
        id="navigation-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 350,
              maxHeight: "calc(100vh - 120px)",
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        disableAutoFocus
        disableEnforceFocus
      >
        <Box
          sx={{
            overflow: "auto",
            flex: 1,
            py: 1,
          }}
        >
          {menuItems.map((item) => (
            <MenuItemRenderer
              key={item.key}
              item={item}
              isMobile={false}
              isOpen={openSubmenu === item.key}
              onToggle={() => handleSubmenuToggle(item.key)}
              onClose={handleClose}
            />
          ))}

          <ComponentToggle
            feature={`${config.extPath}/AdditionalMenuSection`}
            renderFallback={() => <></>}
          />
        </Box>
      </Menu>
    </>
  );
};
