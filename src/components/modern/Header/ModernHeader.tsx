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
import { push } from "redux-first-history";
import { UserActions } from "../../../actions";
import AppRoutes from "../../../routes";
import { useAuth } from "../../../auth/auth";
import { useAppDispatch } from "../../../store/hooks";
import { useEnvironmentStyles, useResponsive } from "../../../theme/hooks";
import { useTheme as useAbzuTheme } from "../../../theme/ThemeProvider";
import ConfirmDialog from "../../Dialogs/ConfirmDialog";
import "../modern.css";
import {
  headerLogoContainer,
  headerSearchContainer,
  headerTitle,
  headerToolbar,
} from "../styles";
import {
  AppLogo,
  EnvironmentBadge,
  HeaderSearch,
  HelpControl,
  LanguageControl,
  NavigationLine,
  SettingsControl,
  UserSection,
} from "./components";
import { useHeaderSlotContent } from "./HeaderSlotContext";
import { useLastMapLocation } from "./hooks/useLastMapLocation";

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
  const headerSlotContent = useHeaderSlotContent();
  const getLastMapLocation = useLastMapLocation();

  /* Stop places and parent stop places share one dirty flag and one route
     prefix; groups have their own of each. Both have to be consulted, or
     leaving a half-edited group discards it without asking. */
  const stopHasBeenModified = useSelector(
    (state: any) => state.stopPlace.stopHasBeenModified,
  );
  const groupHasBeenModified = useSelector(
    (state: any) => state.stopPlacesGroup.isModified,
  );
  const pathname = useSelector((state: any) => state.router.location.pathname);

  const isDisplayingReports = pathname === `/${AppRoutes.REPORTS}`;
  const isEditingStopPlace = pathname.includes(`/${AppRoutes.STOP_PLACE}/`);
  const isEditingGroup = pathname.includes(
    `/${AppRoutes.GROUP_OF_STOP_PLACE}/`,
  );

  const hasUnsavedChanges =
    (isEditingStopPlace && stopHasBeenModified) ||
    (isEditingGroup && groupHasBeenModified);
  const preferredName = useSelector((state: any) => state.user.preferredName);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = React.useState(false);
  const [actionOnDone, setActionOnDone] = React.useState<string>("GoToMain");

  const handleConfirmChangeRoute = (nextAction: () => void, action: string) => {
    if (!hasUnsavedChanges) {
      nextAction();
      return;
    }
    setIsConfirmDialogOpen(true);
    setActionOnDone(action);
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
      case "ReturnToMap":
        returnToMap();
        break;
      default:
        break;
    }
  };

  const goToMain = () => {
    dispatch(UserActions.navigateTo("/", ""));
  };

  /* Switching between the map and Reports is a tab change, not "go home":
     pushing the route directly skips the NAVIGATE_TO reset, so the map
     position and the open stop place or group survive the round trip. */
  const goToReports = () => {
    dispatch(push(import.meta.env.BASE_URL + AppRoutes.REPORTS));
  };

  const returnToMap = () => {
    dispatch(push(getLastMapLocation()));
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

          {/* Header center: page-injected slot content, or the default stop-place search */}
          <Box sx={headerSearchContainer}>
            {headerSlotContent ?? (!isDisplayingReports && <HeaderSearch />)}
          </Box>

          <UserSection
            isAuthenticated={auth.isAuthenticated}
            preferredName={preferredName}
            onLogin={handleLogin}
            onLogout={handleLogOut}
            isMobile={isMobile}
          />

          <LanguageControl />

          <HelpControl extPath={config.extPath} />

          <SettingsControl isMobile={isMobile} />
        </Toolbar>

        <NavigationLine
          onReturnToMap={() =>
            handleConfirmChangeRoute(returnToMap, "ReturnToMap")
          }
          onNavigateToReports={() =>
            handleConfirmChangeRoute(goToReports, "GoToReports")
          }
        />
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
