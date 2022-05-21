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
import { createRoot } from "react-dom/client";
import { Route, Routes } from "react-router-dom";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import AuthProvider from "@entur/auth-provider";
import Root from "./containers/Root";
import App from "./containers/App";
import StopPlaces from "./containers/StopPlaces";
import StopPlace from "./containers/StopPlace";
import ReportPage from "./containers/ReportPage";
import GroupOfStopPlaces from "./containers/GroupOfStopPlaces";
import cfgreader from "./config/readConfig";
import ErrorBoundary from "./containers/ErrorBoundary";
import { getStore } from "./store/store";
import { useGktToken } from "./hooks/useGktToken";
import AppRoutes from "./routes";
import "intl";
import { getTiamatClient } from "./graphql/clients";

const AuthenticatedApp = ({ path }) => {
  useGktToken(path);

  const client = getTiamatClient();

  const { store, history } = getStore();

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <Root>
            <App>
              <Router history={history}>
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
          </Root>
        </ApolloProvider>
      </Provider>
    </ErrorBoundary>
  );
};

function renderIndex(config) {
  const root = createRoot(document.getElementById("root"));
  root.render(
    <AuthProvider
      auth0Config={{
        domain: config.auth0Domain,
        clientId: config.auth0ClientId,
        audience: config.auth0Audience,
        redirectUri: window.location.origin,
      }}
      auth0ClaimsNamespace={config.auth0ClaimsNamespace}
      loginAutomatically={false}
    >
      <AuthenticatedApp path={config.endpointBase} />
    </AuthProvider>
  );
}

cfgreader.readConfig(function (config) {
  window.config = config;
  renderIndex(config);
});
