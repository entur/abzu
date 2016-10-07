import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from '../reducers'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

const loggerMiddleware = createLogger()

var enchancer = {}

if (process.env.NODE_ENV === 'development') {

  enchancer = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
  )

} else {
  enchancer = compose(
    applyMiddleware(thunkMiddleware)
  )
}

const initialState = {}

const combinedReducer = combineReducers({
  ...reducers,
  routing: routerReducer
})

export default function configureStore(history) {
  return createStore(
    combinedReducer,
    initialState,
    enchancer
  )
}
