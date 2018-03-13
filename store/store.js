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

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import mapReducer from '../reducers/mapReducer';
import stopPlaceReducer from '../reducers/stopPlaceReducer';
import userReducer from '../reducers/userReducer';
import rolesReducer from '../reducers/rolesReducer';
import reportReducer from '../reducers/reportReducer';
import snackbarReducer from '../reducers/snackbarReducer';
import groupOfStopPlacesReducer from '../reducers/groupOfStopPlacesReducer';
import { routerReducer } from 'react-router-redux';
import SettingsManager from '../singletons/SettingsManager';
import PolygonManager from '../singletons/PolygonManager';
import rolesParser from '../roles/rolesParser';
import Raven from 'raven-js';
import createRavenMiddleware from 'redux-raven-middleware';
import { createTiamatClient } from '../graphql/clients';


const ravenConfig = require('../config/sentry.json');


export default function configureStore(kc) {
  const loggerMiddleware = createLogger();

  let enchancer = {};

  const tiamatClient = createTiamatClient();

  if (process.env.NODE_ENV === 'development') {
    enchancer = compose(
      applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        tiamatClient.middleware()
      )
    );
  } else {
    Raven.config(ravenConfig.publicKey, {
      release: process.env.VERSION,
      stacktrace: true,
      environment: process.env.NODE_ENV
    }).install();

    enchancer = compose(
      applyMiddleware(
        thunkMiddleware,
        createRavenMiddleware(Raven),
        tiamatClient.middleware()
      )
    );
  }

  new PolygonManager().fetch(tiamatClient, kc.tokenParsed);

  const Settings = new SettingsManager();

  const initialState = {
    stopPlace: {
      centerPosition: [64.349421, 16.809082],
      zoom: 6,
      minZoom: 14,
      isCompassBearingEnabled: Settings.getShowCompassBearing(),
      isCreatingPolylines: false,
      enablePolylines: Settings.getShowPathLinks(),
      showExpiredStops: Settings.getShowExpiredStops(),
      showMultimodalEdges: Settings.getShowMultimodalEdges(),
      lastMutatedStopPlaceId: [],
      isFetchingMergeInfo: false
    },
    user: {
      path: '/',
      isCreatingNewStop: false,
      missingCoordsMap: {},
      searchFilters: {
        stopType: [],
        topoiChips: [],
        text: '',
        showFutureAndExpired: false,
        searchWithCode: false,
        code: kc.tokenParsed.roles
      },
      snackbarOptions: {
        isOpen: false,
        message: ''
      },
      localization: {
        locale: null,
        messages: []
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
        stopPlaceId: null
      },
      client: tiamatClient,
      showPublicCode: Settings.getShowPublicCode()
    },
    roles: {
      kc,
      isGuest: kc.tokenParsed ? rolesParser.isGuest(kc.tokenParsed) : true
    }
  };

  const combinedReducer = combineReducers({
    mapUtils: mapReducer,
    user: userReducer,
    routing: routerReducer,
    stopPlace: stopPlaceReducer,
    report: reportReducer,
    apollo: tiamatClient.reducer(),
    roles: rolesReducer,
    snackbar: snackbarReducer,
    stopPlacesGroup: groupOfStopPlacesReducer
  });

  return {
    self: createStore(combinedReducer, initialState, enchancer),
    client: tiamatClient,
    Raven
  };
}
