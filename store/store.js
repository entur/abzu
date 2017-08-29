import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import mapReducer from '../reducers/mapReducer';
import stopPlaceReducer from '../reducers/stopPlaceReducer';
import userReducer from '../reducers/userReducer';
import rolesReducer from '../reducers/rolesReducer';
import reportReducer from '../reducers/reportReducer';
import { routerReducer } from 'react-router-redux';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import SettingsManager from '../singletons/SettingsManager';
import PolygonManager from '../singletons/PolygonManager';
import rolesParser from '../roles/rolesParser';
import { IntrospectionFragmentMatcher } from 'react-apollo';
import schema from '../graphql/schema.json';

export default function configureStore(kc) {
  const loggerMiddleware = createLogger();

  var enchancer = {};

  const networkInterface = createNetworkInterface({
    uri: window.config.tiamatBaseUrl
  });

  networkInterface.use([
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
  ]);

  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: schema
  });

  const client = new ApolloClient({
    networkInterface,
    fragmentMatcher
  });

  if (process.env.NODE_ENV === 'development') {
    enchancer = compose(
      applyMiddleware(thunkMiddleware, loggerMiddleware, client.middleware())
    );
  } else {
    enchancer = compose(applyMiddleware(thunkMiddleware, client.middleware()));
  }

  new PolygonManager().fetch(client, kc.tokenParsed);

  const Settings = new SettingsManager();

  const initialState = {
    stopPlace: {
      centerPosition: [64.349421, 16.809082],
      zoom: 6,
      minZoom: 14,
      isCompassBearingEnabled: Settings.getShowCompassBearing(),
      isCreatingPolylines: false,
      enablePolylines: Settings.getShowPathLinks(),
      showExpiredStops: Settings.getShowExpiredStops()
    },
    user: {
      path: '/',
      isCreatingNewStop: false,
      missingCoordsMap: {},
      searchFilters: {
        stopType: [],
        topoiChips: [],
        text: ''
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
      newStopCreated: {
        open: false,
        stopPlaceId: null
      },
      client
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
    apollo: client.reducer(),
    roles: rolesReducer
  });

  return {
    self: createStore(combinedReducer, initialState, enchancer),
    client: client
  };
}
