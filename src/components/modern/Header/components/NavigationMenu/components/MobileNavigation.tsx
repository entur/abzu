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
import { IconButton, List, SwipeableDrawer } from "@mui/material";
import React from "react";
import { MenuItemRenderer } from "./MenuItemRenderer";

interface MobileNavigationProps {
  config: {
    extPath?: string;
  };
  menuItems: any[];
  mobileMenuOpen: boolean;
  openSubmenu: string | null;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  handleSubmenuToggle: (key: string) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

/**
 * Mobile navigation with drawer
 * Displays menu items in a right-side swipeable drawer
 */
export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  config,
  menuItems,
  mobileMenuOpen,
  openSubmenu,
  handleClick,
  handleClose,
  handleSubmenuToggle,
  setMobileMenuOpen,
}) => {
  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open navigation menu"
        onClick={handleClick}
        sx={{
          p: { xs: 1, sm: 1.5 },
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.08)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <SwipeableDrawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleClose}
        onOpen={() => setMobileMenuOpen(true)}
        slotProps={{
          paper: {
            sx: {
              width: 320,
              maxWidth: "90vw",
              pt: 2,
              display: "flex",
              flexDirection: "column",
              maxHeight: "100vh",
            },
          },
        }}
      >
        <List
          sx={{
            px: 1,
            overflow: "auto",
            flex: 1,
          }}
        >
          {menuItems.map((item) => (
            <MenuItemRenderer
              key={item.key}
              item={item}
              isMobile={true}
              isOpen={openSubmenu === item.key}
              onToggle={() => handleSubmenuToggle(item.key)}
              onClose={handleClose}
            />
          ))}
        </List>

        <ComponentToggle
          feature={`${config.extPath}/AdditionalMenuSection`}
          renderFallback={() => <></>}
        />
      </SwipeableDrawer>
    </>
  );
};
