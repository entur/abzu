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

import { ApolloProvider } from "@apollo/client/react";
import {
  ComponentToggle,
  ComponentToggleProvider,
} from "@entur/react-component-toggle";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { useContext } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { AuthProvider } from "./auth/auth";
import GlobalLoadingIndicator from "./components/GlobalLoadingIndicator";
import LocalLoadingIndicator from "./components/LocalLoadingIndicator";
import { ConfigContext } from "./config/ConfigContext";
import { fetchConfig } from "./config/fetchConfig";
import App from "./containers/App";
import GroupOfStopPlaces from "./containers/GroupOfStopPlaces";
import ReportPage from "./containers/ReportPage";
import { StopPlace } from "./containers/StopPlace";
import StopPlaces from "./containers/StopPlaces";
import { getTiamatClient } from "./graphql/clients";
import AppRoutes from "./routes";
import { history, store } from "./store/store";

const AuthenticatedApp = () => {
  const config = useContext(ConfigContext);

  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: config.sentryDSN,
      integrations: [new BrowserTracing()],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,
      environment: config.tiamatEnv,
      release: `abzu@${process.env.REACT_APP_VERSION}`,
    });
  }

  const client = getTiamatClient();

  const basename = import.meta.env.BASE_URL;
  const path = "/";

  return (
    <Sentry.ErrorBoundary showDialog>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <App>
            <GlobalLoadingIndicator />
            <LocalLoadingIndicator />
            <Router basename={basename} history={history}>
              <Routes>
                <Route path={path} element={<StopPlaces />} />
                <Route
                  exact
                  path={path + AppRoutes.STOP_PLACE + "/:stopId"}
                  element={<StopPlace />}
                />
                <Route
                  exact
                  path={path + AppRoutes.GROUP_OF_STOP_PLACE + "/:groupId"}
                  element={<GroupOfStopPlaces />}
                />
                <Route
                  exact
                  path={path + AppRoutes.REPORTS}
                  element={<ReportPage />}
                />
              </Routes>
            </Router>
          </App>
        </ApolloProvider>
      </Provider>
    </Sentry.ErrorBoundary>
  );
};

function renderIndex(config) {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <ComponentToggleProvider
      maxFeatureDepth={2}
      flags={config.featureFlags}
      importFn={(featurePathComponents) => {
        if (featurePathComponents.length === 1) {
          return import(`./ext/${featurePathComponents[0]}/index.ts`);
        } else if (featurePathComponents.length === 2) {
          return import(
            `./ext/${featurePathComponents[0]}/${featurePathComponents[1]}/index.ts`
          );
        } else {
          throw new Error("Max feature depth is 2");
        }
      }}
    >
      <ConfigContext.Provider value={config}>
        <ComponentToggle feature={`${config.extPath}/CustomStyle`} />
        <AuthProvider>
          <AuthenticatedApp />
        </AuthProvider>
      </ConfigContext.Provider>
    </ComponentToggleProvider>,
  );
}

fetchConfig().then((config) => {
  window.config = config;
  renderIndex(config);
});
