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
import { StyledEngineProvider } from "@mui/material/styles";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import { IntlProvider } from "react-intl";
import { Route, Routes, useMatch } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { StopPlaceActions, UserActions } from "../../actions";
import { fetchUserPermissions, updateAuth } from "../../actions/UserActions";
import { useAuth } from "../../auth/auth";
import GlobalLoadingIndicator from "../../components/GlobalLoadingIndicator";
import LocalLoadingIndicator from "../../components/LocalLoadingIndicator";
import { HeaderSlotProvider } from "../../components/modern/Header/HeaderSlotContext";
import { ModernHeader } from "../../components/modern/Header/ModernHeader";
import { ModernEditStopMap } from "../../components/modern/Map/ModernEditStopMap";
import SnackbarWrapper from "../../components/SnackbarWrapper";
import { ConfigContext } from "../../config/ConfigContext";
import { OPEN_STREET_MAP } from "../../config/mapDefaults";
import configureLocalization from "../../localization/localization";
import AppRoutes from "../../routes";
import SettingsManager from "../../singletons/SettingsManager";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { history } from "../../store/store";
import { AbzuThemeProvider } from "../../theme/ThemeProvider";
import GroupOfStopPlaces from "./GroupOfStopPlaces";
import ReportPage from "./ReportPage";
import { StopPlace } from "./StopPlace";
import { StopPlaces } from "./StopPlaces";

/**
 * Persistent map — always mounted on stop and group routes, never torn down
 * between navigations. Lives inside <Router> so useMatch is available.
 */
const PersistentMap = () => {
  const matchReports = useMatch(`/${AppRoutes.REPORTS}`);
  if (matchReports) return null;
  return <ModernEditStopMap />;
};

const Settings = new SettingsManager();

interface ModernAppProps {
  children?: React.ReactNode;
}

/**
 * Modern App component - handles only modern UI mode
 * Duplicates boilerplate from LegacyApp for clean separation
 */
const App: React.FC<ModernAppProps> = () => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const { mapConfig, localeConfig, extPath } = useContext(ConfigContext);

  const localization = useAppSelector((state: any) => state.user.localization);
  const appliedLocale = useAppSelector(
    (state: any) => state.user.appliedLocale,
  );

  useEffect(() => {
    configureLocalization(
      appliedLocale,
      localeConfig?.defaultLocale,
      extPath,
    ).then((localization) => {
      dispatch(UserActions.changeLocalization(localization));
    });
  }, [appliedLocale, localeConfig?.defaultLocale, extPath, dispatch]);

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
  }, [auth, dispatch]);

  /**
   * To override the initial state in stopPlaceReducer/stopPlacesGroupReducer with bootstrapped custom values;
   * And determine the right map base layer;
   * Note: User's custom initial position/zoom from localStorage takes precedence over mapConfig
   */
  useEffect(() => {
    // Only use mapConfig center/zoom if user hasn't set custom values in localStorage
    const hasCustomPosition = Settings.getInitialPosition() !== null;
    const hasCustomZoom = Settings.getInitialZoom() !== null;

    if (mapConfig?.center && !hasCustomPosition && !hasCustomZoom) {
      dispatch(
        StopPlaceActions.changeMapCenter(mapConfig.center, mapConfig.zoom || 7),
      );
    }

    const layerBasedOnMapConfig =
      mapConfig?.defaultBaseLayer ||
      (mapConfig?.baseLayers &&
        mapConfig.baseLayers.length > 0 &&
        mapConfig.baseLayers[0].name);
    dispatch(
      UserActions.changeActiveBaselayer(
        Settings.getMapLayer() || layerBasedOnMapConfig || OPEN_STREET_MAP,
      ),
    );
  }, [mapConfig, dispatch]);

  if (localization.locale === null) {
    return null;
  }

  const basename = import.meta.env.BASE_URL;
  const path = "/";
  const config = { extPath, mapConfig, localeConfig };

  const appShell = (
    <div>
      <ModernHeader config={config} />
      <GlobalLoadingIndicator />
      <LocalLoadingIndicator />
      <Router basename={basename} history={history}>
        {/* Persistent map: mounted once, never torn down on route changes */}
        <PersistentMap />
        <Routes>
          <Route path={path} element={<StopPlaces />} />
          <Route
            path={path + AppRoutes.STOP_PLACE + "/:stopId"}
            element={<StopPlace />}
          />
          <Route
            path={path + AppRoutes.GROUP_OF_STOP_PLACE + "/:groupId"}
            element={<GroupOfStopPlaces />}
          />
          <Route path={path + AppRoutes.REPORTS} element={<ReportPage />} />
        </Routes>
      </Router>
      <SnackbarWrapper />
    </div>
  );

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
            <AbzuThemeProvider>
              <HeaderSlotProvider>{appShell}</HeaderSlotProvider>
            </AbzuThemeProvider>
          )}
        >
          <HeaderSlotProvider>{appShell}</HeaderSlotProvider>
        </ComponentToggle>
      </StyledEngineProvider>
    </IntlProvider>
  );
};

export default App;
