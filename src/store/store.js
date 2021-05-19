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

import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createLogger } from "redux-logger";
import Raven from "raven-js";
import createRavenMiddleware from "redux-raven-middleware";
import { routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import SettingsManager from "../singletons/SettingsManager";
import { createTiamatClient } from "../graphql/clients";
import createRootReducer from "../reducers";

export const history = createBrowserHistory();

export default function configureStore() {
  let enchancer = {};

  const tiamatClient = createTiamatClient();

  if (process.env.NODE_ENV === "development") {
    const loggerMiddleware = createLogger({ collapsed: true });
    const composeEnhancers = composeWithDevTools({});

    enchancer = composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        thunkMiddleware,
        loggerMiddleware
      )
    );
  } else {
    Raven.config(window.config.sentryDSN, {
      release: process.env.VERSION,
      stacktrace: true,
      environment: process.env.NODE_ENV,
    }).install();

    enchancer = compose(
      applyMiddleware(
        routerMiddleware,
        thunkMiddleware,
        createRavenMiddleware(Raven)
      )
    );
  }

  const Settings = new SettingsManager();

  const initialState = {
    stopPlace: {
      centerPosition: [64.349421, 16.809082],
      zoom: 6,
      minZoom: 14,
      isCompassBearingEnabled: Settings.getShowCompassBearing(),
      isCreatingPolylines: false,
      enablePublicCodePrivateCodeOnStopPlaces: Settings.getEnablePublicCodePrivateCodeOnStopPlaces(),
      enablePolylines: Settings.getShowPathLinks(),
      showExpiredStops: Settings.getShowExpiredStops(),
      showMultimodalEdges: Settings.getShowMultimodalEdges(),
      lastMutatedStopPlaceId: [],
      isFetchingMergeInfo: false,
    },
    user: {
      path: "/",
      isCreatingNewStop: false,
      missingCoordsMap: {},
      searchFilters: {
        stopType: [],
        topoiChips: [],
        text: "",
        showFutureAndExpired: false,
      },
      snackbarOptions: {
        isOpen: false,
        message: "",
      },
      localization: {
        locale: null,
        messages: [],
      },
      appliedLocale: null,
      favoriteNameDialogIsOpen: false,
      removedFavorites: [],
      activeElementTab: 0,
      activeBaselayer: Settings.getMapLayer(),
      showEditQuayAdditional: false,
      showEditStopAdditional: false,
      lookupCoordinatesOpen: false,
      newStopIsMultiModal: false,
      serverTimeDiff: 0,
      newStopCreated: {
        open: false,
        stopPlaceId: null,
      },
      client: tiamatClient,
      showPublicCode: Settings.getShowPublicCode(),
      adjacentStopDialogOpen: false,
    },
    roles: {
      auth: {},
      fetchedPolygons: null,
      allowNewStopEverywhere: false,
    },
  };

  const store = createStore(
    createRootReducer(history),
    initialState,
    enchancer
  );

  return {
    self: store,
    client: tiamatClient,
    Raven,
  };
}
