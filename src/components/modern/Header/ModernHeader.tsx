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

import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { UserActions } from "../../../actions";
import { useAuth } from "../../../auth/auth";
import { useAppDispatch } from "../../../store/hooks";
import { useEnvironmentStyles, useResponsive } from "../../../theme/hooks";
import { useTheme as useAbzuTheme } from "../../../theme/ThemeProvider";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import "../modern.css";
import {
  headerLogoContainer,
  headerSearchContainer,
  headerSpacer,
  headerTitle,
  headerToolbar,
} from "../styles";
import {
  AppLogo,
  EnvironmentBadge,
  HeaderSearch,
  NavigationMenu,
  UserSection,
} from "./components";

interface ModernHeaderProps {
  config: {
    extPath?: string;
    mapConfig?: any;
    localeConfig?: any;
  };
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({ config }) => {
  const { formatMessage } = useIntl();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const theme = useTheme();
  const { isMobile } = useResponsive();
  const { environmentBadge, environment } = useEnvironmentStyles();
  const { themeConfig } = useAbzuTheme();

  const stopHasBeenModified = useSelector(
    (state: any) => state.stopPlace.stopHasBeenModified,
  );
  const isDisplayingReports = useSelector(
    (state: any) => state.router.location.pathname === "/reports",
  );
  const isDisplayingEditStopPlace = useSelector(
    (state: any) => state.router.location.pathname.indexOf("/stop_place/") > -1,
  );
  const preferredName = useSelector((state: any) => state.user.preferredName);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [actionOnDone, setActionOnDone] = React.useState<string>("GoToMain");

  const handleConfirmChangeRoute = (nextAction: () => void, action: string) => {
    if (isDisplayingReports) {
      nextAction();
    } else if (stopHasBeenModified && isDisplayingEditStopPlace) {
      setIsConfirmDialogOpen(true);
      setActionOnDone(action);
    } else {
      nextAction();
    }
  };

  const handleConfirm = () => {
    setIsConfirmDialogOpen(false);

    switch (actionOnDone) {
      case "GoToMain":
        goToMain();
        break;
      case "GoToReports":
        goToReports();
        break;
      default:
        console.info("Invalid action", actionOnDone, "ignored");
        break;
    }
  };

  const goToMain = () => {
    dispatch(UserActions.navigateTo("/", ""));
  };

  const goToReports = () => {
    dispatch(UserActions.navigateTo("reports", ""));
  };

  const handleLogin = () => {
    if (auth) {
      sessionStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname + window.location.search,
      );
      auth.login();
    }
  };

  const handleLogOut = () => {
    if (auth) {
      auth.logout({ returnTo: window.location.origin });
    }
  };

  const title = formatMessage({ id: "_title" });
  const logo = themeConfig?.assets?.logo || "/logo.png";
  const logoHeight = themeConfig?.assets?.logoHeight;

  return (
    <>
      <Helmet
        defaultTitle={formatMessage({ id: "_title" })}
        titleTemplate={`${formatMessage({ id: "_title" })} - %s`}
      />

      <AppBar
        position="static"
        elevation={2}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar disableGutters sx={headerToolbar}>
          <Box sx={headerLogoContainer}>
            <AppLogo
              logo={logo}
              logoHeight={logoHeight}
              config={config}
              onClick={() => handleConfirmChangeRoute(goToMain, "GoToMain")}
              isMobile={isMobile}
            />
          </Box>

          <Box sx={{ ml: { xs: 1, sm: 2 } }}>
            <Typography variant="h6" component="div" sx={headerTitle}>
              {/* Show title on desktop only */}
              {!isMobile && (
                <span className="app-title--override">{title}</span>
              )}

              {environmentBadge && (
                <EnvironmentBadge
                  environment={environment}
                  badge={environmentBadge}
                  isMobile={isMobile}
                />
              )}
            </Typography>
          </Box>

          {/* Search component in the center - hidden on reports page */}
          {!isDisplayingReports && (
            <Box sx={headerSearchContainer}>
              <HeaderSearch />
            </Box>
          )}

          {/* Spacer when search is hidden */}
          {isDisplayingReports && <Box sx={headerSpacer} />}

          <UserSection
            isAuthenticated={auth.isAuthenticated}
            preferredName={preferredName}
            onLogin={handleLogin}
            onLogout={handleLogOut}
            isMobile={isMobile}
          />

          <NavigationMenu
            config={config}
            onConfirmChangeRoute={handleConfirmChangeRoute}
            onGoToReports={() =>
              handleConfirmChangeRoute(goToReports, "GoToReports")
            }
            isMobile={isMobile}
          />
        </Toolbar>
      </AppBar>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        handleClose={() => setIsConfirmDialogOpen(false)}
        handleConfirm={handleConfirm}
        messagesById={{
          title: "discard_changes_title",
          body: "discard_changes_body",
          confirm: "discard_changes_confirm",
          cancel: "discard_changes_cancel",
        }}
        intl={{ formatMessage }}
      />
    </>
  );
};
