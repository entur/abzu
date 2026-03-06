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
  createTheme,
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { IntlProvider } from "react-intl";
import { useDispatch } from "react-redux";
import { StopPlaceActions, UserActions } from "../actions";
import { fetchUserPermissions, updateAuth } from "../actions/UserActions";
import { useAuth } from "../auth/auth";
import SessionExpiredDialog from "../components/Dialogs/SessionExpiredDialog";
import Header from "../components/Header/Header";
import { OPEN_STREET_MAP } from "../components/Map/mapDefaults";
import SnackbarWrapper from "../components/SnackbarWrapper";
import { ConfigContext } from "../config/ConfigContext";
import { getTheme } from "../config/themeConfig";
import configureLocalization from "../localization/localization";
import SettingsManager from "../singletons/SettingsManager";
import { useAppSelector } from "../store/hooks";

const muiTheme = createTheme(getTheme());
const Settings = new SettingsManager();

const App = ({ children }) => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { mapConfig, localeConfig, extPath } = useContext(ConfigContext);

  const localization = useAppSelector((state) => state.user.localization);
  const appliedLocale = useAppSelector((state) => state.user.appliedLocale);

  useEffect(() => {
    configureLocalization(
      appliedLocale,
      localeConfig?.defaultLocale,
      extPath,
    ).then((localization) => {
      dispatch(UserActions.changeLocalization(localization));
    });
  }, [appliedLocale, localeConfig?.defaultLocale]);

  useEffect(() => {
    dispatch(updateAuth(auth));
    if (!auth.isLoading) {
      dispatch(fetchUserPermissions());
      if (auth.isAuthenticated) {
        const redirectPath = sessionStorage.getItem("redirectAfterLogin");
        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterLogin");
          const [pathname, search] = redirectPath.split("?");
          const cleanPath = pathname.replace("/", "");
          const queryString = search ? `?${search}` : "";
          dispatch(UserActions.navigateTo(cleanPath, queryString));
        }
      }
    }
  }, [auth]);

  /**
   * To override the initial state in stopPlaceReducer/stopPlacesGroupReducer with bootstrapped custom values;
   * And determine the right map base layer;
   */
  useEffect(() => {
    if (mapConfig?.center) {
      dispatch(
        StopPlaceActions.changeMapCenter(mapConfig.center, mapConfig.zoom || 7),
      );
    }

    const layerBasedOnMapConfig =
      mapConfig?.defaultTile ||
      (mapConfig?.tiles?.length > 0 && mapConfig?.tiles[0].name);
    dispatch(
      UserActions.changeActiveBaselayer(
        Settings.getMapLayer() || layerBasedOnMapConfig || OPEN_STREET_MAP,
      ),
    );
  }, [mapConfig]);

  if (localization.locale === null) {
    return null;
  }

  return (
    <IntlProvider
      key={localization.locale}
      locale={localization.locale}
      messages={localization.messages}
    >
      <Helmet>
        <html lang={localization.locale} />
      </Helmet>
      <ComponentToggle feature="CookieInformation" />
      <ComponentToggle feature="MatomoTracker" />
      <StyledEngineProvider injectFirst>
        <ComponentToggle
          feature={`${extPath}/CustomThemeProvider`}
          renderFallback={() => (
            <MuiThemeProvider theme={muiTheme}>
              <div>
                <Header config={config} />
                {children}
                <SnackbarWrapper />
              </div>
            </MuiThemeProvider>
          )}
        >
          <div>
            <Header config={config} />
            {children}
            <SnackbarWrapper />
            <SessionExpiredDialog />
          </div>
        </ComponentToggle>
      </StyledEngineProvider>
    </IntlProvider>
  );
};

export default App;
