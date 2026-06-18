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
import {
  DesktopNavigation,
  MobileNavigation,
} from "./NavigationMenu/components";
import { useNavigationMenu } from "./NavigationMenu/hooks/useNavigationMenu";

interface NavigationMenuProps {
  config: {
    extPath?: string;
  };
  onConfirmChangeRoute: (action: () => void, actionName: string) => void;
  onGoToReports: () => void;
  isMobile: boolean;
}

/**
 * Navigation Menu component
 * Refactored into focused components for better maintainability
 * Displays mobile drawer or desktop popover based on device
 */
export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  config,
  onGoToReports,
  isMobile,
}) => {
  const {
    anchorEl,
    mobileMenuOpen,
    openSubmenu,
    menuItems,
    handleClick,
    handleClose,
    handleSubmenuToggle,
    setMobileMenuOpen,
  } = useNavigationMenu({
    isMobile,
    onGoToReports,
  });

  if (isMobile) {
    return (
      <MobileNavigation
        config={config}
        menuItems={menuItems}
        mobileMenuOpen={mobileMenuOpen}
        openSubmenu={openSubmenu}
        handleClick={handleClick}
        handleClose={handleClose}
        handleSubmenuToggle={handleSubmenuToggle}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    );
  }

  return (
    <DesktopNavigation
      config={config}
      menuItems={menuItems}
      anchorEl={anchorEl}
      openSubmenu={openSubmenu}
      handleClick={handleClick}
      handleClose={handleClose}
      handleSubmenuToggle={handleSubmenuToggle}
    />
  );
};
