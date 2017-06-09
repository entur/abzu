import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import mapReducer from '../reducers/mapReducer';
import stopPlaceReducer from '../reducers/stopPlaceReducer';
import userReducer from '../reducers/userReducer';
import reportReducer from '../reducers/reportReducer';
import { routerReducer } from 'react-router-redux';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

export default function configureStore(kc) {
  const loggerMiddleware = createLogger();

  var enchancer = {};

  const networkInterface = createNetworkInterface({
    uri: window.config.tiamatBaseUrl,
  });

  /*networkInterface.use([
    {
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }

        const token = localStorage.getItem('ABZU::jwt');
        req.options.headers.authorization = token ? `Bearer ${token}` : null;
        next();
      },
    } ,
  ]);*/

  const client = new ApolloClient({
    networkInterface: networkInterface,
  });

  if (process.env.NODE_ENV === 'development') {
    enchancer = compose(
      applyMiddleware(thunkMiddleware, loggerMiddleware, client.middleware()),
    );
  } else {
    enchancer = compose(applyMiddleware(thunkMiddleware, client.middleware()));
  }

  const initialState = {
    stopPlace: {
      centerPosition: [64.349421, 16.809082],
      zoom: 6,
      minZoom: 14,
      isCompassBearingEnabled: true,
      isCreatingPolylines: false,
      enablePolylines: true,
      kc: kc,
    },
    user: {
      path: '/',
      isCreatingNewStop: false,
      missingCoordsMap: {},
      searchFilters: {
        stopType: [],
        topoiChips: [],
        text: '',
      },
      snackbarOptions: {
        isOpen: false,
        message: '',
      },
      localization: {
        locale: null,
        messages: [],
      },
      appliedLocale: null,
      favoriteNameDialogIsOpen: false,
      removedFavorites: [],
      activeBaselayer: 'Rutebankens kart',
      activeElementTab: 0,
      showEditQuayAdditional: false,
      showEditStopAdditional: false,
      kc: kc,
    },
  };

  const combinedReducer = combineReducers({
    mapUtils: mapReducer,
    user: userReducer,
    routing: routerReducer,
    stopPlace: stopPlaceReducer,
    report: reportReducer,
    apollo: client.reducer(),
  });

  return {
    self: createStore(combinedReducer, initialState, enchancer),
    client: client,
  };
}
