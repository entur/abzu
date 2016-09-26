import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from '../reducers'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import { createDevTools, persistState } from 'redux-devtools'

const loggerMiddleware = createLogger()

var enchancer = {}

if (process.env.NODE_ENV === 'development') {

  const DevTools = createDevTools(
    <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q">
      <LogMonitor theme="tomorrow" preserveScrollTop={false} />
    </DockMonitor>
  )

  enchancer = compose(
    applyMiddleware(thunkMiddleware, loggerMiddleware),
    DevTools.instrument(),
    persistState(
      window.location.href.match(
        /[?&]debug_session=([^&#]+)\b/
      )
    )
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
