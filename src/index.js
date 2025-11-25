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
import { AuthProvider } from "./auth/auth";
import { ConfigContext } from "./config/ConfigContext";
import { fetchConfig } from "./config/fetchConfig";
import LegacyApp from "./containers/LegacyApp";
import ModernApp from "./containers/modern/App";
import { getTiamatClient } from "./graphql/clients";
import { useAppSelector } from "./store/hooks";
import { store } from "./store/store";

/**
 * AppRouter - Switches between Legacy and Modern App based on uiMode
 * This component sits inside Redux Provider so it can access the uiMode state
 */
const AppRouter = () => {
  const uiMode = useAppSelector((state) => state.user.uiMode);

  // Render Modern App when uiMode is 'modern', otherwise Legacy App
  return uiMode === "modern" ? <ModernApp /> : <LegacyApp />;
};

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

  return (
    <Sentry.ErrorBoundary showDialog>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <AppRouter />
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
