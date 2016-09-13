import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import * as reducers from '../reducers'

const loggerMiddleware = createLogger()

const initialState = {}

const combinedReducer = combineReducers({
  ...reducers,
})

export default function configureStore(history) {
  return createStore(
    combinedReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
}
