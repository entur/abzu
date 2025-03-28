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

import { createTheme, StyledEngineProvider } from "@mui/material/styles";
import { useContext, useEffect } from "react";

import MuiThemeProvider from "@mui/material/styles/ThemeProvider";
import { Helmet } from "react-helmet";
import { IntlProvider } from "react-intl";
import { useDispatch } from "react-redux";
import { StopPlaceActions, UserActions } from "../actions";
import { fetchUserPermissions, updateAuth } from "../actions/UserActions";
import { useAuth } from "../auth/auth";
import Header from "../components/Header";
import SnackbarWrapper from "../components/SnackbarWrapper";
import { ConfigContext, TileProvider } from "../config/ConfigContext";
import { getTheme } from "../config/themeConfig";
import configureLocalization from "../localization/localization";
import { getStoredMapLayer } from "../singletons/SettingsManager";
import { useAppSelector } from "../store/hooks";

const muiTheme = createTheme(getTheme());

const App = ({ children }) => {
  const auth = useAuth();
  const dispatch = useDispatch();
  const { mapConfig } = useContext(ConfigContext);

  const localization = useAppSelector((state) => state.user.localization);
  const appliedLocale = useAppSelector((state) => state.user.appliedLocale);

  useEffect(() => {
    configureLocalization(appliedLocale).then((localization) => {
      dispatch(UserActions.changeLocalization(localization));
    });
  }, [appliedLocale]);

  useEffect(() => {
    dispatch(updateAuth(auth));
    if (!auth.isLoading) {
      dispatch(fetchUserPermissions());
    }
  }, [auth]);

  /**
   * To override the initial state in stopPlaceReducer/stopPlacesGroupReducer with bootstrapped custom values;
   * And determine the right map base layer;
   */
  useEffect(() => {
    if (mapConfig?.defaultCenter) {
      dispatch(
        StopPlaceActions.changeMapCenter(
          mapConfig.defaultCenter,
          mapConfig.defaultZoom || 7,
        ),
      );
    }

    const layerBasedOnMapConfig =
      mapConfig?.defaultTileProvider ||
      (mapConfig?.supportedTiles?.length > 0 &&
        mapConfig?.supportedTiles[0].name);
    dispatch(
      UserActions.changeActiveBaselayer(
        getStoredMapLayer() || layerBasedOnMapConfig || TileProvider.OSM,
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
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={muiTheme}>
          <div>
            <Header />
            {children}
            <SnackbarWrapper />
          </div>
        </MuiThemeProvider>
      </StyledEngineProvider>
    </IntlProvider>
  );
};

export default App;
