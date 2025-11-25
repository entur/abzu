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

import { Help, Palette, Report, Settings } from "@mui/icons-material";
import React, { useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";

interface UseNavigationMenuProps {
  isMobile: boolean;
  onGoToReports: () => void;
}

export const useNavigationMenu = ({
  isMobile,
  onGoToReports,
}: UseNavigationMenuProps) => {
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (isMobile) {
        setMobileMenuOpen(true);
      } else {
        setAnchorEl(event.currentTarget);
      }
    },
    [isMobile],
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    setMobileMenuOpen(false);
    setOpenSubmenu(null);
  }, []);

  const handleSubmenuToggle = useCallback((submenuKey: string) => {
    setOpenSubmenu((current) => (current === submenuKey ? null : submenuKey));
  }, []);

  // Translations
  const reportSite = formatMessage({ id: "report_site" });
  const settings = formatMessage({ id: "settings" });
  const appearance = formatMessage({ id: "appearance" });
  const userGuide = formatMessage({ id: "user_guide" });

  // Icons
  const reportIcon = React.createElement(Report);
  const paletteIcon = React.createElement(Palette);
  const settingsIcon = React.createElement(Settings);
  const helpIcon = React.createElement(Help);

  const menuItems = useMemo(
    () => [
      {
        key: "reports",
        icon: reportIcon,
        text: reportSite,
        onClick: () => {
          handleClose();
          onGoToReports();
        },
      },
      {
        key: "divider1",
        type: "divider",
      },
      {
        key: "appearance",
        icon: paletteIcon,
        text: appearance,
        type: "submenu",
        componentName: "UICustomizationSection",
      },
      {
        key: "divider2",
        type: "divider",
      },
      {
        key: "settings",
        icon: settingsIcon,
        text: settings,
        type: "submenu",
        componentName: "SettingsMenuSection",
      },
      {
        key: "divider3",
        type: "divider",
      },
      {
        key: "language",
        type: "custom",
        componentName: "LanguageMenu",
      },
      {
        key: "divider4",
        type: "divider",
      },
      {
        key: "help",
        icon: helpIcon,
        text: userGuide,
        onClick: () => {
          handleClose();
          window.open(
            "https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/1225523302/User+guide+national+stop+place+registry",
            "_blank",
          );
        },
      },
    ],
    [
      reportSite,
      appearance,
      settings,
      userGuide,
      handleClose,
      onGoToReports,
      reportIcon,
      paletteIcon,
      settingsIcon,
      helpIcon,
    ],
  );

  return {
    anchorEl,
    mobileMenuOpen,
    openSubmenu,
    menuItems,
    handleClick,
    handleClose,
    handleSubmenuToggle,
    setMobileMenuOpen,
  };
};
