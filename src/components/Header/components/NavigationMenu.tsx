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
import {
  Help,
  Logout,
  Menu as MenuIcon,
  Report,
  Settings,
} from "@mui/icons-material";
import {
  Divider,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  useTheme,
} from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import { LanguageMenu } from "../LanguageMenu";
import { SettingsMenuSection } from "./SettingsMenuSection";

interface NavigationMenuProps {
  config: {
    extPath?: string;
  };
  onConfirmChangeRoute: (action: () => void, actionName: string) => void;
  onGoToReports: () => void;
  isMobile: boolean;
  isAuthenticated: boolean;
  preferredName?: string;
  onLogout: () => void;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({
  config,
  onGoToReports,
  isMobile,
  isAuthenticated,
  preferredName,
  onLogout,
}) => {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      setMobileMenuOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMobileMenuOpen(false);
  };

  // Translations
  const reportSite = formatMessage({ id: "report_site" });
  const settings = formatMessage({ id: "settings" });
  const userGuide = formatMessage({ id: "user_guide" });
  const logOut = formatMessage({ id: "log_out" });

  const menuItems = [
    {
      key: "reports",
      icon: <Report />,
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
      key: "settings",
      icon: <Settings />,
      text: settings,
      type: "submenu",
      component: SettingsMenuSection,
    },
    {
      key: "divider2",
      type: "divider",
    },
    {
      key: "language",
      type: "custom",
      component: LanguageMenu,
    },
    {
      key: "help",
      icon: <Help />,
      text: userGuide,
      onClick: () => {
        handleClose();
        window.open(
          "https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/1225523302/User+guide+national+stop+place+registry",
          "_blank",
        );
      },
    },
  ];

  if (isAuthenticated) {
    menuItems.push(
      {
        key: "divider3",
        type: "divider",
      },
      {
        key: "logout",
        icon: <Logout />,
        text: `${logOut} ${preferredName || ""}`,
        onClick: () => {
          handleClose();
          onLogout();
        },
      },
    );
  }

  const renderMenuItem = (item: any) => {
    if (item.type === "divider") {
      return <Divider key={item.key} />;
    }

    if (item.type === "custom") {
      return <item.component key={item.key} onClose={handleClose} />;
    }

    if (item.type === "submenu") {
      return (
        <item.component
          key={item.key}
          onClose={handleClose}
          isMobile={isMobile}
        />
      );
    }

    return (
      <MenuItem
        key={item.key}
        onClick={item.onClick}
        sx={{
          py: 1,
          px: 2,
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: theme.palette.primary.main,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </MenuItem>
    );
  };

  if (isMobile) {
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
          PaperProps={{
            sx: {
              width: 280,
              maxWidth: "80vw",
              pt: 2,
            },
          }}
        >
          <List sx={{ px: 1 }}>{menuItems.map(renderMenuItem)}</List>

          <ComponentToggle
            feature={`${config.extPath}/AdditionalMenuSection`}
            renderFallback={() => <></>}
          />
        </SwipeableDrawer>
      </>
    );
  }

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
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuItems.map(renderMenuItem)}

        <ComponentToggle
          feature={`${config.extPath}/AdditionalMenuSection`}
          renderFallback={() => <></>}
        />
      </Menu>
    </>
  );
};
