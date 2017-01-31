import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from '../reducers'
import { routerReducer } from 'react-router-redux'
import createDebounce from 'redux-debounced'

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

const combinedReducer = combineReducers({
  editingStop: reducers.editStopReducer,
  stopPlaces: reducers.stopPlacesReducer,
  user: reducers.userReducer,
  routing: routerReducer
})

export default function configureStore(history) {
  return createStore(
    combinedReducer,
    initialState,
    enchancer
  )
}
