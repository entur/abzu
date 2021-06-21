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
import { render } from "react-dom";
import { Route } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import AuthProvider from "@entur/auth-provider";
import Root from "./containers/Root";
import App from "./containers/App";
import StopPlaces from "./containers/StopPlaces";
import StopPlace from "./containers/StopPlace";
import ReportPage from "./containers/ReportPage";
import Routes from "./routes/";
import GroupOfStopPlaces from "./containers/GroupOfStopPlaces";
import cfgreader from "./config/readConfig";
import ErrorBoundary from "./containers/ErrorBoundary";
import configureStore, { history } from "./store/store";
import { useGktToken } from "./hooks/useGktToken";
import "intl";

const AuthenticatedApp = ({ path }) => {
  useGktToken(path);
  const store = configureStore();

  return (
    <ErrorBoundary Raven={store.Raven}>
      <Provider store={store.self}>
        <ApolloProvider client={store.client}>
          <Root>
            <App>
              <ConnectedRouter history={history}>
                <Route exact path={path} component={StopPlaces} />
                <Route
                  exact
                  path={path + Routes.STOP_PLACE + "/:stopId"}
                  component={StopPlace}
                />
                <Route
                  exact
                  path={path + Routes.GROUP_OF_STOP_PLACE + "/:groupId"}
                  component={GroupOfStopPlaces}
                />
                <Route exact path={path + "reports"} component={ReportPage} />
              </ConnectedRouter>
            </App>
          </Root>
        </ApolloProvider>
      </Provider>
    </ErrorBoundary>
  );
};

function renderIndex(config) {
  render(
    <AuthProvider
      keycloakConfigUrl={config.endpointBase + "config/keycloak.json"}
      auth0Config={{
        domain: config.auth0Domain,
        clientId: config.auth0ClientId,
        audience: config.auth0Audience,
        redirectUri: window.location.origin,
      }}
      auth0ClaimsNamespace={config.auth0ClaimsNamespace}
      defaultAuthMethod={config.defaultAuthMethod}
      loginAutomatically={false}
    >
      <AuthenticatedApp path={config.endpointBase} />
    </AuthProvider>,
    document.getElementById("root")
  );
}

cfgreader.readConfig(function (config) {
  window.config = config;
  renderIndex(config);
});
