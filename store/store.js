import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from '../reducers'
import { routerReducer } from 'react-router-redux'
import createDebounce from 'redux-debounced'
import ApolloClient,  { createNetworkInterface } from 'apollo-client'

const loggerMiddleware = createLogger()

var enchancer = {}

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://test.rutebanken.org/apiman-gateway/rutebanken/tiamat/1.0/graphql' })
})

if (process.env.NODE_ENV === 'development') {

  window.ReactPerf = require('react-addons-perf')

  enchancer = compose(
    applyMiddleware(createDebounce(), thunkMiddleware,loggerMiddleware, client.middleware()),
  )

} else {
  enchancer = compose(
    applyMiddleware(createDebounce(), thunkMiddleware, client.middleware())
  )
}

const initialState = {
  stopPlace: {
    centerPosition: [ 61.670029, 6.442342 ],
    zoom: 6,
    minZoom: 14
  }
}

const combinedReducer = combineReducers({
  editingStop: reducers.editStopReducer,
  user: reducers.userReducer,
  routing: routerReducer,
  stopPlace: reducers.graphQLReducer,
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
