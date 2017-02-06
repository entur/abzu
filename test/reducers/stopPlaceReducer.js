import * as types from './../../actions/actionTypes'
import expect from 'expect'
import { graphQLReducer } from './../../reducers/'

describe('stop place reducer', () => {

  it('should create new stop with coordinates', () => {

    const location = [40,10]

    const action = {
      type: types.CREATED_NEW_STOP,
      payLoad: location
    }

    const state = graphQLReducer({}, action)
    expect(state.newStop.location).toEqual(location)
  })
})

describe('apollo query fetch', () => {

  it('should return state by operation StopPlace', () => {
    // TODO
  })

  it('should return state by operation stopPlaceBBox', () => {
    // TODO
  })

  it('should return state by operation findStop', () => {
    // TODO
  })
})