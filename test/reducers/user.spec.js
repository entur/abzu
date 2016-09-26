import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from './../../actions/actionTypes'
import expect from 'expect'
import fs from 'fs'

import { userReducer } from './../../reducers/'

describe('user reducer', () => {

  it('Should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual({path: '/'})
  })

  it('Should change path upon navigating to page', () => {
    const resourceId = '2e0ceb56-a59c-4f15-8207-7a67ab629d54'
    expect(userReducer(undefined, { action: types.NAVIGATE_TO, payLoad: resourceId } ))
  })

})
