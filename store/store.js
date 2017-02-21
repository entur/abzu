import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import editStopReducer from '../reducers/editStopReducer'
import graphQLReducer from '../reducers/graphQLreducer'
import userReducer from '../reducers/userReducer'

import { routerReducer } from 'react-router-redux'
import ApolloClient,  { createNetworkInterface } from 'apollo-client'

const loggerMiddleware = createLogger()

var enchancer = {}

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: window.config.tiamatBaseUrl })
})

if (process.env.NODE_ENV === 'development') {

  window.ReactPerf = require('react-addons-perf')

  enchancer = compose(
    applyMiddleware(thunkMiddleware,loggerMiddleware, client.middleware()),
  )

} else {
  enchancer = compose(
    applyMiddleware(thunkMiddleware, client.middleware())
  )
}

const initialState = {
  stopPlace: {
    centerPosition: [ 64.349421, 16.809082 ],
    zoom: 6,
    minZoom: 14
  },
  use: {
    showEditQuayAdditional: false,
    showEditStopAdditional: false
  }
}

const combinedReducer = combineReducers({
  editingStop: editStopReducer,
  user: userReducer,
  routing: routerReducer,
  stopPlace: graphQLReducer,
  apollo: client.reducer()
})

export default function configureStore() {
  return {
    self: createStore(
      combinedReducer,
      initialState,
      enchancer
    ),
    client: client
  }
}
