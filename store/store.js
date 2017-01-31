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

if (process.env.NODE_ENV === 'development') {

  window.ReactPerf = require('react-addons-perf')

  enchancer = compose(
    applyMiddleware(createDebounce(), thunkMiddleware,loggerMiddleware),
  )

} else {
  enchancer = compose(
    applyMiddleware( createDebounce(), thunkMiddleware)
  )
}

const initialState = {}

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'https://test.rutebanken.org/apiman-gateway/rutebanken/tiamat/1.0/graphql' })
})

const combinedReducer = combineReducers({
  editingStop: reducers.editStopReducer,
  stopPlaces: reducers.stopPlacesReducer,
  user: reducers.userReducer,
  routing: routerReducer,
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
