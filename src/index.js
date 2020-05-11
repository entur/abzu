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
import Keycloak from "keycloak-js";
import { Router, Route, browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import { ApolloProvider } from "react-apollo";
import Root from "./containers/Root";
import App from "./containers/App";
import StopPlaces from "./containers/StopPlaces";
import StopPlace from "./containers/StopPlace";
import ReportPage from "./containers/ReportPage";
import Routes from "./routes/";
import GroupOfStopPlaces from "./containers/GroupOfStopPlaces";

import cfgreader from "./config/readConfig";
import "intl";

import axios from "axios";
import ErrorBoundary from "./containers/ErrorBoundary";

function renderIndex(path, kc) {
  const configureStore = require("./store/store").default;
  const store = configureStore(kc);
  const history = syncHistoryWithStore(browserHistory, store.self);

  const renderApp = () => {
    render(
      <ErrorBoundary Raven={store.Raven}>
        <ApolloProvider store={store.self} client={store.client}>
          <Root>
            <App>
              <Router history={history}>
                <Route path={path} component={StopPlaces} />
                <Route
                  path={path + Routes.STOP_PLACE + "/:stopId"}
                  component={StopPlace}
                />
                <Route
                  path={path + Routes.GROUP_OF_STOP_PLACE + "/:groupId"}
                  component={GroupOfStopPlaces}
                />
                <Route path={path + "reports"} component={ReportPage} />
              </Router>
            </App>
          </Root>
        </ApolloProvider>
      </ErrorBoundary>,
      document.getElementById("root")
    );
  };

  renderApp();

  if (process.env.NODE_ENV !== "production") {
    if (module.hot) {
      module.hot.accept("./containers/App", () => {
        renderApp();
      });
    }
  }
}

cfgreader.readConfig(function (config) {
  window.config = config;

  let token = JSON.parse(localStorage.getItem("ABZU::GKT_TOKEN"));

  /* Renews token if it expires within 30 minutes to be on the safer side*/
  if (
    token != null &&
    token.expires > new Date(Date.now() + 60 * 1000 * 30).getTime()
  ) {
    authWithKeyCloak(config.endpointBase);
  } else {
    axios
      .get(config.endpointBase + "token")
      .then((response) => {
        let token = JSON.stringify(response.data);
        localStorage.setItem("ABZU::GKT_TOKEN", token);
      })
      .catch((err) => {
        console.warn(
          "Failed to get GK token, Kartverket Flyfoto will not work",
          err
        );
      });
    authWithKeyCloak(config.endpointBase);
  }
});

function authWithKeyCloak(path) {
  let kc = new Keycloak(window.config.endpointBase + "config/keycloak.json");

  kc.init({ onLoad: "login-required", checkLoginIframe: false }).success(
    (authenticated) => {
      if (authenticated) {
        localStorage.setItem("ABZU::jwt", kc.token);

        setInterval(() => {
          kc.updateToken(10).error(() => kc.logout());
          localStorage.setItem("ABZU::jwt", kc.token);
        }, 10000);

        renderIndex(path, kc);
      } else {
        kc.login();
      }
    }
  );
}
