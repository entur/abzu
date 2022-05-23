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
import * as Sentry from "@sentry/react";

// ...

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
  });

const sentryReduxEnhancer = Sentry.createReduxEnhancer();

const getMiddleware = () => {
  const middleware = [routerMiddleware];
  if (process.env.NODE_ENV === "development") {
    middleware.push(loggerMiddleware);
  }
  return middleware;
};

export const getStore = () => {
  const store = configureStore({
    reducer: createRootReducer(routerReducer),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // TODO: these should be turned on at some point
        immutableCheck: false,
        serializableCheck: false,
      }).concat(getMiddleware()),
    enhancers: [sentryReduxEnhancer],
  });

  const history = createReduxHistory(store);

  return {
    store,
    history,
  };
};
