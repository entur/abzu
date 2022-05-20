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

import { configureStore } from "@reduxjs/toolkit";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import loggerMiddleware from "redux-logger";
import { createRootReducer } from "../reducers";
import Raven from "raven-js";
import createRavenMiddleware from "redux-raven-middleware";

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer,
} = createReduxHistoryContext({
  history: createBrowserHistory(),
});

const getMiddleware = () => {
  const middleware = [routerMiddleware];
  if (process.env.NODE_ENV === "development") {
    middleware.push(loggerMiddleware);
  } else {
    Raven.config(window.config.sentryDSN, {
      release: process.env.VERSION,
      stacktrace: true,
      environment: process.env.NODE_ENV,
    }).install();

    middleware.push(createRavenMiddleware);
  }
  return middleware;
};

export const getStore = () => {
  const store = configureStore({
    reducer: createRootReducer(routerReducer),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(getMiddleware()),
  });

  const history = createReduxHistory(store);

  return {
    store,
    history,
    Raven,
  };
};
